import * as signalR from "@microsoft/signalr";
import { CrowdData } from "../types/CrowdData";

let connection: signalR.HubConnection;

const buildConnection = () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7198/ws/crowds")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};

buildConnection();

export const startConnection = async () => {
  try {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log("✅ SignalR connected.");
    } else {
      console.log("ℹ️ SignalR already connected. State:", connection.state);
    }
  } catch (err) {
    console.error("❌ Error connecting to SignalR:", err);
  }
};

export const stopConnection = async () => {
  if (connection.state === signalR.HubConnectionState.Connected) {
    await connection.stop();
    console.log("SignalR disconnected.");
  }
};

export const subscribeToCrowdData = (
  callback: (data: Record<string, CrowdData>) => void
) => {
  connection.off("ReceiveCrowdData");
  connection.on("ReceiveCrowdData", callback);
};
