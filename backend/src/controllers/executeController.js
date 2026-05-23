import { ENV } from '../lib/env.js';

// Map our frontend language identifiers to Judge0 language IDs
const LANGUAGE_IDS = {
  javascript: 93, // Node.js 18.15.0
  python: 92,     // Python 3.11.2
  java: 91,       // JDK 17.0.6
  cpp: 76         // C++ (GCC 13.0.0)
};

/**
 * Proxies code execution request to Judge0 Public API or RapidAPI
 * POST /api/execute
 */
export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Language and code are required'
      });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`
      });
    }

    // Determine if we should use custom RapidAPI credentials or the free public Judge0 endpoint
    const apiKey = ENV.RAPIDAPI_KEY;
    const apiHost = ENV.RAPIDAPI_HOST;

    const useRapidAPI = apiKey && apiKey !== 'your_rapidapi_key_here' && apiKey.trim() !== '';

    let url;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (useRapidAPI) {
      url = `https://${apiHost}/submissions?base64_encoded=true&wait=true`;
      headers['x-rapidapi-key'] = apiKey;
      headers['x-rapidapi-host'] = apiHost;
      console.log('Routing code execution to RapidAPI Judge0...');
    } else {
      url = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';
      console.log('Routing code execution to public keyless ce.judge0.com...');
    }

    // Base64 encode the code to prevent formatting/JSON parsing issues
    const base64Code = Buffer.from(code).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        source_code: base64Code,
        language_id: languageId,
        stdin: '' // standard input empty by default
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Execution API error! ${errorText || response.statusText}`
      });
    }

    const data = await response.json();

    // Helper to decode Base64 safely
    const decodeBase64 = (str) => {
      if (!str) return '';
      return Buffer.from(str, 'base64').toString('utf8');
    };

    const stdout = decodeBase64(data.stdout);
    const stderr = decodeBase64(data.stderr);
    const compileOutput = decodeBase64(data.compile_output);
    const status = data.status || {};

    // Map Judge0 statuses to frontend success/error state
    // Status ID 3 is "Accepted" (ran successfully)
    if (status.id === 3) {
      return res.status(200).json({
        success: true,
        output: stdout || 'No output',
        error: stderr || null
      });
    }

    // Status ID 6 is "Compilation Error"
    if (status.id === 6) {
      return res.status(200).json({
        success: false,
        output: '',
        error: compileOutput || 'Compilation Error'
      });
    }

    // Status ID 5 is "Time Limit Exceeded"
    if (status.id === 5) {
      return res.status(200).json({
        success: false,
        output: '',
        error: 'Time Limit Exceeded (Code execution took too long)'
      });
    }

    // Other runtime/system errors
    return res.status(200).json({
      success: false,
      output: stdout || '',
      error: stderr || compileOutput || status.description || 'Execution failed'
    });

  } catch (error) {
    console.error('Error in executeCode controller:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`
    });
  }
}
