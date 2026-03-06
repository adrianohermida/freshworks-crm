import React from 'react';

export default function MapSection({ 
  iframeUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7750887223733!2d-60.02116!3d-3.119028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c3c6c6c6c6c6d%3A0x6c6c6c6c6c6c6c6c!2sManaus%2C%20AM!5e0!3m2!1spt-BR!2sbr!4v"
}) {
  return (
    <section className="map-section">
      <div className="container">
        <div className="mapouter">
          <iframe
            src={iframeUrl}
            title="Localização LegalDock"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}