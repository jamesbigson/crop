import './App.css';
import { useNavigate } from 'react-router-dom';
import FeedbackTamil from './Components/FeedbackTamil';

function App() {
  return (
    <div className="App">
      <Hero />
      <GrowSmart />
      <FeedbackTamil />
    </div>
  );
}

// Hero with login check
function Hero() {
  const navigate = useNavigate();

  const handleTryNow = () => {
    if (localStorage.getItem("user")) {
      navigate("/Yeild");
    } else {
      navigate("/Sign");
    }
  };

  return (
    <div id='Hero'>
      <img className='Back_img' src='/new.jpg' alt='hero'/>
      <h1>
        புத்திசாலி விவசாயம் தரவால் தொடங்குகிறது<br/>உங்கள் நிலத்திற்கு தனிப்பட்ட பயிர் பரிந்துரைகள்
      </h1>
      <div className='Hero_button'>
        <button onClick={handleTryNow}>இப்போதே முயற்சிக்கவும்</button>
        <button>எப்படி செயல்படுகிறது</button>
      </div>
    </div>
  );
}

function GrowSmart() {
  return (
    <div id='Grow'>
      <h1>தரவு சார்ந்த முடிவுகளுடன் புத்திசாலியாக வளருங்கள்</h1>
      <div id='Grow_body'>
        <div className='Grow_item'>
          <h3>தனிப்பட்ட பயிர் பரிந்துரைகள்</h3>
          <p>
            உங்கள் இருப்பிடம் மற்றும் பருவத்தை பகிருங்கள்; அதன்படி உங்கள் நிலைமைக்கு ஏற்ற சிறந்த
            பயிர்களை நாங்கள் பரிந்துரைக்கிறோம். குழப்பமின்றி, நம்பிக்கையுடன் முடிவு எடுக்கலாம்.
          </p>
        </div>

        <div className='Grow_item'>
          <h3>நேரடி வானிலை மற்றும் மழை அப்டேட்கள்</h3>
          <p>
            உங்கள் பகுதியின் சமீபத்திய வானிலைத் தகவல்களை நாங்கள் சேகரிக்கிறோம்,
            எனவே ஒவ்வொரு பரிந்துரையும் உங்கள் சூழ்நிலைக்கு தகுந்ததாக இருக்கும்.
            ஒவ்வொரு முடிவையும் புதுப்பிக்கப்பட்ட தகவல்களுடன் எடுக்கலாம்.
          </p>
        </div>

        <div className='Grow_item'>
          <h3>நட்டமிடும் முன் பயிர்களைப் பாருங்கள்</h3>
          <p>
            பரிந்துரைக்கப்பட்ட பயிர்களின் வண்ணமிகு படங்களை முன்கூட்டியே காணலாம்,
            இதனால் நம்பிக்கையுடன் உங்கள் அறுவடைத் திட்டத்தை அமைக்கலாம்.
          </p>
        </div>

        <div className='Grow_item'>
          <h3>தெளிவான மகசூல் மற்றும் விலை முன்னறிவிப்பு</h3>
          <p>
            தெளிவான மகசூல் மற்றும் சந்தை விலை கணிப்புகளைப் பெறலாம்,
            இதனால் லாபகரமான பருவத்திற்கான திட்டமிடல் எளிதாகும்.
            எல்லா முக்கிய தரவுகளும் ஒரே இடத்தில் கிடைக்கும்.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
