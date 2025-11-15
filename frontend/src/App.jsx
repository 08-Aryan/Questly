import {SignInButton, SignOutButton, UserButton,SignedIn,SignedOut, useUser} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";

// No need to wrap userbutton in signed in/signed out components
function App() {
  const {isSignedIn,isLoaded}=useUser()
  if(!isLoaded) return null;
  return (
    <>
    <Routes>
      <Route path='/' element={!isSignedIn?<HomePage /> :<Navigate to={"/dashboard"}/> }/>
      <Route path='/dashboard' element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"}/>} />
      <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"}/>} />
    </Routes>
    <Toaster toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
