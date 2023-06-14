import './App.css';
import Navbar from './components/Navbar'
import Test2 from '../src/pages/Test2'
import Main from './pages/Main';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Browse from './pages/Browse';
import Coins from './pages/Coins';

import Test1 from './pages/ErrorHandlingExample';

import LoginTestErase from './pages/LoginTestErase';

import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

import Profile from './pages/Profile';

import Footer from './components/Footer';
import ProtectedRoute from './pages/ProtectedRoute';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from './features/user/userSlice';


// consider getting store values here instead of from individual page
// and use a timer to update every min or so

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const validateToken = async (token) => {
        try {
            const res = await axios.get("/api/user/validate-token", {
                headers: {
                    Authorization: token,
                },
            });
            console.log("Token is valid", res);
        } catch (error) {
            console.error("Token is invalid or not provided");
            dispatch(logoutUser())
        }
    };
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      console.log('call validate token')
      validateToken(user?.token);
    } else {
      console.log('not call validate token')
    }
}, [dispatch]);

  return (
  <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/main' element={<Main/>}/> 
          <Route path='/browse' element={<Browse/>}/> 
          {/* <Route path='/test1' element={<Test1/>}/>
          <Route path='/' element={<Test2/>}/> */}
          {/* <Route path='/loginTest' element={<LoginTestErase/>}/> */}
          <Route path='/coins/:id' element={
            <ProtectedRoute>
              <Coins/>
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer/>
      </Router>
      <ToastContainer />
    </>
    
  );
}

export default App;
