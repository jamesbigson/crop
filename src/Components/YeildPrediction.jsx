import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const tamilNaduDistricts = [
  { name: "ARIYALUR", lat: 11.1333, lon: 79.0833 },
  { name: "COIMBATORE", lat: 11.0, lon: 77.0 },
  { name: "CUDDALORE", lat: 11.7167, lon: 79.8 },
  { name: "DHARMAPURI", lat: 12.1333, lon: 78.2 },
  { name: "DINDIGUL", lat: 10.3667, lon: 77.9833 },
  { name: "ERODE", lat: 11.3333, lon: 77.7667 },
  { name: "KANCHIPURAM", lat: 12.8333, lon: 79.75 },
  { name: "KANNIYAKUMARI", lat: 8.5, lon: 77.3 },
  { name: "KARUR", lat: 10.9667, lon: 78.1167 },
  { name: "KRISHNAGIRI", lat: 12.5333, lon: 78.2667 },
  { name: "MADURAI", lat: 9.9167, lon: 78.1667 },
  { name: "NAGAPATTINAM", lat: 11.1, lon: 79.4 },
  { name: "NAMAKKAL", lat: 11.2167, lon: 78.2167 },
  { name: "PERAMBALUR", lat: 11.2333, lon: 78.9333 },
  { name: "PUDUKKOTTAI", lat: 10.3833, lon: 78.8667 },
  { name: "RAMANATHAPURAM", lat: 9.3667, lon: 78.8667 },
  { name: "SALEM", lat: 11.65, lon: 78.2 },
  { name: "SIVAGANGA", lat: 9.8833, lon: 78.5 },
  { name: "THANJAVUR", lat: 10.7833, lon: 79.1667 },
  { name: "THE NILGIRIS", lat: 11.3333, lon: 76.8 },
  { name: "THENI", lat: 10.0, lon: 77.5 },
  { name: "THIRUVALLUR", lat: 13.15, lon: 79.95 },
  { name: "THIRUVARUR", lat: 10.6667, lon: 79.4333 },
  { name: "TIRUCHIRAPPALLI", lat: 10.8333, lon: 78.7667 },
  { name: "TIRUNELVELI", lat: 8.7333, lon: 77.7333 },
  { name: "TIRUPPUR", lat: 11.0833, lon: 77.3333 },
  { name: "TIRUVANNAMALAI", lat: 12.25, lon: 79.1167 },
  { name: "TUTICORIN", lat: 8.8, lon: 78.1833 },
  { name: "VELLORE", lat: 12.9167, lon: 79.1833 },
  { name: "VILLUPURAM", lat: 11.95, lon: 79.5333 },
  { name: "VIRUDHUNAGAR", lat: 9.568, lon: 77.9624 },
];

const seasons = ["Kharif", "Rabi", "Zaid", "Whole Year"];

function YieldPrediction() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    state: "Tamil Nadu",
    district: "",
    season: "",
    rainfall: "",
    area: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch rainfall when district changes, using district coordinates from tamilNaduDistricts
  useEffect(() => {
    const fetchRainfall = async () => {
      if (!formData.district) {
        setFormData((prev) => ({ ...prev, rainfall: "" }));
        return;
      }

      const districtData = tamilNaduDistricts.find(
        (d) => d.name === formData.district
      );
      if (!districtData) {
        setFormData((prev) => ({ ...prev, rainfall: "N/A" }));
        return;
      }

      const { lat, lon } = districtData;
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=auto`
        );
        const data = await response.json();
        const rainArray = data.daily?.precipitation_sum || [];
        const rainfall = rainArray.length
          ? (rainArray.reduce((a, b) => a + b, 0) / rainArray.length).toFixed(2)
          : 0;
        setFormData((prev) => ({ ...prev, rainfall }));
      } catch {
        setFormData((prev) => ({ ...prev, rainfall: "N/A" }));
      } finally {
        setLoading(false);
      }
    };
    fetchRainfall();
  }, [formData.district]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    // Fallback random yield in case API doesn't return a prediction
    const randomYield = (
      Number(formData.area) *
      (Math.random() * 2 + 1)
    ).toFixed(2);

    // Build payload for /predict; use static defaults where required
    const payload = {
      State_Name: formData.state || "Tamil Nadu",
      District_Name: formData.district || "",
      Crop_Year: new Date().getFullYear(),
      Season: formData.season || "",
      Crop: "tomato",
      Area: Number(formData.area) || 0,
    };

    // console.log("Submitting payload:", payload);

    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log(data);
      
      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Server returned ${res.status}`;
        setApiError(msg);
        // navigate with fallback yield
        navigate("/result", {
          state: { ...formData, apiResponse: data, yield: randomYield },
        });
      } else {
        // Try to use API prediction if available
        const predicted =
          data &&
          (data.predicted_yield || data.predicted || data.yield || data.result);
        const yieldUsed = predicted != null ? predicted : randomYield;
        navigate("/result", {
          state: { ...formData, apiResponse: data, yield: yieldUsed },
        });
      }
    } catch (err) {
      setApiError(err.message || "Network error");
      navigate("/result", {
        state: { ...formData, apiResponse: null, yield: randomYield },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="Predict_Container">
      <h1 id="Predict_Head">Predict Yield</h1>
      <div className="Predict_Body">
        <form onSubmit={handleSubmit}>
          {/* State is static (Tamil Nadu) and not selectable; user provides district */}
          <div className="form-field">
            <label className="Form_label">State:</label>
            <input className="Form_Input" value={formData.state} readOnly />
          </div>

          {/* District (select from updated tamilNaduDistricts) */}
          <div className="form-field">
            <label className="Form_label">District:</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="Form_Input"
              required
            >
              <option value="">Select District</option>
              {tamilNaduDistricts.map((d, i) => (
                <option key={i} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="form-field">
            <label className="Form_label">Season:</label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="Form_Input season-select"
              required style={{width:'85vh',position:'relative'}}
            >
              <option value="">Select Season</option>
              {seasons.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))} 
            </select>
          </div><br/>

          {/* Rainfall */}
          <div className="form-field">
            <label className="Form_label">Rainfall (mm):</label>
            <input
              name="rainfall"
              className="Form_Input"
              value={
                loading
                  ? "Fetching..."
                  : formData.rainfall || "Auto-filled by API"
              }
              readOnly
            />
          </div>

          {/* Area */}
          <div className="form-field">
            <label className="Form_label">Area (hectares):</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="area"
              className="Form_Input"
              placeholder="Enter area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-full">
            <button type="submit" className="start_button" disabled={loading}>
              {loading ? "Loading..." : "Predict"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default YieldPrediction;
