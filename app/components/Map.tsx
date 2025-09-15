'use client';

import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus } from '../types';

interface MapProps {
  bus: Bus;
}

export default function Map({ bus }: MapProps) {
  const position: [number, number] = [bus.current_location.latitude, bus.current_location.longitude];
  const polyline = bus.bus_stops.map(s => [s.latitude, s.longitude]) as [number, number][];

  const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61205.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const stopIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  return (
    <MapContainer center={position} zoom={13} className="h-64 w-full">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
      />
      <Polyline positions={polyline} color="black" dashArray="5,10" />
      <Marker position={position} icon={busIcon}>
        <Popup>
          <strong>{bus.name}</strong>
          <br />
          {bus.current_location.address}
        </Popup>
      </Marker>
      {bus.bus_stops.map(stop => (
        <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={stopIcon}>
          <Popup>
            <strong>{stop.name}</strong>
            <br />
            ETA: {stop.estimated_arrival}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

