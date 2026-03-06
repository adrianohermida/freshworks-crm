import React, { useState } from 'react';

export default function LoginFormField({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  icon: Icon
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        marginBottom: '20px',
        position: 'relative'
      }}
    >
      {/* Label */}
      {label && (
        <label
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 9,
            fontSize: '14px',
            color: '#888',
            pointerEvents: 'none'
          }}
        >
          {label}
        </label>
      )}

      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          padding: '0 18px 0 55px',
          transition: 'all 0.4s ease',
          border: isFocused ? '1px solid #7E57FF' : '1px solid #eee',
          backgroundColor: '#F4F7FA',
          color: '#505050',
          fontSize: '15px',
          height: '52px',
          borderRadius: '30px',
          overflow: 'hidden',
          width: '100%',
          boxShadow: isFocused ? '0px 5px 8px rgba(0, 0, 0, 0.233)' : 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      />

      {/* Icon */}
      {Icon && (
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 8,
            color: '#7E57FF',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Icon size={18} />
        </div>
      )}
    </div>
  );
}