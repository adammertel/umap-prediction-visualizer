import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  SDataLiv,
  SDataLoadedLiv,
  SDataLoadedRef,
  SDataRef,
  SSizes,
  STimeExtent,
  STimeSelection,
  SCategorySelection,
} from "../state";
import * as d3 from "d3";
import ReactLoading from "react-loading";

interface IDataLoaderProps {}

export const DataLoader: React.FunctionComponent<IDataLoaderProps> = ({}) => {
  const [loadedRef, setLoadedRef] = useRecoilState(SDataLoadedRef);
  const [loadedLiv, setLoadedLiv] = useRecoilState(SDataLoadedLiv);

  const setDataRef = useSetRecoilState(SDataRef);
  const setDataLiv = useSetRecoilState(SDataLiv);
  const setCategories = useSetRecoilState(SCategorySelection);

  const sizes = useRecoilValue(SSizes);

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

      const dateUnique = [
        //@ts-ignore
        ...new Set(parsedData.map((d: any) => d.date.valueOf())),
      ];

      dateUnique.sort((a, b) => (a > b ? 1 : -1));

      // setTimeSelection([minDate, maxDate]);
      setTimeSelection([new Date(dateUnique[0]), new Date(dateUnique[3])]);
      setCategories(Array.from(new Set(parsedData.map((d: any) => d.cat))));
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
        <div className="loader">
          <ReactLoading
            className="loader-animation"
            type="bars"
            color="black"
            height={sizes.h / 2}
            width={sizes.w / 2}
          />
          <div
            className="loader-text"
            style={{
              marginTop: sizes.h / 6,
              fontSize: sizes.w / 20,
            }}
          >
            loading data...
          </div>
        </div>
      )}
    </div>
  );
};
