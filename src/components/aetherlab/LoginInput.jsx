import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginInput({ 
  label,
  name,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  icon: Icon
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div
      style={{
        marginBottom: '20px',
        position: 'relative'
      }}
    >
      {label && (
        <label
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: '9',
            fontSize: '14px',
            color: isFocused ? COLORS.primary : '#888',
            fontWeight: '500',
            transition: 'color 0.3s ease',
            fontFamily: TYPOGRAPHY.fontFamily
          }}
        >
          {Icon && (
            <span style={{ marginRight: '8px', display: 'inline-flex', alignItems: 'center' }}>
              <Icon size={16} />
            </span>
          )}
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          padding: Icon || label ? '0 18px 0 55px' : '0 18px',
          transition: 'all 0.4s ease',
          border: `1px solid ${isFocused ? COLORS.primary : '#eee'}`,
          backgroundColor: COLORS.lightGray,
          color: COLORS.text.body,
          fontSize: '15px',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          height: '52px',
          borderRadius: '30px',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: isFocused ? '0px 5px 8px rgba(0, 0, 0, 0.233)' : 'none',
          fontFamily: TYPOGRAPHY.fontFamily,
          fontWeight: '400'
        }}
      />
    </div>
  );
}