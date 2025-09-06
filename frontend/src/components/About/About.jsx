import React from "react";
import "./About.css";
import LineLeft from "/AboutLineLeft.png";
import LineRight from "/AboutLineRight.png";
import CompIllu from "/ComputerIllustration.png";
import ManIllu from "/ManIllu.png";

const About = () => {
  return (
    <div className="container-fluid mt-3 position-relative about-main-sec">
      <div className="decoratives" aria-hidden>
        <img className="position-absolute left-line" src={LineLeft} alt="decorative left line" loading="lazy" />
        <img className="position-absolute right-line" src={LineRight} alt="decorative right line" loading="lazy" />
        <img className="comp-illu position-absolute" src={CompIllu} alt="computer illustration" loading="lazy" />
        <img className="man-illu position-absolute" src={ManIllu} alt="man illustration" loading="lazy" />
      </div>

      <div className="container about-section d-flex flex-column text-center justify-content-center align-items-center gap-3">
        <h1 className="text-center">
          Why Choose <br />
          <span className="logo__gradient">SynergySphere</span>
        </h1>

        <div className="chooseList d-grid gap-3">
          <div className="listItem p-3 d-flex justify-content-center align-items-center text-center bg-white text-dark rounded-5">
            <p className="w-100 m-0">Seamless Communication – Keep everyone connected</p>
          </div>
          <div className="listItem p-3 d-flex justify-content-center align-items-center text-center bg-white text-dark rounded-5">
            <p className="w-100 m-0">Centralized Workspace – One place for tasks, chats, and files</p>
          </div>
          <div className="listItem p-3 d-flex justify-content-center align-items-center text-center bg-white text-dark rounded-5">
            <p className="w-100 m-0">Scalable for Teams – From startups to enterprises</p>
          </div>
          <div className="listItem p-3 d-flex justify-content-center align-items-center text-center bg-white text-dark rounded-5">
            <p className="w-100 m-0">Secure & Reliable – Enterprise-grade protection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
