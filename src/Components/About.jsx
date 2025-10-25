function About(){
  return(
    <>
    <div id='About'>
      <p>Our project is a Crop Recommendation Demo Web Application designed to assist farmers and agricultural researchers in making informed decisions about crop selection based on environmental and economic factors. The application integrates real-time and historical weather data by fetching annual rainfall records from the Open-Meteo API, ensuring that recommendations are tailored to actual climatic conditions. It also incorporates a crop recommendation module (currently a mock model but easily extendable to machine learning or backend prediction services) that suggests the most suitable crop along with its expected yield and market price. To enhance user experience, the system dynamically retrieves and displays relevant crop images from Unsplash through a secure backend proxy, allowing farmers to visually identify the recommended crops. The user-friendly interface, built with HTML, CSS, and JavaScript, includes interactive form inputs for year, season, state, and cultivation area, and presents results in a clean, responsive design. Error handling, input validation, and data formatting are implemented to improve reliability and usability. Overall, the project demonstrates how the integration of APIs, simple machine learning logic, and intuitive UI design can create a practical digital tool to support sustainable agriculture and decision-making.</p>
    </div>
    </>
  )
}

export default About;