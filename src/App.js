import './App.css';
import { useNavigate } from 'react-router-dom';
import Feedback from './Components/Feedback';

function App() {
  return (
    <div className="App">
      <Hero />
      <GrowSmart />
      <Feedback />
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
        Smarter farming starts with data<br/>Personalized crop picks for your land
      </h1>
      <div className='Hero_button'>
        <button onClick={handleTryNow}>Try it now</button>
        <button>See how</button>
      </div>
    </div>
  );
}

function GrowSmart() {
  return (
    <div id='Grow'>
      <h1>Grow smarter with data-driven choices</h1>
      <div id='Grow_body'>
        <div className='Grow_item'>
          <h3>Personalized crop recommendations</h3>
          <p>Share your location and season, and we’ll suggest the best crops for your unique conditions. Skip the uncertainty—get tailored advice you can trust.</p>
        </div>
        <div className='Grow_item'>
          <h3>Live weather and rainfall updates</h3>
          <p>We pull the latest climate data for your area, so every suggestion fits your real-world environment. Make every decision with up-to-date insights.</p>
        </div>
        <div className='Grow_item'>
          <h3>See your crops before you plant</h3>
          <p>Preview vibrant images of recommended crops, helping you plan with confidence and clarity. Visualize your harvest before it begins.</p>
        </div>
        <div className='Grow_item'>
          <h3>Clear yield and price forecasts</h3>
          <p>Access straightforward yield and market price estimates, empowering you to plan for a rewarding, profitable season. All the key numbers, all in one place.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
