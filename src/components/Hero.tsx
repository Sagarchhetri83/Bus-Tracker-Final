// src/components/Hero.tsx
"use client";

import { Header } from "@/components/Header";

export function Hero() {
  return (
    <div className="relative h-screen w-full bg-black">
      <Header />

      {/* The Spline Iframe Embed */}
      <div className="absolute inset-0 z-10">
        {/* Your current iframe code */}
        <iframe 
          src='https://my.spline.design/zooxautonomousvehicle-vXprN5nT65PgVDulxLEjVaJH/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
        ></iframe>
      </div>
      
      {/* Title bottom-left near N symbol */}
      <div className="absolute z-20 left-6 bottom-24 md:bottom-6 pointer-events-none">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-2xl">
          Bus Tracker
        </h1>
      </div>

      {/* Get Started button bottom-right near Spline badge */}
      <div className="absolute z-20 right-6 bottom-24 md:bottom-6">
        <a href="/home" className="px-5 py-3 bg-black/80 hover:bg-black text-white rounded-full font-semibold shadow-lg backdrop-blur">
          Get Started
        </a>
      </div>
    </div>
  );
}