import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizesCategories } from "../state";

interface ICategoriesProps {}

export const Categories: React.FunctionComponent<ICategoriesProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesCategories);
  return (
    <div
      className="container"
      id="container-categories"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      categories
    </div>
  );
};
