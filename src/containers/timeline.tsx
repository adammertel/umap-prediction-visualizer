import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SDataCategories,
  SDataLiv,
  SDataTimeExtent,
  SMaxInTimeIntervals,
  SSizesTimeline,
  STimeExtent,
  STimeIntervals,
  STimeSelection,
} from "../state";
import * as d3 from "d3";
import { scaleLinear, select } from "d3";
import { Categories } from "./categories";
import { Category, categoryColors } from "../variables";

interface ITimelineProps {}

const sliderH = 30;

export const Timeline: React.FunctionComponent<ITimelineProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesTimeline);
  const dataTimeExtent = useRecoilValue(SDataTimeExtent);
  const dataCategories = useRecoilValue(SDataCategories);

  const timeIntervals = useRecoilValue(STimeIntervals);
  const maxInTimeIntervals = useRecoilValue(SMaxInTimeIntervals);

  const timeExtent = useRecoilValue(STimeExtent);
  const [timeSelection, setTimeSelection] = useRecoilState(STimeSelection);

  const dataLiv = useRecoilValue(SDataLiv);
  const chartMX = 20;
  const chartMT = 25;

  const timeLineH = useMemo<number>(
    () => containerSizes.h - sliderH,
    [containerSizes.h]
  );

  const refTimeline = useRef<SVGSVGElement | null>(null);
  const svgEl = useMemo(() => {
    const svg = d3.select(refTimeline.current);
    return svg;
  }, [refTimeline]);

  const canvasReady = useMemo<boolean>(() => {
    return containerSizes.w > 0 && containerSizes.h > 0;
  }, [containerSizes.w, containerSizes.h]);

  const dataReady = useMemo<boolean>(() => {
    return dataTimeExtent[0] !== dataTimeExtent[1];
  }, [dataTimeExtent]);

  // define temporal scale
  const scaleX = useMemo(() => {
    return scaleLinear()
      .domain([timeIntervals[0], timeIntervals[timeIntervals.length - 1]])
      .range([chartMX, containerSizes.w - 1 * chartMX]);
  }, [containerSizes.w, JSON.stringify(dataTimeExtent)]);

  // define y scale
  const scaleY = useMemo(() => {
    return scaleLinear()
      .domain([0, maxInTimeIntervals])
      .range([timeLineH, chartMT]);
  }, [containerSizes, maxInTimeIntervals]);

  var area = d3
    .area()
    .x(function (d: any) {
      return scaleX(d[0]);
    })
    .y0(function (d: any) {
      return scaleY(d[1]);
    })
    .y1(function (d: any) {
      return scaleY(d[2]);
    });

  const stackedTimelineData = useMemo(() => {
    const stackedData: any = {};
    dataCategories.forEach((cat) => {
      stackedData[cat] = [];
    });

    timeIntervals.forEach((timeInterval: Date, ti) => {
      const dataTimeInterval = dataLiv.filter(
        (d) => d.date.valueOf() === timeInterval.valueOf()
      );

      let timePointSum = 0;
      dataCategories.forEach((cat) => {
        const dataCatInInterval = dataTimeInterval.filter((d) => d.cat === cat);

        stackedData[cat].push([
          timeInterval,
          timePointSum,
          timePointSum + dataCatInInterval.length,
        ]);

        timePointSum += dataCatInInterval.length;
      });
    });

    return stackedData;
  }, [dataLiv, scaleX, timeIntervals.length]);

  //const [timelineEl, setTimelineEl] = useState<any>(false);
  useEffect(() => {
    const svgEl = select(refTimeline.current);
    if (svgEl && dataReady && canvasReady) {
      svgEl.selectAll(`.timeline-wrapper`).remove();
      //timelineEl.remove();
      const el = svgEl.append("g").attr("class", "timeline-wrapper");

      Object.entries(stackedTimelineData).forEach(([cat, stackedCatData]) => {
        el.append("path")
          .attr("class", `timeline-area timeline-area-${cat}`)
          .style("fill", categoryColors[cat as Category][0])
          .style("stroke-width", 1)
          .style("stroke", categoryColors[cat as Category][1])
          .attr("d", area(stackedCatData as any));
      });
    }
    //setTimelineEl(el);
  }, [stackedTimelineData]);

  // selection line
  useEffect(() => {
    const svgEl = select(refTimeline.current);
    if (svgEl && dataReady && canvasReady) {
      svgEl.selectAll(`.timeline-selection`).remove();
      //timelineEl.remove();
      const el = svgEl.append("g").attr("class", "timeline-selection");

      const lineX = scaleX(timeSelection);

      el.append("line")
        .attr("class", `timeline-selection-line`)
        .attr("x1", lineX)
        .attr("x2", lineX)
        .attr("y1", chartMT - 5)
        .attr("y2", timeLineH)
        .style("stroke", "black")
        .style("stroke-width", 2.5);

      el.append("circle")
        .attr("class", `timeline-selection-line`)
        .attr("cx", lineX)
        .attr("cy", chartMT - 5)
        .attr("r", 5)
        .style("fill", "black")
        .style("stroke-width", 0);
    }
    //setTimelineEl(el);
  }, [
    stackedTimelineData,
    timeSelection.valueOf(),
    containerSizes,
    timeLineH,
    timeIntervals.length,
  ]);

  const selectedValueLabelX = useMemo<number>(() => {
    const minX = 20;
    const maxX = containerSizes.w - 120;
    const x =
      (containerSizes.w / timeIntervals.length) *
        timeIntervals.indexOf(timeSelection) -
      100;

    if (x < minX) {
      return minX;
    }
    if (x > maxX) {
      return maxX;
    }
    return x;
  }, [containerSizes.w, timeIntervals.length, timeSelection.valueOf()]);

  return (
    <div
      className="container"
      id="container-timeline"
      style={{
        position: "absolute",
        top: containerSizes.y,
        left: containerSizes.x,
        width: containerSizes.w,
        height: containerSizes.h,
      }}
    >
      {canvasReady && (
        <svg
          ref={refTimeline}
          style={{ bottom: timeLineH, right: 0 }}
          id="timeline"
          width={containerSizes.w}
          height={timeLineH}
        />
      )}
      <div id="timeslider" style={{}}>
        <input
          id="timeslider-input"
          style={{
            left: chartMX - 10,
            right: chartMX - 10,
            width: containerSizes.w - chartMX - 5,
            top: timeLineH - 5,
          }}
          type="range"
          min={0}
          max={timeIntervals.length - 1}
          value={timeIntervals.indexOf(timeSelection)}
          onChange={(e) =>
            setTimeSelection(timeIntervals[parseInt(e.target.value)])
          }
        ></input>
        <div id="timeslider-minmax-labels">
          <div
            className="timeslider-label-min timeslider-label"
            style={{ top: timeLineH + 5 }}
          >
            {dataTimeExtent[0].toLocaleString("en-GB", { timeZone: "CET" })}
          </div>
          <div
            className="timeslider-label-max timeslider-label"
            style={{ top: timeLineH + 5 }}
          >
            {dataTimeExtent[1].toLocaleString("en-GB", { timeZone: "CET" })}
          </div>
        </div>
        <div
          id="timeslider-selected-label"
          style={{
            top: 0,
            left: selectedValueLabelX,
          }}
        >
          <div className="timeslider-label-min timeline-label">
            {timeSelection.toLocaleString("en-GB", { timeZone: "CET" })}
          </div>
        </div>
      </div>
    </div>
  );
};
