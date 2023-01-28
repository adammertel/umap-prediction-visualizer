import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { STestMessage, SSizes } from "../state";

interface IMenuProps {}

export const Menu: React.FunctionComponent<IMenuProps> = ({}) => {
  const [testMessageVal, setTestMessage] = useRecoilState(STestMessage);
  const sizes = useRecoilValue(SSizes);

  return (
    <div>
      <div>w: {sizes.w}</div>
      <div>h: {sizes.h}</div>
      <input
        value={testMessageVal}
        onChange={(e: any) => {
          setTestMessage(e.target.value);
        }}
      />
    </div>
  );
};
