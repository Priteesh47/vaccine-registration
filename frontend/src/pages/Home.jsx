import React from "react";

import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopVaccines from "../components/TopVaccines";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopVaccines />
      <Banner />
    </div>
  );
};

export default Home;
