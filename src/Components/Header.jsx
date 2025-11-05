import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useLanguage } from "./LanguageContext.jsx";

function Header() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const btnRef = useRef(null);

  // ✅ Access language and toggle function
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    // ✅ Add/remove class on body to allow .ta / .en CSS styling
    document.body.classList.remove("en", "ta");
    document.body.classList.add(language);
  }, [language]);

  useEffect(() => {
    function handleDocumentClick(e) {
      if (!open) return;
      const navEl = navRef.current;
      const btnEl = btnRef.current;
      if (
        navEl &&
        !navEl.contains(e.target) &&
        btnEl &&
        !btnEl.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // ✅ Toggle button text — switches between English / Tamil
  const toggleText = language === "en" ? "தமிழ்" : "English";

  return (
    <div className="HeadBody">
      <Link to="/" className="brand-link">
        <h1 id="project-name">
          {language === "en" ? "Crop Yield Prediction" : "பயிர் விளைச்சல் கணிப்பு"}
        </h1>
      </Link>

      <button
        ref={btnRef}
        className={`hamburger ${open ? "is-open" : ""}`}
        aria-label="Toggle navigation"
        onClick={() => setOpen((s) => !s)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav ref={navRef} id="Navigation" className={open ? "open" : ""}>
        {language === "en" ? (
          <>
            <Link className="link" to="/Pest">Fertilizer</Link>
            <Link className="link">Solutions</Link>
            <Link className="link" to="/About">About</Link>
            <Link className="link">Blog</Link>
            <Link className="link">Help</Link>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/Sign">
                <button className="start_buttons">Login</button>
              </Link>
              <button className="lang_button" onClick={toggleLanguage}>
                {toggleText}
              </button>
            </div>
          </>
        ) : (
          <>
            <Link className="link" to="/Pest">உர பரிசோதனை</Link>
            <Link className="link">தீர்வுகள்</Link>
            <Link className="link" to="/About">எங்களை பற்றி</Link>
            <Link className="link">வலைப்பதிவு</Link>
            <Link className="link">உதவி</Link>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/Sign">
                <button className="start_buttons">உள்நுழைக</button>
              </Link>
              <button className="lang_button" onClick={toggleLanguage}>
                {toggleText}
              </button>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;
