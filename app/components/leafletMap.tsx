'use client';

import { Marker, Popup, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

console.log('LOADING LEAFLET CHART');
const LeafletChart = () => {

    const [isClient, setIsClient] = useState(false);

    // Only initialize the map once the component is rendered in the browser
    useEffect(() => {
      setIsClient(true); // Set to true once the component has mounted on the client side
    }, []);
  
    if (!isClient) {
      return null; // Return null on the server side or before client-side rendering
    }

    return (
    <div style={{ height: '100vh', width: '100%' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    </div>
    );
};

export default LeafletChart;