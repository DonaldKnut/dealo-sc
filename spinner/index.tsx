"use client";

import Image from "next/image";
import "./BlinkingLogo.css"; // Import the CSS file for styling

export default function Spinner() {
  return (
    <div className="blinking-logo-container">
      <Image
        src="https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev/logos/dealo-new.png"
        alt="Dealo Logo"
        className="blinking-logo"
        width={230}
        height={230}
      />
    </div>
  );
}
