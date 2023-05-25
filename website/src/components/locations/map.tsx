import { AggregatedLocation, aggregateLocations, calculateDistance, getDistanceThreshold } from "@/lib/geo-tools";
import { MediaLocation } from "@/pages/locations";
import { Anchor } from "@mantine/core";
import { DivIcon, LatLngBoundsExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, ScaleControl, TileLayer, useMap } from "react-leaflet";

type Props = {
  locations: MediaLocation[];
};

const Map: React.FC<Props> = (props) => {
  const bounds = useMemo<LatLngBoundsExpression>(() => {
    let latitudes = props.locations.map((location) => location.latitude);
    let longitudes = props.locations.map((location) => location.longitude);

    return [
      [Math.min(...latitudes), Math.min(...longitudes)], // south west
      [Math.max(...latitudes), Math.max(...longitudes)], // nord east
    ];
  }, [props.locations]);

  return (
    <MapContainer bounds={bounds} style={{ width: "100%", height: "calc(100vh - 16px)" }}>
      <ScaleControl position="bottomleft" />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Markers locations={props.locations} />
    </MapContainer>
  );
};

const Markers: React.FC<Props> = (props) => {
  const map = useMap();

  const [zoom, setZoom] = useState<number>(map.getZoom());
  map.on("zoom", () => {
    setZoom(map.getZoom());
  });

  const getIcon = (count?: number): DivIcon => {
    let htmlStyles = {
      display: "block",
      position: "relative",
      left: "-1rem",
      top: "-rem",
      "background-color": "blue",
      width: "2rem",
      height: "2rem",
      color: "#ffffff",
      "text-align": "center",
      "line-height": "2rem",
      "border-radius": "3rem",
      "font-size": "1rem",
    };

    let css = Object.entries(htmlStyles)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n");

    return divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${css}">${count ?? ""}</span>`,
    });
  };

  const aggregatedLocations = useMemo<AggregatedLocation<MediaLocation>[]>(() => {
    return aggregateLocations(props.locations, zoom);
  }, [props.locations, zoom]);

  return (
    <>
      {aggregatedLocations.map((location, index) => (
        <Marker key={index} position={[location.latitude, location.longitude]} icon={getIcon(location.items.length)}>
          <Popup>
            <Anchor component={Link} href={`/locations/${location.latitude}/${location.longitude}/${zoom}`}>
              Bilder anzeigen
            </Anchor>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Map;
