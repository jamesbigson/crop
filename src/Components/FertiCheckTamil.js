import React, { useState } from "react";
import axios from "axios";
import "./FertiCheck.css";
import GeminiResponse from "./GeminiResponse";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // 🖼️ கோப்பு பதிவேற்றம்
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("தயவுசெய்து ஒரு படத்தைத் தேர்ந்தெடுக்கவும்!");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5001/capture-text",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 180000,
        }
      );
      setExtractedText(res.data.text || "எந்த எழுத்தும் கண்டறியப்படவில்லை");
    } catch (err) {
      console.error("பிழை:", err?.response?.data || err.message);
      alert("படத்தை செயலாக்கும் போது பிழை ஏற்பட்டது. Backend பதிவுகளைச் சரிபார்க்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* பதிவேற்ற பகுதி */}
      <div className="container summarizer-container">
        <div className="row w-100 mb-4">
          <div className="col-lg-10 mx-auto">
            <div className="summarizer-card">
              <div className="summarizer-top">
                <div>
                  <div className="summarizer-title">உர சரிபார்ப்பு (Fertilizer Checker)</div>
                  <div className="summarizer-sub">
                    உங்கள் உரத்தின் லேபிள் (label) படத்தைப் பதிவேற்றவும்
                  </div>
                </div>

                <div className="file-row">
                  <input
                    type="file"
                    className="file-input"
                    id="document"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    className="summarize-btn"
                    onClick={handleUpload}
                    disabled={loading || !file}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        செயலாக்கப்படுகிறது...
                      </>
                    ) : (
                      "பதிவேற்று & விளக்கவும்"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* எடுத்தெடுக்கப்பட்ட எழுத்து பகுதி */}
      <div className="row w-1200 mt-0">
        <div className="col-lg-10 mx-auto">
          {extractedText && (
            <div className="summary-card">
              <div className="summary-heading">
                <span className="pin-icon">📄</span>
                விளக்கம்
              </div>

              <GeminiResponse text={extractedText} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
