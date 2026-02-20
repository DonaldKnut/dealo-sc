import React from "react";
import "./Steps.css";
import { GiTwoCoins } from "react-icons/gi";
import { MdFlight } from "react-icons/md";
import { IoChevronForwardCircle } from "react-icons/io5";
import Image from "next/image";
import Button from "../Button/Button";

type Props = {};

const Steps: React.FC<Props> = () => {
  const flagsUrl = `https://res.cloudinary.com/dtujpq8po/image/upload/v1704478876/cryptoAssets/travelImages/flags__fvxk4f.png`;
  const airlineTicketImageUrl = `https://res.cloudinary.com/dtujpq8po/image/upload/v1704478750/cryptoAssets/travelImages/airline-tickets_zsiqkv.png`;

  return (
    <div className="steps_wrapper_container">
      {/* Step 1 */}
      <div className="step_boxes">
        <MdFlight className="text-5xl coins" />
        <h2 className="text-green-800">
          Travel in premium style
          <br />
          with our luxury escapade.
        </h2>
        <Image
          src={airlineTicketImageUrl}
          alt="Airline Tickets"
          width={300}
          height={300}
          className="flags_of_nations"
        />
      </div>

      {/* Step 2 */}
      <div className="step_boxes">
        <GiTwoCoins className="text-5xl coins" />
        <h2 className="text-green-800">
          Let us finance your travels
          <br />
          while you pay us later.
        </h2>
        <Image
          src={flagsUrl}
          alt="Flags of Nations"
          width={700}
          height={700}
          className="flags_of_nations"
        />
      </div>

      {/* Step 3 */}
      <div className="step_boxes odd_step_box">
        <h2 className="text-green-800 mb-16 package_text text-2xl">
          Check our other
          <br />
          packages.
        </h2>
        <Button
          type="button"
          title="Check Packages"
          icon={<IoChevronForwardCircle className="text-2xl" />}
          variant="btn_green_rounded"
          to="/packages"
        />
      </div>
    </div>
  );
};

export default Steps;
