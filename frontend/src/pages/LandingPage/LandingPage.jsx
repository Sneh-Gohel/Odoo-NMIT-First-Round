// import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import About from "../../components/About/About";
import TestimonialsMarquee from "../../components/Testimonial/Testimonial";

const LandingPage = () => {
  const sampleTestimonials = [
    {
      id: "t1",
      image: "https://i.pravatar.cc/150?img=12",
      name: "Priya Shah",
      company: "Acme Corp",
      text: "SynergySphere made our team's coordination effortless. Tasks are clear and communication is fast.",
    },
    {
      id: "t2",
      image: "https://i.pravatar.cc/150?img=31",
      name: "Arjun Patel",
      company: "Bluebyte",
      text: "We saw a 30% reduction in missed deadlines since adopting the platform.",
    },
    {
      id: "t3",
      image: "https://i.pravatar.cc/150?img=45",
      name: "Sneha Mehta",
      company: "Green Labs",
      text: "The project chat and task linking keeps context intact—no more lost decisions.",
    },
    {
      id: "t4",
      image: "https://i.pravatar.cc/150?img=7",
      name: "Karan Verma",
      company: "Nova Studio",
      text: "Beautiful interface and intuitive workflow. The team loves it!",
    },
    {
      id: "t5",
      image: "https://i.pravatar.cc/150?img=18",
      name: "Maya Singh",
      company: "Orbit Solutions",
      text: "Fast, reliable and secure — it fits our enterprise needs.",
    },
  ];

  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <TestimonialsMarquee
        testimonials={sampleTestimonials}
        speed={25}
        gap={18}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
