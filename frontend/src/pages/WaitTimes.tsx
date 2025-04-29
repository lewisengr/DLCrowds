import { useEffect, useState } from "react";
import { AttractionLiveData } from "../types/CrowdData";

export default function WaitTimes() {
  const [attractions, setAttractions] = useState<AttractionLiveData[]>([]);
  const [averageWait, setAverageWait] = useState(0);

  const disneylandUUID = "7340550b-c14d-4def-80bb-acdb51d49a66";

  useEffect(() => {
    fetch(`https://api.themeparks.wiki/v1/entity/${disneylandUUID}/live`)
      .then((res) => res.json())
      .then((data) => {
        const liveData = data.liveData as AttractionLiveData[];
        const filtered = liveData.filter(
          (a): a is AttractionLiveData => a.entityType === "ATTRACTION"
        );
        setAttractions(filtered);

        const waitTimes = filtered
          .map(
            (a) => a.queue?.standby?.waitTime ?? a.queue?.STANDBY?.waitTime ?? 0
          )
          .filter((t) => t > 0);

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
