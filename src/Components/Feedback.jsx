import "./Feedback.css";
import { useState } from "react";
import emailjs from "emailjs-com";

function Feedback() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0); // Rating state
  const [hover, setHover] = useState(0);   // Hover effect state
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const templateParams = {
      from_email: email,
      message: question,
      rating: rating,
    };

    emailjs
      .send(
        "service_jagsujk",     // Replace with your EmailJS service ID
        "template_2xu9tvv",    // Replace with your EmailJS template ID
        templateParams,
        "GaWV95l1x6YuQYp7G"   // Replace with your EmailJS public key
      )
      .then(
        () => {
          setStatus("✅ Your question has been sent successfully!");
          setEmail("");
          setQuestion("");
          setRating(0);
        },
        (error) => {
          console.error(error);
          setStatus("❌ Failed to send message. Try again later.");
        }
      );
  };

  return (
    <div id="Questions_Block">
      <div id="Ask_Questions">
        <h2>Your crop questions, answered</h2>
        <p>
          Curious about how our recommendations work? We’re here to help you
          make confident, informed choices for every season. Explore these
          common questions to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Ask Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>

          <label>Rate our service:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hover || rating) ? "star filled" : "star"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
            {rating > 0 && <span className="rating-value">{rating}/5</span>}
          </div>

          <button type="submit">Ask now</button>
        </form>

        {status && <p style={{ marginTop: "1em", color: "#007b00" }}>{status}</p>}
      </div>

      <div id="Questions_Asked">
        <div className="Question">
          <h4>How do crop suggestions work?</h4>
          <p>
            We combine your location, season, and area with the latest climate
            and market data. This way, you get crop recommendations that are
            both sustainable and profitable for your unique situation.
          </p>
        </div>
        <hr className="custom-line" />
        <div className="Question">
          <h4>What details should I enter?</h4>
          <p>
            Just share the year, season, state, and area you want to plant. We’ll
            gather the weather and rainfall info for you, making the process
            simple and stress-free.
          </p>
        </div>
        <hr className="custom-line" />
        <div className="Question">
          <h4>Will I see crop photos?</h4>
          <p>
            Absolutely! Every recommended crop comes with a real image, so you
            can see what you’ll be growing before you get started.
          </p>
        </div>
        <hr className="custom-line" />
        <div className="Question">
          <h4>Is this service really free?</h4>
          <p>
            Yes, it’s completely free. Our mission is to support every grower
            with reliable, data-driven insights—no fees, no surprises, just
            smarter farming.
          </p>
        </div>
        <hr className="custom-line" />
      </div>
    </div>
  );
}

export default Feedback;
