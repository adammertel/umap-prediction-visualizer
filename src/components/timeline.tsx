import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { STestMessage } from "../state";

interface ITimelineProps {}

export const Timeline: React.FunctionComponent<ITimelineProps> = ({}) => {
  const testValue = useRecoilValue(STestMessage);
  return <div>{testValue}</div>;
};
