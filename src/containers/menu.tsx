import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SSizes } from "../state";

interface IMenuProps {}

export const Menu: React.FunctionComponent<IMenuProps> = ({}) => {
  const sizes = useRecoilValue(SSizes);

  return (
    <div className="container" id="container-menu">
      menu
      <div>w: {sizes.w}</div>
      <div>h: {sizes.h}</div>
    </div>
  );
};
