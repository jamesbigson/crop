import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const apiResponse = data?.apiResponse;

  console.log("Received data", data);

  if (!data) {
    return (
      <div id="Predict_Container">
        <h1 id="Predict_Head">No Data Found</h1>
        <button className="start_button" onClick={() => navigate("/Yeild")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div id="Predict_Container">
      <h1 id="Predict_Head">Prediction Result 🌾</h1>
      <div className="Predict_Body">
        <p>
          Expected yield for <b>{data.district}</b> during <b>{data.season}</b>:
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
              tons
            </>
          ) : (
            `${data.yield} tons`
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
                    label: "Predicted yield",
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
                labels: ["Rainfall (mm)", "Yield (tons)"],
                datasets: [
                  {
                    label: "Values",
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
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
