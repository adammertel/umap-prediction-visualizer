import { select, contourDensity, scaleLinear, geoPath } from "d3";
import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  IDataPointLiv,
  IDataPointRef,
  SDataCategories,
  SDataLiv,
  SDataLivExtent,
  SDataLivSelected,
  SDataRef,
  SSizesCategories,
} from "../state";
import { Category, categoryColors } from "./../variables";

interface ICategoriesProps {}

export const Categories: React.FunctionComponent<ICategoriesProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesCategories);
  const dataCategories = useRecoilValue(SDataCategories);

  return (
    <div
      className="container"
      id="container-categories"
      style={{
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      {dataCategories.map((dataCategory) => {
        return <CategoryContainer dataCategory={dataCategory} />;
      })}
    </div>
  );
};

interface ICategoryProps {
  dataCategory: Category;
}

const CategoryContainer: React.FunctionComponent<ICategoryProps> = ({
  dataCategory,
}) => {
  const w = 400;
  const h = 300;
  const hLabel = 25;
  const m = 10;
  const sChart = h - hLabel - 2 * m;

  const refChart = useRef<SVGSVGElement | null>(null);
  const refChartCanvasAll = useRef<HTMLCanvasElement | null>(null);
  const refChartCanvasSel = useRef<HTMLCanvasElement | null>(null);

  const refData = useRecoilValue(SDataRef);
  const livSelData = useRecoilValue(SDataLivSelected);
  const livAllData = useRecoilValue(SDataLiv);
  const dataExtent = useRecoilValue(SDataLivExtent);

  const catColor = categoryColors[dataCategory];

  const catDataLivAll: IDataPointLiv[] = useMemo(() => {
    return livAllData.filter((d) => d.cat === dataCategory);
  }, [livAllData]);
  const catDataLivSel: IDataPointLiv[] = useMemo(() => {
    return livSelData.filter((d) => d.cat === dataCategory);
  }, [livSelData]);
  const catDataRef: IDataPointRef[] = useMemo(() => {
    return refData.filter((d) => d.cat === dataCategory);
  }, [refData]);

  const dataReady = useMemo<boolean>(() => {
    return (
      dataExtent[0] !== 0 &&
      dataExtent[1] !== 0 &&
      dataExtent[2] !== 0 &&
      dataExtent[3] !== 0
    );
  }, [dataExtent]);

  const chartX = scaleLinear()
    .domain([dataExtent[0], dataExtent[1]])
    .range([0, sChart]);
  const chartY = scaleLinear()
    .domain([dataExtent[2], dataExtent[3]])
    .range([0, sChart]);

  const contours = contourDensity()
    .x((d) => chartX(d[0]))
    .y((d) => chartY(d[1]))
    .size([sChart, sChart])
    .bandwidth(10)
    .thresholds(30);

  // draw chart
  useEffect(() => {
    const svgEl = select(refChart.current);

    if (svgEl && dataReady) {
      //svgEl.selectAll(`.category-chart-contour`).remove();
      //const catChartEl = svgEl
      //.append("g")
      //.attr("class", "category-chart-contour");

      const cont = contours(catDataRef.map((d) => [d.x, d.y]));

      svgEl
        .selectAll(".contour-lines")
        .data(cont)
        .join("path")
        .attr("class", "contour-lines")
        .attr("fill", catColor[0])
        .attr("fill-opacity", 2 / cont.length)
        .attr("stroke", catColor[1])
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", (d, i) => (i % 5 ? 0.25 : 1))
        .attr("stroke-opacity", (d, i) => (i % 5 ? 0.05 : 0.25))
        .attr("d", geoPath());

      svgEl
        .selectAll("line.grid-y")
        .data(chartY.ticks(5))
        .enter()
        .append("line")
        .attr("class", "grid-y")
        .attr("x1", 0)
        .attr("x2", sChart)
        .attr("y1", (d) => chartY(d))
        .attr("y2", (d) => chartY(d))
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 0.25);

      svgEl
        .selectAll("line.grid-x")
        .data(chartX.ticks(5))
        .enter()
        .append("line")
        .attr("class", "grid-x")
        .attr("y1", 0)
        .attr("y2", sChart)
        .attr("x1", (d) => chartX(d))
        .attr("x2", (d) => chartX(d))
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 0.25);
    }
  }, [catDataRef]);

  // draw points
  useEffect(() => {
    const canvasEl = select(refChartCanvasSel.current);

    if (canvasEl && canvasEl !== null && dataReady) {
      const ctx = canvasEl?.node()?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, sChart, sChart);
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = "multiply";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0;
        //ctx.fillStyle = catColor[1];
        ctx.fillStyle = "red";

        catDataLivSel.forEach((pointData) => {
          ctx.beginPath();
          ctx.arc(
            chartX(pointData.x),
            chartY(pointData.y),
            1,
            0,
            2 * Math.PI,
            false
          );

          ctx.fill();
          //ctx.stroke();
        });
      }
    }
  }, [catDataLivSel]);

  // draw points
  useEffect(() => {
    const canvasEl = select(refChartCanvasAll.current);

    if (canvasEl && canvasEl !== null && dataReady) {
      const ctx = canvasEl?.node()?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, sChart, sChart);
        ctx.globalAlpha = 0.05;
        ctx.globalCompositeOperation = "multiply";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0;
        ctx.fillStyle = "grey";

        catDataLivAll.forEach((pointData) => {
          ctx.beginPath();
          ctx.arc(
            chartX(pointData.x),
            chartY(pointData.y),
            1,
            0,
            2 * Math.PI,
            false
          );

          ctx.fill();
          //ctx.stroke();
        });
      }
    }
  }, [catDataLivAll]);

  return (
    <div
      className="category-panel"
      style={{
        width: w,
        height: h,
      }}
    >
      <div
        className="category-label"
        style={{
          height: `${hLabel}px`,
          color: catColor[1],
          lineHeight: `${hLabel + m}px`,
          textShadow: `1px 0 ${catColor[0]}, 0 1px ${catColor[0]}, -1px 0 ${catColor[0]}, 0 -1px ${catColor[0]}`,
        }}
      >
        {dataCategory}
      </div>
      <svg
        ref={refChart}
        className="category-chart"
        width={sChart}
        height={sChart}
        style={{
          margin: m,
          top: hLabel,
          left: 0,
        }}
      />
      <canvas
        ref={refChartCanvasAll}
        className="canvas-category-chart"
        width={sChart}
        height={sChart}
        style={{
          margin: m,
          top: hLabel,
          left: 0,
        }}
      />
      <canvas
        ref={refChartCanvasSel}
        className="canvas-category-chart"
        width={sChart}
        height={sChart}
        style={{
          margin: m,
          top: hLabel,
          left: 0,
        }}
      />
    </div>
  );
};
