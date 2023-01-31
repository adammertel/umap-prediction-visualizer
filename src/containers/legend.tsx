import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  SCategorySelection,
  SDataCategories,
  SSizes,
  SSizesLegend,
} from "../state";
import { Categories } from "./categories";
import { Category, categoryColors } from "../variables";

import { AiFillCheckSquare, AiFillCloseSquare } from "react-icons/ai";

interface ILegendProps {}

export const Legend: React.FunctionComponent<ILegendProps> = ({}) => {
  const containerSizes = useRecoilValue(SSizesLegend);
  const dataCategories = useRecoilValue(SDataCategories);

  const [dataCategoriesSel, setDataCategoriesSel] =
    useRecoilState(SCategorySelection);

  console.log(dataCategoriesSel);
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
      <div id="legend-list">
        <div id="legend-list-heading">Categories:</div>
        {dataCategories.map((category, ci) => {
          const sel = dataCategoriesSel.includes(category);
          return (
            <div
              className="legend-list-item"
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
              <div className="legend-list-item-icon">
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
