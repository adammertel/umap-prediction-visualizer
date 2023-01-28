import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizes, SSizesMenu } from "../state";

interface IMenuProps {}

export const Menu: React.FunctionComponent<IMenuProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesMenu);

  return (
    <div
      className="container"
      id="container-menu"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      menu
    </div>
  );
};
