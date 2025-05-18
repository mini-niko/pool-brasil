import { Feature, Map, View } from "ol";
import Control from "ol/control/Control";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { toLonLat, fromLonLat } from "ol/proj";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useRef, useState } from "react";

class GoToButtonControl extends Control {
  constructor(onClick) {
    const button = document.createElement("button");
    button.innerHTML = "📍";
    button.title = "Ir para local desejado";

    button.addEventListener("click", onClick, false);

    const element = document.createElement("div");
    element.className = "ol-control ol-unselectable my-custom-button";
    element.appendChild(button);

    super({ element });
  }
}

function OpenMap({ setCoordinates }) {
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onPosition, onError);

    function onPosition(position) {
      setCoordinates({
        latitude: parseFloat(position.coords.latitude.toFixed(5)),
        longitude: parseFloat(position.coords.longitude.toFixed(5)),
      });

      getMap(
        mapRef,
        fromLonLat([position.coords.longitude, position.coords.latitude]),
        true,
        setCoordinates,
      );
    }

    function onError() {
      getMap(mapRef, fromLonLat([-52.4066, -26.876]), false, setCoordinates);
    }
  }, []);

  return (
    <div className="w-full h-full border-pool-black border-2 rounded-2xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

function getMap(mapRef, actualCoords, startWithPin, setCoordinates) {
  const markerSource = new VectorSource();

  if (startWithPin) {
    markerSource.addFeature(
      new Feature({
        geometry: new Point(actualCoords),
      }),
    );
  }

  const markerLayer = new VectorLayer({
    source: markerSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: "/pinIcon.png",
        scale: 0.07,
      }),
    }),
  });

  const map = new Map({
    target: mapRef.current,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      markerLayer,
    ],
    view: new View({
      center: actualCoords,
      zoom: 17,
    }),
  });

  map.on("click", (e) => {
    const coords = toLonLat(e.coordinate);

    setCoordinates({
      latitude: parseFloat(coords[1].toFixed(5)),
      longitude: parseFloat(coords[0].toFixed(5)),
    });

    markerSource.clear();

    markerSource.addFeature(
      new Feature({
        geometry: new Point(e.coordinate),
      }),
    );
  });

  const goToCoords = () => {
    map.getView().animate({
      center: actualCoords,
      zoom: 15,
      duration: 500,
    });
  };

  const goToButtonControl = new GoToButtonControl(goToCoords);
  map.addControl(goToButtonControl);

  return () => map.setTarget(undefined);
}

export default OpenMap;
