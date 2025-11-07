import './App.css';
import {SignInButton, SignOutButton, UserButton,SignedIn,SignedOut} from "@clerk/clerk-react";
// No need to wrap userbutton in signed in/signed out components
function App() {
  return (
    <>
      <h1>Welcome to app</h1>
      <SignedOut>
        <SignInButton mode='modal'>
          <button>Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      
      <UserButton/>
    </>
  )
}

export default App
