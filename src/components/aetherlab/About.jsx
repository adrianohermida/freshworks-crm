import React from 'react';

export default function About({ 
  image,
  title = "Sobre Nós",
  description = "Conheça nossa história e missão.",
  content = "Lorem ipsum dolor sit amet...",
  features = []
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden h-96 lg:h-full min-h-96">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {content}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#7E57FF]/5 dark:bg-[#7E57FF]/10 rounded-lg border border-[#7E57FF]/20"
              >
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}