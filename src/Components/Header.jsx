import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

function Header() {
  const [open, setOpen] = useState(false);

  const navRef = useRef(null);
  const btnRef = useRef(null);

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
    document.addEventListener("touchstart", handleDocumentClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("touchstart", handleDocumentClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <div className="HeadBody">
        <Link to="/" className="brand-link">
          <h1 id="project-name">Crop Yeild Prediction</h1>
        </Link>

        {/* Hamburger for mobile */}
        <button
          ref={btnRef}
          className={`hamburger ${open ? "is-open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          ref={navRef}
          id="Navigation"
          className={open ? "open" : ""}
          onClick={() => setOpen(false)}
        >
          <Link className="link" to="/Pest">
            Fertilizer
          </Link>
          <Link className="link">Solutions</Link>
          <Link className="link" to="/About">
            About
          </Link>
          <Link className="link">Blog</Link>
          <Link className="link">Help</Link>

          <Link to="/Sign">
            <button className="start_buttons">Login</button>
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Header;
