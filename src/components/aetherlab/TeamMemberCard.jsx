import React from 'react';
import { Linkedin, Github, Twitter, Mail } from 'lucide-react';

const socialIconMap = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  email: Mail,
};

export default function TeamMemberCard({ 
  name, 
  role,
  image,
  socials = [],
  featured = false
}) {
  return (
    <div className="text-center group">
      {/* Avatar */}
      <div className="mb-6 inline-block">
        <img 
          src={image} 
          alt={name}
          className="w-50 h-50 rounded-full object-cover bg-white p-2.5 border border-gray-200 group-hover:border-[#7e57ff]/30 transition-all duration-400"
        />
      </div>

      {/* Content */}
      <div className="px-8 py-10 sm:px-7 sm:py-8">
        <h4 className="text-base font-semibold text-[#081828] dark:text-white">
          {name}
          <span className="text-[#727272] dark:text-gray-400 text-sm block mt-2.5 font-medium">
            {role}
          </span>
        </h4>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="flex justify-center gap-5 mt-5 opacity-0 invisible transform translate-y-[-10px] group-hover:opacity-100 group-hover:visible group-hover:translate-y-5 transition-all duration-400 sm:mt-5">
            {socials.map((social, idx) => {
              const Icon = socialIconMap[social.type];
              return Icon ? (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#081828] dark:text-gray-300 hover:text-[#7e57ff] transition-colors duration-300"
                  aria-label={`${social.type} ${name}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}