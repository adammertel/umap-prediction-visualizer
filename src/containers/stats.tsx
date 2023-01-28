import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizesStats } from "../state";

interface IStatsProps {}

export const Stats: React.FunctionComponent<IStatsProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesStats);
  return (
    <div
      className="container"
      id="container-stats"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      stats
    </div>
  );
};
