import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizesScatter } from "../state";

interface IScatterProps {}

export const Scatter: React.FunctionComponent<IScatterProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesScatter);
  return (
    <div
      className="container"
      id="container-scatter"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      scatter
    </div>
  );
};
