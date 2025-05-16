import { RefObject, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  scrollContainerRef: RefObject<HTMLElement | null>;
}

export default function Navbar({ scrollContainerRef }: NavbarProps) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 10) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  return (
    <nav className={`navbar ${isShrunk ? "shrink" : ""}`}>
      <div className="navbar-content">
        <div className="navbar-left">
          <h1>DLCrowds</h1>
        </div>
        <div className="navbar-toggle" onClick={toggleMobileMenu}>
          ☰
        </div>
        <div className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
          <Link to="/">Map</Link>
          <Link to="/wait-times">Wait Times</Link>
          <Link to="/statistics">Statistics</Link>
        </div>
      </div>
    </nav>
  );
}
