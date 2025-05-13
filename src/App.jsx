// // src/App.jsx
// import React from 'react';
// import './App.css'
// import MapView from "./Components/MapView/MapView";
// import Header from './Components/Header/Header';
// import Footer from './Components/Footer/Footer';
// import Scorecard from './Components/Scorecard/Scorecard';
// import 'leaflet/dist/leaflet.css'; // make sure it's here!

// function App() {
//   return (
//     <div className="app-container">
//       <Header />
//       <div className="map-container">
//         <MapView />
//         <div className="scorecard-floating">
//           <Scorecard />
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import MapView from './components/MapView/MapView';

function App() {
  return (
    <div className="App">
      <MapView />
    </div>
  );
}

export default App;









