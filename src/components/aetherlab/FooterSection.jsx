import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function FooterSection({ 
  title,
  about,
  logo,
  socialLinks = [],
  children
}) {
  const defaultSocial = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Instagram, url: '#', label: 'Instagram' }
  ];

  const socials = socialLinks.length > 0 ? socialLinks : defaultSocial;

  return (
    <div className="space-y-6">
      {/* Logo e Descrição */}
      {logo && (
        <div>
          <img src={logo} alt="Logo" className="h-10 object-contain" />
        </div>
      )}

      {about && (
        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
          {about}
        </p>
      )}

      {/* Links Sociais */}
      {socials.length > 0 && (
        <div className="space-y-3">
          <p className="text-white text-xs font-semibold uppercase tracking-wider">
            Siga-nos
          </p>
          <ul className="flex gap-4">
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <li key={idx}>
                  <a
                    href={social.url}
                    title={social.label}
                    className="text-white hover:text-[#7e57ff] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Conteúdo Customizado */}
      {children}
    </div>
  );
}