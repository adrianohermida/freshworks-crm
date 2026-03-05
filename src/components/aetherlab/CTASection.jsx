import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CTASection({ title, subtitle, primaryText, primaryLink, secondaryText, secondaryLink }) {
  return (
    <section className="bg-white dark:bg-gray-800 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {subtitle && (
            <p className="text-[#7e57ff] font-semibold text-sm uppercase tracking-wide mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081828] dark:text-white">
            {title}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryLink && (
            <Link to={primaryLink}>
              <Button className="bg-[#7e57ff] hover:bg-[#6a4ad1] text-white px-8 h-12 font-semibold">
                {primaryText}
              </Button>
            </Link>
          )}
          {secondaryLink && (
            <Link to={secondaryLink}>
              <Button variant="outline" className="border-[#7e57ff] text-[#7e57ff] hover:bg-[#f4f7fa] px-8 h-12 font-semibold">
                {secondaryText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}