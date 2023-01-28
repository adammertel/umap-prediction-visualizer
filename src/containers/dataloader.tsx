import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SDataLiv, SDataRef } from "../state";
import * as d3 from "d3";

interface IDataLoaderProps {}

export const DataLoader: React.FunctionComponent<IDataLoaderProps> = ({}) => {
  const [loadedRef, setLoadedRef] = useState<boolean>(false);
  const [loadedLiv, setLoadedLiv] = useState<boolean>(false);

  const setDataRef = useSetRecoilState(SDataRef);
  const setDataLiv = useSetRecoilState(SDataLiv);

  useEffect(() => {
    console.log("loading data");
    d3.csv(process.env.PUBLIC_URL + "/live.csv").then((data: any) => {
      setDataLiv(
        data.map((d: any) => {
          return {
            x: parseFloat(d["0"]),
            y: parseFloat(d["1"]),
            cat: d["prediction"],
            date: d["timestamp"],
          };
        })
      );
      setLoadedRef(true);
    });
    d3.csv(process.env.PUBLIC_URL + "/reference.csv").then((data: any) => {
      setDataRef(
        data.map((d: any) => {
          return {
            x: parseFloat(d["0"]),
            y: parseFloat(d["1"]),
            cat: d["label"],
          };
        })
      );
      setLoadedLiv(true);
    });
  }, []);

  return (
    <div className="container" id="container-dataloader">
      {loadedLiv && loadedRef ? (
        <></>
      ) : (
        <div className="loader">{"loading data"}</div>
      )}
    </div>
  );
};
