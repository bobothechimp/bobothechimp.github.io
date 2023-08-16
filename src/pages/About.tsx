import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutUs from "../components/about/AboutUs";
import WhereWhen from "../components/about/WhereWhen";
import Rules from "../components/about/Rules";

const About = () => {
  return (
    <>
      <Header />
      <AboutUs />
      <WhereWhen />
      <Rules />
      <Footer />
    </>
  );
};

export default About;
