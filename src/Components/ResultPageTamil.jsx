import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const apiResponse = data?.apiResponse;

  console.log("பெறப்பட்ட தரவு", data);

  if (!data) {
    return (
      <div id="Predict_Container">
        <h1 id="Predict_Head">தரவு கிடைக்கவில்லை</h1>
        <button className="start_button" onClick={() => navigate("/Yeild")}>
          திரும்பிச் செல்லவும்
        </button>
      </div>
    );
  }

  return (
    <div id="Predict_Container">
      <h1 id="Predict_Head">முன்கணிப்பு முடிவு 🌾</h1>
      <div className="Predict_Body">
        <p>
          <b>{data.district}</b> மாவட்டத்தில் <b>{data.season}</b> காலத்தில் எதிர்பார்க்கப்படும் விளைச்சல்:
        </p>
        <h2 style={{ color: "green", fontSize: "2em", marginTop: "1em" }}>
          {apiResponse &&
          Array.isArray(apiResponse.top3) &&
          apiResponse.top3.length ? (
            <>
              {apiResponse.top3[0].crop}:{" "}
              {Number(apiResponse.top3[0].predicted_yield).toLocaleString(
                undefined,
                { maximumFractionDigits: 2 }
              )}{" "}
              டன்
            </>
          ) : (
            `${data.yield} டன்`
          )}
        </h2>

        <div style={{ width: "60%", marginTop: "4vh" }}>
          {apiResponse &&
          Array.isArray(apiResponse.top3) &&
          apiResponse.top3.length ? (
            <Bar
              data={{
                labels: apiResponse.top3.map((t) => t.crop),
                datasets: [
                  {
                    label: "முன்கணிக்கப்பட்ட விளைச்சல்",
                    data: apiResponse.top3.map((t) =>
                      Number(t.predicted_yield)
                    ),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          ) : (
            <Bar
              data={{
                labels: ["மழைப்பொழிவு (mm)", "விளைச்சல் (டன்)"],
                datasets: [
                  {
                    label: "மதிப்புகள்",
                    data: [data.rainfall, data.yield],
                    backgroundColor: ["#7ed957", "#2f9e44"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          )}
        </div>

        <div className="form-full">
          <button className="start_button" onClick={() => navigate("/")}>
            முகப்புக்கு செல்லவும்
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
