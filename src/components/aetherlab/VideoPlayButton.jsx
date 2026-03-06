import React from 'react';
import { Play } from 'lucide-react';

export default function VideoPlayButton({ 
  onClick,
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 md:w-16 md:h-16 sm:w-14 sm:h-14',
    lg: 'w-24 h-24 md:w-20 md:h-20 sm:w-16 sm:h-16'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6 md:w-5 md:h-5',
    lg: 'w-7 h-7 md:w-6 md:h-6'
  };

  return (
    <button
      onClick={onClick}
      className={`relative ${sizeClasses[size]} bg-[#7e57ff] rounded-full flex items-center justify-center text-white transition-colors hover:bg-[#081828] group ${className}`}
      aria-label="Play video"
    >
      <Play className={`${iconSizes[size]} fill-current ml-1`} />

      {/* Pulsing Border 1 */}
      <div className="absolute inset-0 border border-[#7e57ff] rounded-full group-hover:border-[#081828]"
        style={{
          animation: 'pulse-border-2 1.5s linear infinite'
        }}>
      </div>

      {/* Pulsing Border 2 */}
      <div className="absolute inset-0 border border-white rounded-full opacity-70"
        style={{
          animation: 'pulse-border 1s linear infinite'
        }}>
      </div>

      <style>{`
        @keyframes pulse-border {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes pulse-border-2 {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}