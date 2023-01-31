import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SCategorySelection,
  SDataCategories,
  SDataLiv,
  SDataLivExtent,
  SDataLivFiltered,
  SDataRef,
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
  const livAllData = useRecoilValue(SDataLiv);
  const dataExtent = useRecoilValue(SDataLivExtent);

  const [dataCategoriesSel, setDataCategoriesSel] =
    useRecoilState(SCategorySelection);

  const refHist = useRef<SVGSVGElement | null>(null);

  const containerM = 10;
  const headingH = 50;
  const histH = 300;

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

    if (svgEl) {
      svgEl.selectAll(`.legend-hist`).remove();
      const histEl = svgEl.append("g").attr("class", "legend-hist");

      dataCategories.forEach((cat, ci) => {
        const sel = dataCategoriesSel.includes(cat);
        if (sel) {
          const len = livSelData.filter((d) => d.cat === cat).length;
          console.log(cat, sel, len, scaleY(len));
          histEl
            .append("rect")
            .attr("width", 10)
            .attr("height", scaleY(0) - scaleY(len) - 2)
            .attr(
              "x",
              (containerSizes.w / (dataCategories.length + 1)) * ci + 7
            )
            .attr("y", scaleY(len))
            .style("fill", categoryColors[cat][0])
            .style("stroke", "black")
            .style("stroke-width", 0);
        }
      });
    }
  }, [scaleY]);

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
        width={containerSizes.w - 2 * containerM}
        height={histH}
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
          left: containerM,
          top: headingH + containerM + histH,
          width: containerSizes.w - 2 * containerM,
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
                left:
                  ((containerSizes.w - 2 * containerM) /
                    dataCategories.length) *
                  ci,
                width:
                  (containerSizes.w - 2 * containerM) / dataCategories.length,
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
