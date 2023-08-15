import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddSeason from "../components/AddSeason";

import "../styles/addremove.css";

const AddRemove = () => {
  return (
    <>
      <Header />
      <AddSeason />
      <Footer />
    </>
  );
};

export default AddRemove;
