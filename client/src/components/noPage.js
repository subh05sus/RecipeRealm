import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "./404NotFound.json";

const NoPage = () => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      className="no-page-container"
      style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
    >
      <div>
        <div className="animation-container">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </div>
        <button className="return-button" onClick={() => navigate("/")}>
          Return to Home
        </button>
    </div>
  );
};

export default NoPage;
