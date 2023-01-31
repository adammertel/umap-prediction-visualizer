import {
  select,
  contourDensity,
  scaleLinear,
  geoPath,
  curveCatmullRom,
  area,
} from "d3";
import * as d3 from "d3";
import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  IDataPointLiv,
  IDataPointRef,
  SCategorySelection,
  SDataCategories,
  SDataLiv,
  SDataLivExtent,
  SDataLivFiltered,
  SDataRef,
  SSizesCategories,
} from "../state";
import { Category, categoryColors, colors } from "./../variables";

interface ICategoriesProps {}

export const Categories: React.FunctionComponent<ICategoriesProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesCategories);
  const dataCategories = useRecoilValue(SDataCategories);
  const dataCategoriesSel = useRecoilValue(SCategorySelection);

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
      {dataCategories.map((dataCategory, di) => {
        return (
          dataCategoriesSel.includes(dataCategory) && (
            <CategoryContainer key={di} dataCategory={dataCategory} />
          )
        );
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
  const h = 300;
  const hLabel = 25;
  const m = 10;
  const sChart = h - hLabel - 2 * m;

  const mViolin = 20;
  const wViolin = 75;
  const hViolinLabel = 15;
  const hViolin = sChart + hViolinLabel;

  const refChart = useRef<SVGSVGElement | null>(null);
  const refChartCanvasAll = useRef<HTMLCanvasElement | null>(null);
  const refChartCanvasSel = useRef<HTMLCanvasElement | null>(null);

  const refViolin1 = useRef<SVGSVGElement | null>(null);
  const refViolin2 = useRef<SVGSVGElement | null>(null);

  const refData = useRecoilValue(SDataRef);
  const livSelData = useRecoilValue(SDataLivFiltered);
  const livAllData = useRecoilValue(SDataLiv);
  const dataExtent = useRecoilValue(SDataLivExtent);

  const w = m + sChart + mViolin + wViolin + mViolin + wViolin + mViolin + m;

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

  // violin scales
  const violin1Y = scaleLinear()
    .domain([dataExtent[0], dataExtent[1]])
    .range([hViolinLabel, hViolin]);

  const violin2Y = scaleLinear()
    .domain([dataExtent[2], dataExtent[3]])
    .range([hViolinLabel, hViolin]);

  const violinXLiv = scaleLinear()
    .domain([0, 100])
    .range([wViolin / 2, 0]);

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
        .attr("stroke", colors.unselected)
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
        .attr("stroke", colors.unselected)
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
        ctx.globalAlpha = 0.15;
        ctx.globalCompositeOperation = "multiply";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0;
        //ctx.fillStyle = catColor[1];
        ctx.fillStyle = colors.selection;

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

  // draw violins
  useEffect(() => {
    const noBins = 30;
    const middleLineW = 1;
    const curve = d3.curveMonotoneX;

    const drawViolin = (
      refEl: any,
      yScale: any,
      dim: "x" | "y",
      noBins: number,
      className: string,
      label: string
    ) => {
      const svgEl = select(refEl.current);

      const refBinsX = d3
        .bin()
        .domain(yScale.domain() as [number, number])
        .thresholds(yScale.ticks(noBins))
        .value((d) => d)(catDataRef.map((d: any) => d[dim]));

      const livAllBinsX = d3
        .bin()
        .domain(yScale.domain() as [number, number])
        .thresholds(yScale.ticks(noBins))
        .value((d) => d)(catDataLivAll.map((d: any) => d[dim]));

      const livSelBinsX = d3
        .bin()
        .domain(yScale.domain() as [number, number])
        .thresholds(yScale.ticks(noBins))
        .value((d) => d)(catDataLivSel.map((d: any) => d[dim]));

      const longestBinRef = d3.max(refBinsX.map((a) => a.length));
      const longestBinLiv = d3.max(livAllBinsX.map((a) => a.length));

      if (longestBinRef && longestBinLiv && svgEl && dataReady) {
        svgEl.selectAll(`.${className}`).remove();
        const el = svgEl.append("g").attr("class", className);

        const violinXRef = scaleLinear()
          .domain([0, longestBinRef])
          .range([wViolin / 2 + middleLineW / 2, wViolin]);

        const violinXLiv = scaleLinear()
          .domain([0, longestBinLiv])
          .range([wViolin / 2 + middleLineW / 2, 0]);

        const refArea = area()
          .x0((d: any) => violinXRef(0))
          .x1((d: any) => violinXRef(d[0]))
          .y((d: any) => yScale(d[1]))
          .curve(curve);

        const livArea = area()
          .x0((d: any) => violinXLiv(0))
          .x1((d: any) => violinXLiv(d[0]))
          .y((d: any) => yScale(d[1]))
          .curve(curve);

        const dataRefBins: [number, number][] = refBinsX.map((b) => [
          b.length,
          b.x0 || 1,
        ]);
        const dataLivBinsAll: [number, number][] = livAllBinsX.map((b) => [
          b.length,
          b.x0 || 1,
        ]);
        const dataLivBinsSel: [number, number][] = livSelBinsX.map((b) => [
          b.length,
          b.x0 || 1,
        ]);

        const axisY = d3.axisLeft(yScale).ticks(5);

        el.append("path")
          .style("stroke", colors.white)
          .style("stroke-width", 1)
          .style("fill", catColor[1])
          .attr("d", (d: any) => refArea(dataRefBins));

        el.append("path")
          .style("stroke", colors.white)
          .style("stroke-width", 1)
          .style("fill", colors.unselected)
          .attr("d", (d: any) => livArea(dataLivBinsAll));

        el.append("path")
          .style("stroke", "none")
          .style("fill", colors.selection)
          .attr("d", (d: any) => livArea(dataLivBinsSel));

        el.append("line")
          .style("stroke", colors.white)
          .style("stroke-width", middleLineW)
          .attr("x1", wViolin / 2)
          .attr("x2", wViolin / 2)
          .attr("y1", hViolinLabel)
          .attr("y2", hViolin);

        el.append("text")
          .style("fill", colors.white)
          .style("font-weight", 600)
          .style("font-size", 9)
          .style("stroke-width", 1)
          .attr("x", wViolin / 2 - 30)
          .attr("y", 10)
          .text(label);

        el.append("g")
          .attr("transform", `translate(${wViolin / 2}, ${0})`)
          .attr("class", "axis-lines")
          .call(axisY);
      }
    };
    drawViolin(refViolin1, violin1Y, "x", noBins, "violin-x", "X distribution");
    drawViolin(refViolin2, violin2Y, "y", noBins, "violin-y", "Y distribution");
  }, [catDataRef, catDataLivAll, catDataLivSel]);

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
          color: catColor[0],
          lineHeight: `${hLabel + m}px`,
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

      <svg
        ref={refViolin1}
        className="category-violin category-violin-1"
        width={wViolin}
        height={hViolin}
        style={{
          bottom: m,
          left: sChart + m + m,
        }}
      />
      <svg
        ref={refViolin2}
        className="category-violin category-violin-2"
        width={wViolin}
        height={hViolin}
        style={{
          bottom: m,
          left: sChart + mViolin + wViolin + mViolin,
        }}
      />
    </div>
  );
};
