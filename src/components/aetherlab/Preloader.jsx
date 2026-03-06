import React from 'react';

export default function Preloader({ visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-white flex items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Animated Circles */}
        <div className="absolute inset-0 rounded-full bg-[#7e57ff] animate-pulse"
          style={{
            animation: 'preloader-fx 1.6s linear infinite',
            opacity: 0.5
          }}>
        </div>
        <div className="absolute inset-0 rounded-full bg-[#7e57ff] animate-pulse"
          style={{
            animation: 'preloader-fx 1.6s linear infinite -0.8s',
            opacity: 0.5
          }}>
        </div>
      </div>

      <style>{`
        @keyframes preloader-fx {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(1, 1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}