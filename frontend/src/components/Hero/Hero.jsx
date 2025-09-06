// Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero d-flex align-items-center mt-5">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8 col-md-10">
            <h2 className="hero-tagline display-4 fw-light mb-0">Work <span className='logo__gradient'>Smarter</span></h2>
            <h2 className="hero-tagline display-4 fw-light mb-3">Collaborate <span className='logo__gradient'>Better.</span></h2>
            <h6 className="hero-headline  fw-bold mb-4">
              Achieve More in One <span className='logo__gradient'>Advanced Team Platform</span>
            </h6>
            <button className="hero-cta btn btn-primary btn-lg px-4 py-2 rounded-pill">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;