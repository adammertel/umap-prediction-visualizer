import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SDataLiv, SDataRef, STimeExtent, STimeSelection } from "../state";
import * as d3 from "d3";

interface IDataLoaderProps {}

export const DataLoader: React.FunctionComponent<IDataLoaderProps> = ({}) => {
  const [loadedRef, setLoadedRef] = useState<boolean>(false);
  const [loadedLiv, setLoadedLiv] = useState<boolean>(false);

  const setDataRef = useSetRecoilState(SDataRef);
  const setDataLiv = useSetRecoilState(SDataLiv);

  const setTimeSelection = useSetRecoilState(STimeSelection);

  useEffect(() => {
    console.log("loading data");
    d3.csv(process.env.PUBLIC_URL + "/live.csv").then((data: any) => {
      const parsedData = data.map((d: any) => {
        const dParts = d.timestamp.split(" ");

        const dYear = dParts[0].split("-")[2];
        const dMonth = parseInt(dParts[0].split("-")[1]) - 1;
        const dDay = parseInt(dParts[0].split("-")[0]);

        const dHour = parseInt(dParts[1].split(":")[0]);
        const dMinutes = parseInt(dParts[1].split(":")[1]);
        const dSeconds = parseFloat(dParts[1].split(":")[2]);

        const date = new Date(dYear, dMonth, dDay, dHour, 0, 0);
        return {
          x: parseFloat(d["0"]),
          y: parseFloat(d["1"]),
          cat: d["prediction"],
          date: date,
        };
      });

      const minDate = new Date(
        Math.min(...parsedData.map((d: any) => d.date.getTime()))
      );
      const maxDate = new Date(
        Math.max(...parsedData.map((d: any) => d.date.getTime()))
      );

      setTimeSelection(minDate);
      setDataLiv(parsedData);

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
