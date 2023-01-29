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
          const dParts = d.timestamp.split(" ");

          const dYear = dParts[0].split("-")[2];
          const dMonth = dParts[0].split("-")[1];
          const dDay = dParts[0].split("-")[0];

          const dHour = dParts[1].split(":")[0];
          const dMinutes = dParts[1].split(":")[1];
          return {
            x: parseFloat(d["0"]),
            y: parseFloat(d["1"]),
            cat: d["prediction"],
            date: new Date(dYear, dMonth, dDay, dHour, dMinutes),
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
