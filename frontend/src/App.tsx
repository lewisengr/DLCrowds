import Navbar from "./components/Navbar";
import CrowdMap from "./components/DisneylandMap";
import WaitTimes from "./pages/WaitTimes";
import Statistics from "./pages/Statistics";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useRef } from "react";

export default function App() {
  const mainRef = useRef<HTMLElement>(null); // Create a ref for the main content

  return (
    <div className="page-container">
      <Navbar scrollContainerRef={mainRef} />
      <main className="main-content-wrapper" ref={mainRef}>
        <Routes>
          <Route path="/" element={<CrowdMap />} />
          <Route path="/wait-times" element={<WaitTimes />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
    </div>
  );
}
