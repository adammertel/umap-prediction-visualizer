import React, { useEffect, useRef } from "react";
import { Timeline } from "./components/timeline";
import { Menu } from "./components/menu";

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { SAppH, SAppW } from "./state";

export const App: React.FunctionComponent<{}> = ({}) => {
  const appRef = useRef<HTMLDivElement | null>(null);

  const [appW, setAppW] = useRecoilState(SAppW);
  const [appH, setAppH] = useRecoilState(SAppH);

  // handling wrapper
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current) {
        setAppW(appRef.current.offsetWidth);
        setAppH(appRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  }, [appRef.current]);

  return (
    <div className="App" ref={appRef}>
      <header className="App-header"></header>
      <div>
        <Timeline />
        <Menu />
      </div>
    </div>
  );
};
