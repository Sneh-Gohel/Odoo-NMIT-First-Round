import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import About from "../../components/About/About";
import Hero from "../../components/Hero/Hero";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
    </div>
  );
};

export default LandingPage;
