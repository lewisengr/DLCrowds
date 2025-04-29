import { useEffect, useState } from "react";
import { AttractionLiveData } from "../types/CrowdData";
import { rideImageOverlays } from "../rideOverlayConfigs";

// This component fetches the live wait times for rides at Disneyland and displays them in a scrollable list
export default function WaitTimes() {
  const [attractions, setAttractions] = useState<AttractionLiveData[]>([]);
  const [averageWait, setAverageWait] = useState(0);

  const disneylandUUID = "7340550b-c14d-4def-80bb-acdb51d49a66";

  // This method is used to fetch the live data from the API and filter it to only include rides that are in the rideImageOverlays array
  useEffect(() => {
    fetch(`https://api.themeparks.wiki/v1/entity/${disneylandUUID}/live`)
      .then((res) => res.json())
      .then((data) => {
        const liveData = data.liveData as AttractionLiveData[];
        const validRideIds = rideImageOverlays.map((ride) => ride.rideId);

        // Filter the live data to only include rides that are in the rideImageOverlays array
        const filtered = liveData.filter(
          (a): a is AttractionLiveData =>
            a.entityType === "ATTRACTION" && validRideIds.includes(a.id)
        );
        setAttractions(filtered);

        // Calculate the average wait time for the rides that are open
        const waitTimes = filtered
          .map(
            (a) => a.queue?.standby?.waitTime ?? a.queue?.STANDBY?.waitTime ?? 0
          )
          .filter((t) => t > 0);

        // Calculate the avg wait time and round it to the nearest integer
        const avg = waitTimes.length
          ? Math.round(
              waitTimes.reduce((sum, t) => sum + t, 0) / waitTimes.length
            )
          : 0;
        setAverageWait(avg);
      })
      .catch((err) => console.error("Failed to load attractions:", err));
  }, []);

  return (
    <div className="wait-times-page">
      <h2>🎡 Disneyland Wait Times</h2>
      <div className="wait-times-container">
        <span className="live-badge">LIVE</span>
        <div className="wait-times-scroll">
          <div className="wait-time-item average">
            <h3>{averageWait}min</h3>
            <p>Average Wait</p>
          </div>

          {attractions.map((ride) => {
            const waitTime =
              ride.queue?.standby?.waitTime ??
              ride.queue?.STANDBY?.waitTime ??
              "N/A";

            return (
              <div key={ride.id} className="wait-time-item">
                <h3>{waitTime !== "N/A" ? `${waitTime}min` : "Closed"}</h3>
                <p>{ride.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
