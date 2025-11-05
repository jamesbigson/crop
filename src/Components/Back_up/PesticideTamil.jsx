import React, { useState } from "react";
import Tesseract from "tesseract.js";

function Pesticide() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en"); // "en" or "ta"

  const t = {
    en: {
      uploadLabel: "Upload Image (fertilizer label):",
      sendSample: "Send sample payload",
      orText: 'or upload a photo below and click "Read label and Describe"',
      readLabel: "Read label and Describe",
      working: "Working...",
      extractedText: "Extracted text",
      parsedResult: "Parsed result",
      chemName: "Chemical name",
      extracted: "Extracted",
      source: "Source",
      error: "Error",
      toggle: "Switch to Tamil",
    },
    ta: {
      uploadLabel: "படத்தை பதிவேற்றவும் (உரம் லேபிள்):",
      sendSample: "மாதிரி தரவை அனுப்பவும்",
      orText: 'அல்லது கீழே புகைப்படத்தை பதிவேற்றி "லேபிளை படித்து விவரிக்கவும்" அழுத்தவும்',
      readLabel: "லேபிளை படித்து விவரிக்கவும்",
      working: "செயல்படுத்தப்படுகிறது...",
      extractedText: "எடுக்கப்பட்ட உரை",
      parsedResult: "பகுக்கப்பட்ட முடிவு",
      chemName: "வேதியியல் பெயர்",
      extracted: "எடுக்கப்பட்டது",
      source: "மூலம்",
      error: "பிழை",
      toggle: "Switch to English",
    },
  };

  const handleImageChange = (e) => {
    setError(null);
    setParsed(null);
    setOcrText("");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // preprocessImage(), runOcrAndDescribe(), sendSample() — keep same as your code above

  return (
    <div className="form-field">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setLang(lang === "en" ? "ta" : "en")}>{t[lang].toggle}</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={sendSample} disabled={loading} style={{ marginRight: 8 }}>
          {t[lang].sendSample}
        </button>
        <span style={{ color: "#666" }}>{t[lang].orText}</span>
      </div>

      <label className="Form_label">{t[lang].uploadLabel}</label>
      <input
        type="file"
        accept="image/*"
        name="cropImage"
        onChange={handleImageChange}
        className="Form_Input"
      />

      {image && (
        <div style={{ marginTop: 12 }}>
          <img src={URL.createObjectURL(image)} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={runOcrAndDescribe} disabled={loading}>
              {loading ? t[lang].working : t[lang].readLabel}
            </button>
          </div>
        </div>
      )}

      {ocrText && (
        <div style={{ marginTop: 12 }}>
          <h4>{t[lang].extractedText}</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{ocrText}</pre>
        </div>
      )}

      {parsed && (
        <div style={{ marginTop: 12 }}>
          <h4>{t[lang].parsedResult}</h4>
          <div>
            <strong>{t[lang].chemName}:</strong>{" "}
            {parsed.chemical_name || parsed.chemicalName || "—"}
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>{t[lang].extracted}:</strong>
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f7f7f7",
              padding: 8,
            }}
          >
            {JSON.stringify(parsed.extracted || parsed, null, 2)}
          </pre>
          <div style={{ marginTop: 8 }}>
            <strong>{t[lang].source}:</strong> {parsed.source || "local"}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, color: "red" }}>
          {t[lang].error}: {error}
        </div>
      )}
    </div>
  );
}

export default Pesticide;
