import React from "react";
import Link from "next/link";

export default function App() {
  return (
    <div>
      <h1>Welcome to Fibertime</h1>
      <nav>
        <Link href="/device">Device Page</Link>
        <Link href="/mobile/login">Mobile Page</Link>
      </nav>
    </div>
  );
}
