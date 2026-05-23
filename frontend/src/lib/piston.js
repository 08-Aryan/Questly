import axiosInstance from "./axios";

/**
 * Executes source code by proxying the request through the Express backend (/api/execute)
 * @param {string} language - programming language ('javascript', 'python', 'java', 'cpp')
 * @param {string} code - source code to be executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/execute", { language, code });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || "Failed to execute code";
    return {
      success: false,
      error: errorMsg,
      output: ""
    };
  }
}