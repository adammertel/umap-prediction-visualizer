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

import { getTrackBackground, Range } from "react-range";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { ITrackBackground } from "react-range/lib/types";

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
  const chartMT = 35;

  const timeLineH = useMemo<number>(
    () => containerSizes.h - sliderH,
    [containerSizes.h]
  );

  const refTimelineSlider = useRef<HTMLInputElement | null>(null);
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

      const lineX0 = scaleX(timeSelection[0]);
      const lineX1 = scaleX(timeSelection[1]);

      el.append("line")
        .attr("class", `timeline-selection-line`)
        .attr("x1", lineX0)
        .attr("x2", lineX0)
        .attr("y1", chartMT - 5)
        .attr("y2", timeLineH)
        .style("stroke", "black")
        .style("stroke-width", 2.5);

      el.append("circle")
        .attr("class", `timeline-selection-line`)
        .attr("cx", lineX0)
        .attr("cy", chartMT - 5)
        .attr("r", 5)
        .style("fill", "black")
        .style("stroke-width", 0);

      el.append("line")
        .attr("class", `timeline-selection-line`)
        .attr("x1", lineX1)
        .attr("x2", lineX1)
        .attr("y1", chartMT - 5)
        .attr("y2", timeLineH)
        .style("stroke", "black")
        .style("stroke-width", 2.5);

      el.append("circle")
        .attr("class", `timeline-selection-line`)
        .attr("cx", lineX1)
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

  // time slider

  const sliderSelectionPosition = useMemo(() => {
    const positions = [0, 10];

    const sel0Val = timeSelection[0].valueOf();
    const sel1Val = timeSelection[1].valueOf();
    timeIntervals.forEach((ti, i: number) => {
      if (ti.valueOf() === sel0Val) {
        positions[0] = i;
      }
      if (ti.valueOf() === sel1Val) {
        positions[1] = i;
      }
    });
    return positions;
  }, [timeSelection, timeIntervals]);

  const selectedValuesLabelXY = useMemo<
    [[number, number], [number, number]]
  >(() => {
    const minX = 20;
    const maxX = containerSizes.w - 120;
    return sliderSelectionPosition.map((pi, i) => {
      const x =
        (containerSizes.w / timeIntervals.length) * pi - (i == 0 ? 100 : 0);
      if (x < minX) {
        return [minX, i == 0 ? 0 : 10];
      }
      if (x > maxX) {
        return [maxX, i == 1 ? 0 : 10];
      }
      return [x, 10];
    }) as [[number, number], [number, number]];
  }, [containerSizes.w, timeIntervals.length, sliderSelectionPosition]);

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
      <Range
        values={sliderSelectionPosition}
        draggableTrack
        step={1}
        min={0}
        max={timeIntervals.length - 1}
        onChange={(values) => {
          //setTimeSelection(timeIntervals[parseInt(e.target.value)])
          console.log(values);
          setTimeSelection(
            values.map((val) => timeIntervals[val]) as [Date, Date]
          );
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              left: chartMX,
              right: chartMX,
              width: containerSizes.w - 2 * chartMX,
              top: timeLineH,
              position: "absolute",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "5px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values: sliderSelectionPosition,
                  colors: ["#ccc", "#548BF4", "#ccc"],
                  min: 0,
                  max: timeIntervals.length - 1,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
            }}
          >
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "blue" : "white",
              }}
            />
          </div>
        )}
      />
      <div
        id="timeslider-input"
        ref={refTimelineSlider}
        style={{
          left: chartMX - 10,
          right: chartMX - 10,
          width: containerSizes.w - chartMX - 5,
          top: timeLineH - 5,
        }}
      ></div>
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
      <div id="timeslider-selected-labels" style={{ top: 0 }}>
        <div
          className="timeslider-selected-label-min timeslider-selected-label"
          style={{
            left: selectedValuesLabelXY[0][0],
            top: selectedValuesLabelXY[0][1],
          }}
        >
          {timeSelection[0].toLocaleString("en-GB", { timeZone: "CET" })}
        </div>
        <div
          className="timeslider-selected-label-max timeslider-selected-label"
          style={{
            left: selectedValuesLabelXY[1][0],
            top: selectedValuesLabelXY[1][1],
          }}
        >
          {timeSelection[1].toLocaleString("en-GB", { timeZone: "CET" })}
        </div>
      </div>
    </div>
  );
};
