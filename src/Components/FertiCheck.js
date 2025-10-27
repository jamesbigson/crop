import React, { useState, useRef } from "react";
import axios from "axios";
import "./FertiCheck.css";
import GeminiResponse from "./GeminiResponse";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // 🖼️ File upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");
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
      setExtractedText(res.data.text || "No text detected");

      console.log(setExtractedText);
    } catch (err) {
      console.error("Error:", err?.response?.data || err.message);
      alert("Error processing image. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upload Section */}
      <div className="container summarizer-container">
        <div className="row w-100 mb-4">
          <div className="col-lg-10 mx-auto">
            <div className="summarizer-card">
              <div className="summarizer-top">
                <div>
                  <div className="summarizer-title">Fertilizer checker</div>
                  <div className="summarizer-sub">
                    Upload the image of your fertilizer label
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
                        Processing...
                      </>
                    ) : (
                      "Upload & Explain"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Text Section */}
      <div className="row w-1200 mt-0">
        <div className="col-lg-10 mx-auto">
          {extractedText && (
            <div className="summary-card">
              <div className="summary-heading">
                <span className="pin-icon">📄</span>
                Description
              </div>

              <GeminiResponse text={extractedText} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
