import React from "react";
import Navbar from "./exploreComponents/Navbar/Navbar";
import Hero from "./exploreComponents/Hero/Hero";
import Footer from "./exploreComponents/Footer/Footer";
import Feature from "./exploreComponents/Feature/Feature";
import FlightAdvert from "./exploreComponents/FlightAdvert/FlightAdvert";
import Testimonial from "./exploreComponents/Testimonial/Testimonial";
import Study from "./exploreComponents/Study/Study";
import Steps from "./exploreComponents/Steps/Steps";
import DealoWorld from "./exploreComponents/DealoWorld/DealoWorld";
import MobileWrap from "./exploreComponents/MobileWrap/MobileWrap";
import Video from "./exploreComponents/Video/Video";

// ✅ Static page - Better for SEO and performance
// Revalidate every 6 hours to keep content fresh
export const revalidate = 21600;

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* <Feature /> */}
      <Study />
      <DealoWorld />
      <Steps />
      <FlightAdvert />
      {/* <Testimonial /> */}
      <Video />
      <MobileWrap />
      <Footer />
    </div>
  );
};

export default page;
