import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SCategorySelection,
  SDataCategories,
  SDataLiv,
  SDataLivExtent,
  SDataLivFiltered,
  SDataRef,
  SRectangleActive,
  SRectangleLivData,
  SSizes,
  SSizesLegend,
} from "../state";

import * as d3 from "d3";
import { Categories } from "./categories";
import { Category, categoryColors } from "../variables";

import { AiFillCheckSquare, AiFillCloseSquare } from "react-icons/ai";
import { scaleLinear } from "d3-scale";

interface ILegendProps {}

export const Legend: React.FunctionComponent<ILegendProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesLegend);
  const dataCategories = useRecoilValue(SDataCategories);

  const refData = useRecoilValue(SDataRef);
  const livSelData = useRecoilValue(SDataLivFiltered);
  const livRectData = useRecoilValue(SRectangleLivData);
  const livAllData = useRecoilValue(SDataLiv);
  const dataExtent = useRecoilValue(SDataLivExtent);

  const rectSelActive = useRecoilValue(SRectangleActive);

  const [dataCategoriesSel, setDataCategoriesSel] =
    useRecoilState(SCategorySelection);

  const refHist = useRef<SVGSVGElement | null>(null);
  const refHistAxis = useRef<SVGSVGElement | null>(null);

  const containerM = 20;
  const histML = 30;
  const headingH = 50;
  const histH =
    containerSizes.h > 500 + headingH + containerM
      ? 300
      : containerSizes.h - (headingH + containerM + 100);

  const histW = containerSizes.w - 2 * containerM - histML;
  const oneItemW = histW / dataCategories.length;

  const scaleY = useMemo(() => {
    let maxLen = 0;

    dataCategoriesSel.forEach((cat) => {
      const len = livSelData.filter((d) => d.cat === cat).length;
      if (len > maxLen) {
        maxLen = len;
      }
    });

    return scaleLinear().domain([0, maxLen]).range([histH, 0]);
  }, [dataCategoriesSel, livSelData]);

  // draw histogram
  useEffect(() => {
    const svgEl = d3.select(refHist.current);
    const svgElAxis = d3.select(refHistAxis.current);

    if (svgEl) {
      svgEl.selectAll(`.legend-hist`).remove();
      const histEl = svgEl.append("g").attr("class", "legend-hist");

      dataCategories.forEach((cat, ci) => {
        const sel = dataCategoriesSel.includes(cat);
        if (sel) {
          const len = livSelData.filter((d) => d.cat === cat).length;
          const lenR = livRectData.filter((d) => d.cat === cat).length;

          histEl
            .append("rect")
            .attr("width", 10)
            .attr("height", scaleY(0) - scaleY(len) - 2)
            .attr("x", oneItemW * ci + 5)
            .attr("y", scaleY(len))
            .style("fill", rectSelActive ? "grey" : categoryColors[cat][0])
            .style("stroke", "black")
            .style("stroke-width", 0);

          histEl
            .append("rect")
            .attr("width", 10)
            .attr("height", scaleY(0) - scaleY(lenR))
            .attr("x", oneItemW * ci + 5)
            .attr("y", scaleY(lenR))
            .style("fill", categoryColors[cat][1])
            .style("stroke", "black")
            .style("stroke-width", 0);
        }
      });
    }
  }, [scaleY, livRectData]);

  // draw axis
  useEffect(() => {
    const svgElAxis = d3.select(refHistAxis.current);

    if (svgElAxis) {
      svgElAxis.selectAll(`.legend-axis`).remove();
      const histAxisEl = svgElAxis.append("g").attr("class", "legend-axis");

      const axisY = d3.axisRight(scaleY).ticks(5);

      histAxisEl
        .append("g")
        .attr("transform", `translate(${0}, ${-1})`)
        .attr("class", "axis-lines")
        .call(axisY);
    }
  }, [scaleY, livRectData]);

  return (
    <div
      className="container"
      id="container-legend"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      <div
        id="legend-list-heading"
        style={{
          position: "absolute",
          height: headingH,
          top: containerM,
          left: containerM,
        }}
      >
        Categories:
      </div>
      <svg
        ref={refHist}
        className="histogram"
        width={histW}
        height={histH}
        style={{
          top: headingH + containerM,
          left: containerM + histML,
          position: "absolute",
          //backgroundColor: "red",
        }}
      />

      <svg
        ref={refHistAxis}
        className="histogram"
        width={histML + 20}
        height={histH + 10}
        style={{
          top: headingH + containerM,
          left: containerM,
          position: "absolute",
          //backgroundColor: "red",
        }}
      />
      <div
        id="legend-list"
        style={{
          position: "absolute",
          left: containerM + histML,
          top: headingH + containerM + histH,
          width: histW,
        }}
      >
        {dataCategories.map((category, ci) => {
          const sel = dataCategoriesSel.includes(category);
          return (
            <div
              className="legend-list-item"
              style={{
                position: "absolute",
                top: 10,
                left: oneItemW * ci,
                width: oneItemW,
              }}
              key={ci}
              onClick={() => {
                const oldCategories = [...dataCategoriesSel];
                if (oldCategories.includes(category)) {
                  setDataCategoriesSel(
                    oldCategories.filter((c) => c !== category)
                  );
                } else {
                  setDataCategoriesSel([...oldCategories, category]);
                }
              }}
            >
              <div
                className="legend-list-item-icon"
                style={{
                  width:
                    (containerSizes.w - 2 * containerM) / dataCategories.length,
                }}
              >
                {sel ? (
                  <AiFillCheckSquare
                    size={20}
                    color={categoryColors[category][1]}
                  />
                ) : (
                  <AiFillCloseSquare size={20} color="grey" />
                )}
              </div>
              <div
                className="legend-list-item-label"
                style={{
                  color: `${sel ? categoryColors[category][1] : "grey"}`,
                }}
              >
                {category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
