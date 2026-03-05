import React from 'react';
import Button from '@/components/aetherlab/Button';

export default function HeaderButtons({ isSticky = false, onSignIn, onSignUp }) {
  return (
    <div style={{
      display: 'inline-flex',
      gap: '10px',
      marginLeft: '10px',
      alignItems: 'center'
    }}>
      <button
        onClick={onSignIn}
        style={{
          background: 'transparent',
          border: 'none',
          color: isSticky ? '#081828' : '#ffffff',
          fontWeight: 500,
          cursor: 'pointer',
          fontSize: '15px',
          transition: 'color 0.3s ease',
          padding: 0
        }}
        onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
        onMouseLeave={(e) => e.target.style.color = isSticky ? '#081828' : '#ffffff'}
      >
        Sign In
      </button>

      <Button
        variant="primary"
        size="sm"
        onClick={onSignUp}
        style={{
          backgroundColor: '#7E57FF',
          color: '#ffffff'
        }}
      >
        Sign Up
      </Button>
    </div>
  );
}