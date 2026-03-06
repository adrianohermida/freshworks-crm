import React, { useState } from 'react';
import LoginFormField from './LoginFormField';
import Button from './Button';

export default function AccountLogin({
  mode = 'login', // 'login' or 'signup'
  onSubmit,
  socialOptions = [],
  showForgotPassword = true,
  showAlternativeLogin = true,
  showCreateAccount = true,
  onToggleMode,
  submitButtonText = mode === 'login' ? 'Login' : 'Sign Up',
  title = mode === 'login' ? 'Welcome Back' : 'Create Account',
  subtitle = mode === 'login' ? 'Login to your account' : 'Join us today'
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F4F7FA',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.075)',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '60px 70px'
          }}
        >
          {/* Form Title */}
          <div
            style={{
              marginBottom: '45px',
              textAlign: 'center'
            }}
          >
            <h3
              style={{
                fontSize: '25px',
                fontWeight: 700,
                color: '#081828',
                margin: '0 0 8px 0'
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  color: '#727272',
                  fontSize: '14px',
                  margin: 0
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Email Field */}
          <LoginFormField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange('email')}
          />

          {/* Password Field */}
          <LoginFormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange('password')}
          />

          {/* Confirm Password (Signup Mode) */}
          {mode === 'signup' && (
            <LoginFormField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
            />
          )}

          {/* Forgot Password Link */}
          {showForgotPassword && mode === 'login' && (
            <div
              style={{
                marginBottom: '20px',
                textAlign: 'right'
              }}
            >
              <a
                href="#"
                style={{
                  color: '#888',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => (e.target.style.color = '#7E57FF')}
                onMouseLeave={(e) => (e.target.style.color = '#888')}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <div
            style={{
              marginTop: '40px',
              textAlign: 'center'
            }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              style={{
                width: '100%'
              }}
            >
              {submitButtonText}
            </Button>
          </div>

          {/* Divider */}
          {showAlternativeLogin && socialOptions.length > 0 && (
            <div
              style={{
                position: 'relative',
                textAlign: 'center',
                margin: '30px 0',
                zIndex: 0
              }}
            >
              <span
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  padding: '5px 12px',
                  color: '#888',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                OR
              </span>
              <div
                style={{
                  position: 'absolute',
                  content: '""',
                  left: 0,
                  top: '50%',
                  marginTop: '-1px',
                  backgroundColor: '#e8e8e8',
                  height: '1px',
                  width: '100%',
                  zIndex: 0
                }}
              />
            </div>
          )}

          {/* Alternative Login Options */}
          {showAlternativeLogin && socialOptions.length > 0 && (
            <div
              style={{
                marginTop: '30px'
              }}
            >
              <p
                style={{
                  marginBottom: '15px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#727272'
                }}
              >
                Continue with
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {socialOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.href || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      if (option.onClick) option.onClick();
                    }}
                    style={{
                      padding: '14px 25px 14px 15px',
                      border: '1px solid #eee',
                      borderRadius: '30px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'center',
                      color: '#727272',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#7E57FF';
                      e.currentTarget.style.color = '#7E57FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#eee';
                      e.currentTarget.style.color = '#727272';
                    }}
                  >
                    {option.icon && <span>{option.icon}</span>}
                    <span>{option.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Create Account Link */}
          {showCreateAccount && (
            <p
              style={{
                fontWeight: 500,
                color: '#081828',
                textAlign: 'center',
                marginTop: '35px',
                fontSize: '14px',
                margin: '35px 0 0 0'
              }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onToggleMode) {
                    onToggleMode();
                  }
                }}
                style={{
                  color: '#7E57FF',
                  textDecoration: 'none',
                  transition: 'text-decoration 0.3s ease'
                }}
                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}