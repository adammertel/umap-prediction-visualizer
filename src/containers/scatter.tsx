import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SDataCategories,
  SDataRef,
  SDataRefExtent,
  SSizesScatter,
} from "../state";
import * as d3 from "d3";

interface IScatterProps {}

export const Scatter: React.FunctionComponent<IScatterProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesScatter);
  const dataExtent = useRecoilValue(SDataRefExtent);
  const dataCategories = useRecoilValue(SDataCategories);
  const refData = useRecoilValue(SDataRef);

  const histSize = 80;
  const histM = 5;

  const refChart = useRef<SVGSVGElement | null>(null);
  const refHistX = useRef<SVGSVGElement | null>(null);
  const refHistY = useRef<SVGSVGElement | null>(null);

  const scatterSize = useMemo(() => {
    return [
      containerSizes.w - histSize - histM,
      containerSizes.w - histSize - histM,
    ];
  }, [containerSizes]);

  const noBins = 50;

  const oneBinX = useMemo(() => {
    return (dataExtent[1] - dataExtent[0]) / noBins;
  }, [dataExtent]);
  const oneBinY = useMemo(() => {
    return (dataExtent[3] - dataExtent[2]) / noBins;
  }, [dataExtent]);

  const catBinMatrix = useMemo(() => {
    const catBins: { [key: string]: number[][] } = {};

    for (const ci in dataCategories) {
      const cat = dataCategories[ci];

      const catData = refData.filter((d) => d.cat === cat);
      catBins[cat] = [];

      for (var binX = 0; binX < noBins; binX++) {
        const binExtentX = [
          dataExtent[0] + oneBinX * (binX + 0),
          dataExtent[0] + oneBinX * (binX + 1),
        ];
        const catBinX = catData.filter(
          (d) => d.x > binExtentX[0] && d.x < binExtentX[1]
        );

        catBins[cat][binX] = [];
        for (var binY = 0; binY < noBins; binY++) {
          const binExtentY = [
            dataExtent[2] + oneBinY * (binY + 0),
            dataExtent[2] + oneBinY * (binY + 1),
          ];
          const catBinXY = catBinX.filter(
            (d) => d.y > binExtentY[0] && d.y < binExtentY[1]
          );
          catBins[cat][binX][binY] = catBinXY.length;
        }
      }
    }
    return catBins;
  }, [oneBinY, oneBinX]);

  console.log(catBinMatrix);

  // draw scatterplot
  useEffect(() => {
    const svgEl = d3.select(refChart.current);
  }, [containerSizes]);

  return (
    <div
      className="container"
      id="container-scatter"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      <svg
        ref={refHistX}
        style={{ bottom: 0, right: 0 }}
        id="histX"
        width={scatterSize[0]}
        height={histSize}
      />
      <svg
        ref={refHistY}
        style={{ top: 0, left: 0 }}
        id="histY"
        height={scatterSize[1]}
        width={histSize}
      />
      <svg
        ref={refChart}
        style={{ left: histSize + histM, bottom: histSize + histM }}
        id="chart"
        height={scatterSize[1]}
        width={scatterSize[0]}
      />
    </div>
  );
};
