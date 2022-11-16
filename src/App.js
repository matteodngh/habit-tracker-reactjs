import './App.css';
import React from 'react';

import SignIn from './Pages/SignIn/sign-in';
import SignUp from './Pages/SignUp/sign-up';
import ConfirmEmail from './Pages/ConfirmEmail/confirm-email';
import ForgotPassword from './Pages/ForgotPassword/forgot-password';
import NewPassword from './Pages/NewPassword/new-password';
import Home from './Pages/Home/home';
import Stats from './Pages/Stats/stats';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => {

});

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="confirm-email" element={<ConfirmEmail />} />
        <Route path="new-password" element={<NewPassword />} />
        <Route path="home" element={<Home />} />
        <Route path="stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
