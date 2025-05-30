import { useEffect, useRef, useState } from "react";
import {
  startConnection,
  stopConnection,
  subscribeToCrowdData,
} from "../services/signalRService";
import { AttractionLiveData, CrowdData } from "../types/CrowdData";
import { rideImageOverlays } from "../rideOverlayConfigs";
import { getFilterClassFromWaitTime } from "../utils/getFilterClass";
import disneylandMap from "../assets/Map.png"; // Base map image
import Panzoom from "@panzoom/panzoom";
import "@fancyapps/ui/dist/panzoom/panzoom.css";

// This component is used to display the Disneyland map with ride wait times from the API
// It also uses the Panzoom library to allow users to zoom in and out of the map
export default function CrowdMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [attractions, setAttractions] = useState<AttractionLiveData[]>([]);
  const [waitTimes, setWaitTimes] = useState<Record<string, number>>({});
  const [, setImageLoaded] = useState(false);
  const mapInnerRef = useRef<HTMLDivElement>(null);
  const [panzoom, setPanzoom] = useState<ReturnType<typeof Panzoom> | null>(
    null
  );
  const disneylandUUID = "7340550b-c14d-4def-80bb-acdb51d49a66";

  // This useEffect is used to start the SignalR connection and subscribe to the crowd data
  useEffect(() => {
    startConnection();
    subscribeToCrowdData((data: Record<string, CrowdData>) => {
      const newWaitTimes: Record<string, number> = {};

      Object.entries(data).forEach(([rideId, crowdData]) => {
        if (crowdData.waitTime != null) {
          newWaitTimes[rideId] = crowdData.waitTime;
        }
      });

      // This line updates the wait times state with the new wait times received from the SignalR connection
      // It uses the previous state to ensure that only the updated wait times are set
      setWaitTimes((prev) => ({ ...prev, ...newWaitTimes }));
    });

    return () => {
      stopConnection();
    };
  }, []);

  // This useEffect is used to fetch the live data from the API and filter it to only include rides that are in the rideImageOverlays array
  useEffect(() => {
    fetch(`https://api.themeparks.wiki/v1/entity/${disneylandUUID}/live`)
      .then((res) => res.json())
      .then((data) => {
        const liveData = data.liveData as AttractionLiveData[];
        const filtered = liveData.filter(
          (a): a is AttractionLiveData => a.entityType === "ATTRACTION"
        );
        setAttractions(filtered);

        const times: Record<string, number> = {};
        for (const attraction of filtered) {
          const standby =
            attraction.queue?.standby || attraction.queue?.STANDBY;
          if (standby?.waitTime != null) {
            times[attraction.id] = standby.waitTime;
          }
        }
        setWaitTimes(times);
      })
      .catch((err) =>
        console.error("Error fetching themeparks live data:", err)
      );
  }, []);

  // This useEffect is used to initialize the Panzoom library and set up the zoom functionality for the map
  useEffect(() => {
    if (mapInnerRef.current) {
      const panzoomInstance = Panzoom(mapInnerRef.current, {
        maxScale: 3,
        minScale: 1,
        contain: "outside",
      });

      mapInnerRef.current.parentElement?.addEventListener(
        "wheel",
        panzoomInstance.zoomWithWheel
      );

      setPanzoom(panzoomInstance);
    }
  }, []);

  return (
    <div>
      <div className="map-container">
        <div className="map-wrapper">
          <div className="map-inner" ref={mapInnerRef}>
            <div className="disneyland-map" ref={containerRef}>
              <img
                src={disneylandMap}
                className="map-base"
                onLoad={() => setImageLoaded(true)}
              />
              {rideImageOverlays.map((overlay) => {
                const waitTime = waitTimes[overlay.rideId] ?? -1;
                const rideStatus =
                  attractions.find((a) => a.id === overlay.rideId)?.status ??
                  "";
                const isDown = ["DOWN", "CLOSED", "REFURBISHMENT"].includes(
                  rideStatus
                );
                const filterClass = getFilterClassFromWaitTime(waitTime);
                const finalClass = isDown ? "gray-filter" : filterClass;

                return (
                  <img
                    key={overlay.rideId}
                    src={overlay.image}
                    className={`map-overlay ${finalClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* Controls */}
        <div className="map-controls">
          <button onClick={() => panzoom?.zoomIn()}>+</button>
          <button onClick={() => panzoom?.zoomOut()}>−</button>
          <button onClick={() => panzoom?.zoom(1.5, { animate: true })}>
            1.5x
          </button>
          <button onClick={() => panzoom?.reset()}>⟳</button>
        </div>
      </div>
    </div>
  );
}
