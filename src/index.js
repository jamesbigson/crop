import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from './App';
import YieldPrediction from './Components/YeildPrediction.jsx';
import Header from './Components/Header.jsx';
import About from './Components/About.jsx';
import SignIn from './Components/SignIn.jsx';
import SignUp from './Components/SignUp.jsx';
import ResultPage from './Components/ResultPage.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Pesticide from './Components/Pesticide.jsx';
import UploadBox from './Components/UploadBox.js';

// Layout with header
function LayoutWithHeader() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* pages with header */}
      <Route element={<LayoutWithHeader />}>
        <Route path='/' element={<App />} />
        <Route path='/Yeild' element={<ProtectedRoute><YieldPrediction/></ProtectedRoute>} />
        {/* <Route path='/Yeild' element={<YieldPrediction/>} /> */}
        <Route path='/About' element={<About />} />
        <Route path='/Result' element={<ResultPage />} />
        {/* <Route path='/Pest' element={<Pesticide/>}/> */}
        <Route path='/Pest' element={<UploadBox/>}/>
      </Route>

      {/* pages without header */}
      <Route path='/Sign' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);
