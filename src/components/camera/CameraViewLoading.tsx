import React from "react";
import Spinner from "../Spinner";

//simple loading state
const CameraViewLoading = () => {
  return (
    <div className="flex-center h-full w-full">
      <Spinner />
    </div>
  );
};

export default CameraViewLoading;
