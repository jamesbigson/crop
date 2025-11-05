import React, { useState } from "react";
import Tesseract from "tesseract.js";

function Pesticide() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setError(null);
    setParsed(null);
    setOcrText("");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const preprocessImage = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1600;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let min = 255,
          max = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          data[i] = data[i + 1] = data[i + 2] = gray;
          if (gray < min) min = gray;
          if (gray > max) max = gray;
        }
        const range = max - min || 1;
        for (let i = 0; i < data.length; i += 4) {
          let gval = data[i];
          gval = Math.round(((gval - min) * 255) / range);
          const threshold = 140;
          const out = gval > threshold ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = out;
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Failed to create blob"));
          resolve(URL.createObjectURL(blob));
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = URL.createObjectURL(file);
    });

  const runOcrAndDescribe = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setParsed(null);

    try {
      const preprocessedUrl = await preprocessImage(image);
      const {
        data: { text },
      } = await Tesseract.recognize(preprocessedUrl, "eng", {
        logger: (m) => {},
      });
      try {
        URL.revokeObjectURL(preprocessedUrl);
      } catch (e) {}
      setOcrText(text);

      const localUrl = "/pesticide-info";
      // Split the OCR text into an array of words, filtering out empty strings.
      const words = (text || "").split(/\s+/).filter(Boolean);
      const payload = { content: words };

      const resp = await fetch(localUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const errBody = await resp.text();
        throw new Error(`Server error ${resp.status}: ${errBody}`);
      }

      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const bodyResp = await resp.json();
        setParsed(bodyResp);
      } else {
        const bodyResp = await resp.text();
        setParsed({ raw: bodyResp });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const sendSample = async () => {
    const payload = {
      chemical_name: "Example",
      content:
        "Active ingredient: 45% (w/w) compound X (CAS 123456-78-9). It is toxic and flammable.",
    };
    try {
      setLoading(true);
      setError(null);
      setParsed(null);
      const resp = await fetch("/pesticide-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Server ${resp.status}`);
      const data = await resp.json();
      setParsed(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-field">
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={sendSample}
          disabled={loading}
          style={{ marginRight: 8 }}
        >
          Send sample payload
        </button>
        <span style={{ color: "#666" }}>
          or upload a photo below and click "Read label and Describe"
        </span>
      </div>

      <label className="Form_label">Upload Image (fertilizer label):</label>
      <input
        type="file"
        accept="image/*"
        name="cropImage"
        onChange={handleImageChange}
        className="Form_Input"
      />

      {image && (
        <div style={{ marginTop: 12 }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={runOcrAndDescribe} disabled={loading}>
              {loading ? "Working..." : "Read label and Describe"}
            </button>
          </div>
        </div>
      )}

      {ocrText && (
        <div style={{ marginTop: 12 }}>
          <h4>Extracted text</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{ocrText}</pre>
        </div>
      )}

      {parsed && (
        <div style={{ marginTop: 12 }}>
          <h4>Parsed result</h4>
          <div>
            <strong>Chemical name:</strong>{" "}
            {parsed.chemical_name || parsed.chemicalName || "—"}
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>Extracted:</strong>
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
            <strong>Source:</strong> {parsed.source || "local"}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, color: "red" }}>Error: {error}</div>
      )}
    </div>
  );
}

export default Pesticide;
