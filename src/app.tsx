import React, { useEffect, useRef } from "react";
import {
  Categories,
  DataLoader,
  Header,
  Menu,
  Scatter,
  Timeline,
} from "./containers";

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { SAppH, SAppW, SDataLoadedLiv, SDataLoadedRef } from "./state";

export const App: React.FunctionComponent<{}> = ({}) => {
  const appRef = useRef<HTMLDivElement | null>(null);

  const [appW, setAppW] = useRecoilState(SAppW);
  const [appH, setAppH] = useRecoilState(SAppH);

  const loadedRef = useRecoilValue(SDataLoadedRef);
  const loadedLiv = useRecoilValue(SDataLoadedLiv);

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
      {loadedLiv && loadedRef ? (
        <>
          <Header />
          <Timeline />
          <Menu />
          <Scatter />
          <Categories />
        </>
      ) : (
        <DataLoader />
      )}
    </div>
  );
};
