import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SDataCategories,
  SDataLivFiltered,
  SDataRef,
  SDataRefExtent,
  SSizesScatter,
} from "../state";
import * as d3 from "d3";

import { scaleLinear, scaleSqrt } from "d3-scale";
import { Category, categoryColors } from "../variables";
import { select } from "d3";

interface IScatterProps {}

export const Scatter: React.FunctionComponent<IScatterProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesScatter);
  const dataExtent = useRecoilValue(SDataRefExtent);
  const dataCategories = useRecoilValue(SDataCategories);

  const refData = useRecoilValue(SDataRef);
  const livData = useRecoilValue(SDataLivFiltered);

  const histSize = 80;
  const histM = 5;
  const chartM = 5;

  const refChart = useRef<SVGSVGElement | null>(null);
  const refHistX = useRef<SVGSVGElement | null>(null);
  const refHistY = useRef<SVGSVGElement | null>(null);

  const svgChartEl = useMemo(() => {
    const svg = d3.select(refChart.current);
    if (svg) {
      svg.selectAll("*").remove();
    }
    return svg;
  }, [refChart]);

  const scatterSize = useMemo(() => {
    return [
      containerSizes.w - histSize - histM,
      containerSizes.w - histSize - histM,
    ];
  }, [containerSizes]);

  const canvasReady = useMemo<boolean>(() => {
    return scatterSize[0] > 0 && scatterSize[1] > 0;
  }, [scatterSize[0], scatterSize[1]]);

  const dataReady = useMemo<boolean>(() => {
    return (
      dataExtent[0] !== 0 &&
      dataExtent[1] !== 0 &&
      dataExtent[2] !== 0 &&
      dataExtent[3] !== 0
    );
  }, [dataExtent]);

  const noBins = 100;

  const oneBinX = useMemo(() => {
    return (dataExtent[1] - dataExtent[0]) / noBins;
  }, [dataExtent]);
  const oneBinY = useMemo(() => {
    return (dataExtent[3] - dataExtent[2]) / noBins;
  }, [dataExtent]);

  const oneBinW: number = useMemo(() => {
    return (scatterSize[0] - 2 * chartM) / noBins;
  }, [scatterSize, noBins]);
  const oneBinH: number = useMemo(() => {
    return (scatterSize[1] - 2 * chartM) / noBins;
  }, [scatterSize, noBins]);

  // define scales for live data
  const scaleChartX = useMemo(() => {
    return scaleLinear()
      .domain([dataExtent[0], dataExtent[1]])
      .range([chartM, scatterSize[0] - 1 * chartM]);
  }, [dataExtent, scatterSize]);

  // define scales for live data
  const scaleChartY = useMemo(() => {
    return scaleLinear()
      .domain([dataExtent[2], dataExtent[3]])
      .range([chartM, scatterSize[1] - 1 * chartM]);
  }, [dataExtent, scatterSize]);

  const catBinMatrix: Map<Category, number[][]> = useMemo(() => {
    const catBins: Map<Category, number[][]> = new Map();

    for (const ci in dataCategories) {
      const cat = dataCategories[ci];

      const catData = refData.filter((d) => d.cat === cat);

      const catBinValues: number[][] = [];

      for (var binX = 0; binX < noBins; binX++) {
        const binExtentX = [
          dataExtent[0] + oneBinX * (binX + 0),
          dataExtent[0] + oneBinX * (binX + 1),
        ];
        const catBinX = catData.filter(
          (d) => d.x > binExtentX[0] && d.x < binExtentX[1]
        );

        catBinValues[binX] = [];
        for (var binY = 0; binY < noBins; binY++) {
          const binExtentY = [
            dataExtent[2] + oneBinY * (binY + 0),
            dataExtent[2] + oneBinY * (binY + 1),
          ];
          const catBinXY = catBinX.filter(
            (d) => d.y > binExtentY[0] && d.y < binExtentY[1]
          );
          catBinValues[binX][binY] = catBinXY.length;
        }
      }

      // assign values to the map
      catBins.set(cat, catBinValues);
    }
    return catBins;
  }, [oneBinY, oneBinX, refData]);

  // draw scatterplot
  useEffect(() => {
    const svgEl = select(refChart.current);
    if (svgEl && canvasReady && dataReady) {
      svgEl.selectAll(`.bins-wrapper`).remove();
      const binsEl = svgEl.append("g").attr("class", "bins-wrapper");

      console.log("drawing bins");

      const scaleOpacity = scaleSqrt().domain([0, 100]).range([0, 1]);
      if (oneBinW > 0 && oneBinH > 0) {
        for (var binX = 0; binX < noBins; binX++) {
          const binExtentX = [
            dataExtent[0] + oneBinX * (binX + 0),
            dataExtent[0] + oneBinX * (binX + 1),
          ];

          for (var binY = 0; binY < noBins; binY++) {
            const binExtentY = [
              dataExtent[2] + oneBinY * (binY + 0),
              dataExtent[2] + oneBinY * (binY + 1),
            ];

            // find the most occured category in the bin
            const binData: any = {};
            for (const ci in dataCategories) {
              const cat: Category = dataCategories[ci];
              const catData = catBinMatrix.get(cat);
              binData[cat] = catData ? catData[binX][binY] : 0;
            }

            if (Object.keys(binData).length) {
              const binCategory: any = Object.keys(binData).reduce((a, b) =>
                binData[a] > binData[b] ? a : b
              );

              const binValue = binData[binCategory];

              if (binValue > 10) {
                binsEl
                  .append("rect")
                  .attr("class", "bin")
                  .attr("x", scaleChartX(binExtentX[0]))
                  .attr("y", scaleChartY(binExtentY[0]))
                  .attr("fill-opacity", scaleOpacity(binValue))

                  .attr("width", oneBinW)
                  .attr("height", oneBinH)
                  .attr("stroke-width", 1)
                  //.attr("stroke", categoryColors[binCategory as Category][0])
                  .attr("fill", categoryColors[binCategory as Category][0]);
              }

              //categoryColors;
              //catBinMatrix;
            }
          }
        }
      }
    }
  }, [catBinMatrix, oneBinW, oneBinH]);

  // draw live points
  useEffect(() => {
    const svgEl = select(refChart.current);

    if (svgEl && canvasReady && dataReady) {
      //console.log(scatterSize);
      const pointsEl = svgEl.append("g").attr("class", "points-wrapper");

      svgChartEl.selectAll(".points-wrapper").remove();
      console.log("drawing data points");

      if (livData && oneBinW > 0 && oneBinH > 0) {
        livData.forEach((livPoint) => {
          pointsEl
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", scaleChartX(livPoint.x))
            .attr("cy", scaleChartY(livPoint.y))
            .attr("r", 0.3)
            .attr("stroke-width", 0)
            .attr("stroke", "black")
            .attr("fill", categoryColors[livPoint.cat][1]);
        });
      }
      console.log("drawing data points ended");
    }
  }, [livData, oneBinW, oneBinH]);

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
      {canvasReady && (
        <>
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
        </>
      )}
    </div>
  );
};
function scaleLog() {
  throw new Error("Function not implemented.");
}
