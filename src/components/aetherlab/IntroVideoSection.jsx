import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function IntroVideoSection({
  title = "Vídeo Introdutório",
  subtitle = "Entenda como funciona o LegalDock",
  description = "Veja em ação como a plataforma sincroniza dados de tribunais e organiza seus processos jurídicos.",
  videoUrl = "https://www.youtube.com/embed/",
  thumbnailImage = null,
  showDecoration = true
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className="intro-video-area">
      <div className="container">
        {/* Section Title */}
        <div className="section-title">
          {subtitle && <span>{subtitle}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        {/* Video Container */}
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="inner-content-head">
              <div className="inner-content">
                {/* Decorative Shapes */}
                {showDecoration && (
                  <>
                    <div className="shape1" />
                    <div className="shape2" />
                  </>
                )}

                {/* Video Play Section */}
                <div className="intro-video-play">
                  <div className="play-thumb">
                    {isPlaying ? (
                      <iframe
                        src={videoUrl + "?autoplay=1"}
                        title="Intro Video"
                        style={{
                          width: '100%',
                          height: '500px',
                          border: 'none',
                          borderRadius: '15px',
                        }}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <>
                        {thumbnailImage && (
                          <img
                            src={thumbnailImage}
                            alt="Video Thumbnail"
                            style={{
                              width: '100%',
                              height: '500px',
                              objectFit: 'cover',
                              borderRadius: '15px',
                              display: 'block',
                            }}
                          />
                        )}
                        
                        <a
                          href="#play"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePlayClick();
                          }}
                          className="play-btn"
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <Play size={24} fill="currentColor" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}