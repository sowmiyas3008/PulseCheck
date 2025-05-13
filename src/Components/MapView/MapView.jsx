
import { useState} from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import axios from 'axios'
import { useEffect } from 'react';

const FlyToCity = ({ coords }) => {
  const map = useMap();
  map.setView(coords, 11);
  return null;
};

const MapView = () => {
  const[city,setCity] = useState('');
  const[coords,setCoords] = useState([19.0760, 72.8777]);
  const[weather,setWeather]  = useState(null);
  const[news,setNews] = useState([]);
  const[aqi,setAqi] = useState(null);

  const openCageKey = '8be7e7561b3c4f9ea59d94eb5a1f401b';
  const weatherApiKey = '0903619c7f5ca331d22876c8eeee03d4';
  const gnewsApiKey = '8832c71caacd99f7e9c1f2bde09d3b2e';
  const aqiKey = 'c3c7079e-fa4d-48f9-8955-b2356d97edc0';


  const handleSearch = async () => {

    if (!city) return;
  
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${openCageKey}`);
      const { lat, lng } = response.data.results[0].geometry;
      setCoords([lat, lng]);
      fetchWeather(city);
      fetchNews(city);
      fetchAQI(lat,lng);
    } catch (error) {
      alert('City not found. Try again.');
      console.error(error);
    }
  };

  const fetchWeather = async (cityName) => {
    try{
      const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherApiKey}`);
      setWeather(weatherRes.data);
    }
    catch(error){
      console.error('Error fetching weather',error);
      setWeather(null);
    }


  };

  useEffect(()=>{
    fetchWeather('Mumbai');
  },[]);
  
  const fetchNews = async (cityName) => {
    try {
      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=${cityName}&lang=en&max=2&apikey=${gnewsApiKey}`
      );
      console.log('GNews articles:', res.data.articles); 
      setNews(res.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
  };
  const fetchAQI = async (lat, lng) => {
    try {
      const res = await axios.get(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=${aqiKey}`);
      const aqi = res.data.data.current.pollution.aqius;
      setAqi(aqi);
    } catch (error) {
      console.error("Error fetching AQI:", error);
      setAqi(null);
    }
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };


  const calculateMoodScore = () => {
    if (!aqi || !weather) return null;
  
    let score = 100;
    if (aqi > 150) score -= 30;
    if (weather.main.temp > 35) score -= 20;
    if (news.length > 0 && news[0].title.toLowerCase().includes("suicide")) score -= 20;
    
    return score;
  };

  const moodScore = calculateMoodScore();




  
  
  
  
  
  


  return (
    <div className="map-container">
      <header className='header'>
        PulseCheck.
      </header>
     
      <div className="search-box">
        <input type="text" placeholder="Enter city..." value={city} onChange={(e)=>setCity(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
      </div>

 
      <MapContainer center={coords} zoom={11} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <FlyToCity coords={coords} />
      </MapContainer>


      <div className="info-box">
        <h4>📍 {city || 'Mumbai'} - Today</h4>
        {weather ? (
          <>
          <p><strong> Weather: </strong>{weather.main.temp} C, {weather.weather[0].description}</p>
          <p><strong>Humidity: </strong>{weather.main.humidity}%</p>
          </>
        ):(
          <p>Loading Weather...</p>
        )}

        <p><strong>News:</strong></p>
        <ul>
          {news.length > 0 ?(
            news.map((item,idx)=>(
              <li key={idx}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title.length > 60 ? item.title.slice(0, 60) + '...' : item.title}
                </a>
              </li>
            ))
          ):(
            <li> No news found. </li>
          )}
        </ul>
        <p><strong>AQI:</strong> {aqi ? `${aqi} (${getAQILevel(aqi)})` : 'Loading...'}</p>
        
        <p><strong>💬 Score:</strong> <span style={{ color: moodScore < 50 ? 'red' : 'green' }}>{moodScore}/100</span> – {moodScore < 50 ? 'High Stress' : 'Low Stress'}</p>
      </div>
    </div>
  );
};

export default MapView;

