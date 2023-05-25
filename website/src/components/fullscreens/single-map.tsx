import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
};

const Map: React.FC<Props> = (props) => {
  const icon = L.icon({ iconUrl: "/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] });

  return (
    <MapContainer center={[props.latitude, props.longitude]} zoom={13} scrollWheelZoom={false} style={{ height: 200, width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[props.latitude, props.longitude]} icon={icon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
