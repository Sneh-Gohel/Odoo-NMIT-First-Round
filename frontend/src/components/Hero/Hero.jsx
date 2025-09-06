// Hero.jsx
import React from 'react';
import './Hero.css';
import Ecllipse1 from '/Ellipse11.png';
import Ecllipse2 from '/Ellipse12.png';
import Ecllipse3 from '/Ellipse13.png';
import LeftLine from '/AboutLineLeft.png';
import RightLine from '/AboutLineRight.png';
import Group1 from '/Group1.png';
import Group2 from '/Group2.png';
import Group3 from '/Group3.png';
import Group4 from '/Group4.png';

const Hero = () => {
  return (
    <>
      <section className="hero d-flex align-items-center position-relative mt-5">
        <div>
          <img src={Group1} alt="group1" className="decorative-line position-absolute grp1 floating-animation-1" draggable="false" />
          <img src={Group2} alt="group2" className="decorative-line position-absolute grp2 floating-animation-2" draggable="false"/>
          <img src={Group3} alt="group3" className="decorative-line position-absolute grp3 floating-animation-3" draggable="false"/>
          <img src={Group4} alt="group4" className="decorative-line position-absolute grp4 floating-animation-4" draggable="false"/>
          <img src={LeftLine} alt="Left Decorative Line" className="decorative-line position-absolute leftL" draggable="false"/>
          <img src={RightLine} alt="Right Decorative Line" className="decorative-line position-absolute rightL" draggable="false"/>
        </div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8 col-md-10">
              <h2 className="hero-tagline display-4 fw-light mb-0">Work <span className='logo__gradient head'>Smarter</span></h2>
              <h2 className="hero-tagline display-4 fw-light mb-3">Collaborate <span className='logo__gradient head'>Better.</span></h2>
              <h6 className="hero-headline fw-bold mb-4">
                Achieve More in One <span className='logo__gradient'>Advanced Team Platform</span>
              </h6>
              <button type="submit" className="newsletter-btn btn">
                <a href="#features" className='scrol'>Get Started</a>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="features">
        <div className="container text-center">
          <h2 className="mb-5 fw-bold hero-tagline">Collaboration in <span className='logo__gradient head2'>Action</span></h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-feature bg-light">
                <div className="card-body">
                  <div className="icon-wrapper mb-3">
                    <img src={Ecllipse1} alt="" height={150} draggable="false"/>
                  </div>
                  <h5 className="card-title fw-bold mt-5">Project Management</h5>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-feature bg-light">
                <div className="card-body">
                  <div className="icon-wrapper mb-3">
                    <img src={Ecllipse2} alt="" height={150} draggable="false"/>
                  </div>
                  <h5 className="card-title fw-bold mt-5">Task Assignments</h5>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-feature bg-light">
                <div className="card-body">
                  <div className="icon-wrapper mb-3">
                    <img src={Ecllipse3} alt="" height={150} draggable="false"/>
                  </div>
                  <h5 className="card-title fw-bold mt-5">Real-time Messaging</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;