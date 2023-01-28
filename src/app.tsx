import React, { useEffect, useRef } from "react";
import {
  Categories,
  DataLoader,
  Header,
  Menu,
  Scatter,
  Stats,
  Timeline,
} from "./containers";

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
    <div id="app" ref={appRef}>
      <DataLoader />
      <Header />
      <Timeline />
      <Menu />
      <Scatter />
      <Stats />
      <Categories />
    </div>
  );
};
