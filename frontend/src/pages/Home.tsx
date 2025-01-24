import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Home() {
  const position: LatLngExpression = [51.505, -0.09];

  return (
    <div className="h-[1000px] w-[800px]">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-[1000px]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
export default Home;
