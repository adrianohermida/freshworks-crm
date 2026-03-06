import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export default function PricingTableCard({ 
  title,
  subtitle,
  currency = 'R$',
  amount,
  duration = '/mês',
  description,
  features = [],
  buttonText = 'Começar Agora',
  onButtonClick,
  popular = false,
  highlighted = false,
  className = ''
}) {
  return (
    <div className={`relative overflow-hidden border border-gray-200 rounded-md mt-10 bg-white transition-all duration-400 p-12 sm:p-9 text-left z-0 hover:shadow-lg group ${
      highlighted ? 'ring-2 ring-[#7e57ff] shadow-md' : ''
    } ${className}`}>
      
      {/* Popular Badge */}
      {popular && (
        <span className="absolute top-4 right-5 text-[#7e57ff] text-sm font-medium">
          Mais Popular
        </span>
      )}

      {/* Header */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
          highlighted ? 'text-[#7e57ff]' : 'text-[#081828] dark:text-white'
        }`}>
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            {subtitle}
          </p>
        )}

        {/* Price */}
        {amount !== undefined && (
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-gray-600 dark:text-gray-400 text-base font-medium">
              {currency}
            </span>
            <span className="text-5xl font-bold text-[#081828] dark:text-white">
              {amount}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {duration}
            </span>
          </div>
        )}

        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Features List */}
      {features.length > 0 && (
        <ul className="space-y-4 mb-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 text-sm pl-2 ${
                feature.enabled 
                  ? 'text-[#081828] dark:text-gray-200' 
                  : 'text-[#727272] dark:text-gray-500'
              }`}
            >
              {feature.enabled ? (
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Button */}
      <Button
        onClick={onButtonClick}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-12 ${
          highlighted
            ? 'bg-[#7e57ff] text-white hover:bg-[#6a4ad1]'
            : 'border-2 border-[#7e57ff] text-[#7e57ff] bg-transparent hover:bg-[#7e57ff]/5'
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
}