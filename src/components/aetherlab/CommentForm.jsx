import React, { useState } from 'react';
import Button from './Button';

export default function CommentForm({
  onSubmit
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (field) => (e) => {
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
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ marginTop: '80px' }}>
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1,
          textTransform: 'capitalize',
          color: '#081828',
          margin: 0,
          marginBottom: '30px'
        }}
      >
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <label
            style={{
              color: '#081828',
              display: 'block',
              marginBottom: '10px',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            Name *
          </label>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange('name')}
            required
            style={{
              border: 'none',
              fontSize: '15px',
              color: '#081828',
              padding: '0 25px',
              fontWeight: 500,
              height: '53px',
              border: '1px solid #eee',
              marginBottom: '20px',
              fontWeight: 400,
              borderRadius: '6px',
              transition: 'all 0.4s ease',
              backgroundColor: '#F4F7FA',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7E57FF')}
            onBlur={(e) => (e.target.style.borderColor = '#eee')}
          />
        </div>

        {/* Email Field */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <label
            style={{
              color: '#081828',
              display: 'block',
              marginBottom: '10px',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            Email *
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            required
            style={{
              border: 'none',
              fontSize: '15px',
              color: '#081828',
              padding: '0 25px',
              fontWeight: 500,
              height: '53px',
              border: '1px solid #eee',
              marginBottom: '20px',
              fontWeight: 400,
              borderRadius: '6px',
              transition: 'all 0.4s ease',
              backgroundColor: '#F4F7FA',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7E57FF')}
            onBlur={(e) => (e.target.style.borderColor = '#eee')}
          />
        </div>

        {/* Message Field */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <label
            style={{
              color: '#081828',
              display: 'block',
              marginBottom: '10px',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            Message *
          </label>
          <textarea
            placeholder="Your message here..."
            value={formData.message}
            onChange={handleChange('message')}
            required
            style={{
              border: 'none',
              fontSize: '15px',
              color: '#081828',
              padding: '25px',
              fontWeight: 400,
              height: '180px',
              border: '1px solid #eee',
              borderRadius: '6px',
              transition: 'all 0.4s ease',
              backgroundColor: '#F4F7FA',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7E57FF')}
            onBlur={(e) => (e.target.style.borderColor = '#eee')}
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '30px' }}>
          <Button
            type="submit"
            variant="primary"
            size="md"
          >
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
}