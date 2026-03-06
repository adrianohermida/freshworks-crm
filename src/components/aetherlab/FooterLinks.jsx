import React from 'react';

export default function FooterLinks({ 
  title,
  links = []
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.url}
              className="text-gray-300 text-sm hover:text-[#7e57ff] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}