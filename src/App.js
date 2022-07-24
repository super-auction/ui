// import './App.css';
import { Grid } from '@mui/material'
import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import BiddingPage from './pages/BiddingPage'
import Menu from './pages/Menu'
import ViewProductPage from './pages/ViewProductPage'

function App() {
  return (
    <>
        <Grid container justifyContent="center" columns={12}>
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/home" element={<Menu />} /> 
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/bid" element={<BiddingPage />} /> 
          <Route path="/product/:id" element={<ViewProductPage />} /> 
        </Routes>
        </Grid>
    </>
  );
}

export default App;
