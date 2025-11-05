import "./Feedback.css";
import { useState } from "react";
import emailjs from "emailjs-com";

function Feedback() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("அனுப்பப்படுகிறது...");

    const templateParams = {
      from_email: email,
      message: question,
      rating: rating,
    };

    emailjs
      .send(
        "service_jagsujk",     // உங்கள் EmailJS service ID
        "template_2xu9tvv",    // உங்கள் EmailJS template ID
        templateParams,
        "GaWV95l1x6YuQYp7G"   // உங்கள் EmailJS public key
      )
      .then(
        () => {
          setStatus("✅ உங்கள் கேள்வி வெற்றிகரமாக அனுப்பப்பட்டது!");
          setEmail("");
          setQuestion("");
          setRating(0);
        },
        (error) => {
          console.error(error);
          setStatus("❌ அனுப்ப முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.");
        }
      );
  };

  return (
    <div id="Questions_Block">
      <div id="Ask_Questions">
        <h2>உங்கள் பயிர் கேள்விகளுக்கு பதில்கள்</h2>
        <p>
          எங்கள் பரிந்துரைகள் எப்படி செயல்படுகிறது என்று ஆர்வமாக உள்ளீர்களா?
          ஒவ்வொரு பருவத்திற்கும் நம்பிக்கையுடன், சரியான முடிவுகளை எடுக்க
          நாங்கள் உங்களுக்கு உதவுகிறோம். ஆரம்பிக்க சில பொதுவான கேள்விகள் இங்கே.
        </p>

        <form onSubmit={handleSubmit}>
          <label>மின்னஞ்சல்:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>உங்கள் கேள்வியை எழுதுங்கள்:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          ></textarea>

          <label>எங்கள் சேவையை மதிப்பிடுங்கள்:</label>
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

          <button type="submit">இப்போதே கேளுங்கள்</button>
        </form>

        {status && <p style={{ marginTop: "1em", color: "#007b00" }}>{status}</p>}
      </div>

      <div id="Questions_Asked">
        <div className="Question">
          <h4>பயிர் பரிந்துரைகள் எப்படி செயல்படுகின்றன?</h4>
          <p>
            உங்கள் இருப்பிடம், பருவம் மற்றும் நிலப்பரப்பை அண்மை கால வானிலை மற்றும்
            சந்தைத் தகவல்களுடன் இணைத்து, உங்கள் நிலைக்கு ஏற்ற நிலையான மற்றும்
            லாபகரமான பயிர் பரிந்துரைகளை வழங்குகிறோம்.
          </p>
        </div>
        <hr className="custom-line" />

        <div className="Question">
          <h4>எந்த விவரங்களை உள்ளிட வேண்டும்?</h4>
          <p>
            ஆண்டு, பருவம், மாநிலம் மற்றும் உங்களுடைய நிலப்பரப்பு அளவு ஆகியவற்றை மட்டும்
            பதிவிடுங்கள். வானிலை மற்றும் மழைத் தரவுகளை நாங்களே
            பெற்றுக் கொள்கிறோம், அதனால் உங்களுக்கு எளிதாக இருக்கும்.
          </p>
        </div>
        <hr className="custom-line" />

        <div className="Question">
          <h4>பயிர்களின் புகைப்படங்களை பார்க்க முடியுமா?</h4>
          <p>
            நிச்சயம்! ஒவ்வொரு பரிந்துரைக்கப்பட்ட பயிருக்கும் உண்மையான படம்
            இணைக்கப்பட்டுள்ளது, அதனால் நீங்கள் வளர்த்துப் பார்க்கும் முன்பே
            அதைப் பற்றி அறியலாம்.
          </p>
        </div>
        <hr className="custom-line" />

        <div className="Question">
          <h4>இந்த சேவை உண்மையிலேயே இலவசமா?</h4>
          <p>
            ஆம், இது முழுமையாக இலவசம். எங்கள் நோக்கம் ஒவ்வொரு விவசாயிக்கும்
            நம்பகமான, தரவு அடிப்படையிலான தீர்வுகளை வழங்குவது —
            கட்டணமில்லாமல், மறைமுக செலவுகளின்றி, புத்திசாலித்தனமான விவசாயத்திற்காக.
          </p>
        </div>
        <hr className="custom-line" />
      </div>
    </div>
  );
}

export default Feedback;
