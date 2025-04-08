import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map('map').setView([51.505, -0.09], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Add marker for user's location
          L.marker([latitude, longitude])
            .addTo(mapInstance)
            .bindPopup('Your Location')
            .openPopup();
          
          // Center map on user's location
          mapInstance.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div className="map-container" style={{ height: '400px', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent; 