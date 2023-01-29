import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SDataCategories,
  SDataLiv,
  SDataTimeExtent,
  SSizesTimeline,
} from "../state";
import * as d3 from "d3";
import { scaleLinear } from "d3";
import { Categories } from "./categories";
import { Category, categoryColors } from "../variables";

interface ITimelineProps {}

export const Timeline: React.FunctionComponent<ITimelineProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesTimeline);
  const dataTimeExtent = useRecoilValue(SDataTimeExtent);
  const dataCategories = useRecoilValue(SDataCategories);

  const dataLiv = useRecoilValue(SDataLiv);
  const chartM = 10;

  const refTimeline = useRef<SVGSVGElement | null>(null);
  const svgEl = useMemo(() => {
    const svg = d3.select(refTimeline.current);
    if (svg) {
      svg.selectAll("*").remove();
    }
    return svg;
  }, [refTimeline]);

  // define temporal scale
  const scaleX = useMemo(() => {
    return scaleLinear()
      .domain([dataTimeExtent[0], dataTimeExtent[1]])
      .range([chartM, containerSizes.w - 1 * chartM]);
  }, [containerSizes]);

  // define y scale
  const scaleY = useMemo(() => {
    return scaleLinear()
      .domain([0, 500])
      .range([containerSizes.h - 1 * chartM, chartM]);
  }, [containerSizes]);

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

  const timeIntervals = useMemo(() => {
    const startDate = dataTimeExtent[0];
    const endDate = dataTimeExtent[1];
    const interval = 60 * 60 * 1000;
    const intervals = [];

    for (
      let current = startDate;
      current <= endDate;
      current = new Date(current.getTime() + interval)
    ) {
      intervals.push(current);
    }
    return intervals;
  }, [dataLiv, dataTimeExtent]);

  const stackedTimelineData = useMemo(() => {
    const stackedData: any = {};
    dataCategories.forEach((cat) => {
      stackedData[cat] = [];
    });

    timeIntervals.forEach((timeIntervalTo: Date, ti) => {
      if (ti !== 0) {
        const timeIntervalFrom = timeIntervals[ti - 1];

        const dataTimeInterval = dataLiv.filter(
          (d) => d.date > timeIntervalFrom && d.date < timeIntervalTo
        );

        let timePointSum = 0;
        dataCategories.forEach((cat) => {
          const dataCatInInterval = dataTimeInterval.filter(
            (d) => d.cat === cat
          );

          stackedData[cat].push([
            timeIntervalTo,
            timePointSum,
            timePointSum + dataCatInInterval.length,
          ]);

          timePointSum += dataCatInInterval.length;
        });
      }
    });
    return stackedData;
  }, [dataLiv, scaleX]);

  useEffect(() => {
    svgEl.selectAll(".timeline-area").remove();

    Object.entries(stackedTimelineData).forEach(([cat, stackedCatData]) => {
      svgEl
        .append("path")
        .attr("class", `timeline-area timeline-area-${cat}`)
        .style("fill", function (d) {
          return categoryColors[cat as Category][0];
        })
        .attr("d", area(stackedCatData as any));
    });
  }, [stackedTimelineData]);

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
      <svg
        ref={refTimeline}
        style={{ bottom: 0, right: 0 }}
        id="timeline"
        width={containerSizes.w}
        height={containerSizes.h}
      />
    </div>
  );
};
