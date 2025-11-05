import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./Components/LanguageContext.jsx";

import App from "./App";
import AppTamil from "./AppTamil";
import Header from "./Components/Header";
import HeaderTamil from "./Components/HeaderTamil";
import About from "./Components/About";
import SignIn from "./Components/SignIn";
import SignInTamil from "./Components/SignInTamil";
import SignUp from "./Components/SignUp";
import SignUpTamil from "./Components/SignUpTamil";
import ResultPage from "./Components/ResultPage";
import ResultPageTamil from "./Components/ResultPageTamil";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProtectedRouteTamil from "./Components/ProtectedRouteTamil";
import UploadBox from "./Components/FertiCheck";
import FertiCheckTamil from "./Components/FertiCheckTamil";
import YieldPrediction from "./Components/YeildPrediction.jsx";

function LayoutWithHeader() {
  const { language } = useLanguage();
  const HeaderComponent = language === "en" ? Header : HeaderTamil;
  return (
    <>
      <HeaderComponent />
      <Outlet />
    </>
  );
}

function AppRoutes() {
  const { language } = useLanguage();

  return (
    <Routes>
      <Route element={<LayoutWithHeader />}>
        <Route path="/" element={language === "en" ? <App /> : <AppTamil />} />
        <Route path="/Yeild" element={<YieldPrediction />} />
        <Route path="/About" element={<About />} />
        <Route
          path="/Result"
          element={language === "en" ? <ResultPage /> : <ResultPageTamil />}
        />
        <Route
          path="/Pest"
          element={language === "en" ? <UploadBox /> : <FertiCheckTamil />}
        />
      </Route>

      {/* pages without header */}
      <Route
        path="/Sign"
        element={language === "en" ? <SignIn /> : <SignInTamil />}
      />
      <Route
        path="/signup"
        element={language === "en" ? <SignUp /> : <SignUpTamil />}
      />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </LanguageProvider>
);
