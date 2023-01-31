import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizesHeader } from "../state";

interface IHeaderProps {}

export const Header: React.FunctionComponent<IHeaderProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesHeader);
  return (
    <div
      className="container"
      id="container-header"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      <h1 className="heading-text">UMAP Prediction Visualizer</h1>
    </div>
  );
};
