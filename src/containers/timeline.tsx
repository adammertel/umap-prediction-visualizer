import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizesTimeline } from "../state";

interface ITimelineProps {}

export const Timeline: React.FunctionComponent<ITimelineProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesTimeline);

  return (
    <div
      className="container"
      id="container-timeline"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      timeline
    </div>
  );
};
