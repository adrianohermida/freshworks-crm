import React from 'react';

export default function ClientLogoItem({ 
  src,
  alt = "Client Logo",
  href
}) {
  const content = (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block'
      }}
      className="xs:w-[75%]"
    />
  );

  return (
    <div
      style={{
        padding: '0 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px'
      }}
      className="md:px-[10px] xs:p-[15px_30px] xs:border xs:border-[#eee] xs:bg-white xs:rounded-[4px]"
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', width: '100%' }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}