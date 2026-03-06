import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function IntroVideo({ 
  videoId = "dQw4w9WgXcQ",
  thumbnailUrl,
  title = "Conheça nossa solução",
  description = "Descubra como podemos transformar seu projeto."
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
        {!isPlaying ? (
          <>
            <img
              src={thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#7E57FF] hover:bg-[#6B4FD8] rounded-full transition-colors group-hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </button>
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        )}
      </div>
    </div>
  );
}