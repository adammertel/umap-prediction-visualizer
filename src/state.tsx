import * as d3 from "d3";
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from "recoil";

/**
 * Data
 */

interface IDataPointRef {}
interface IDataPointLiv {}

export const SDataRef = atom<IDataPointRef[]>({
  key: "dataRef",
  default: [],
});

export const SDataLiv = atom<IDataPointLiv[]>({
  key: "dataLiv",
  default: [],
});

/**
 * Handling sizes
 */

const SIZE_SETTINGS = {};

export const SAppW = atom<number>({
  key: "appW",
  default: 0,
});

export const SAppH = atom<number>({
  key: "appH",
  default: 0,
});

interface ISizes {
  w: number;
  h: number;
}
export const SSizes = selector<ISizes>({
  key: "sizes",
  get: ({ get }) => {
    const w = get(SAppW);
    const h = get(SAppH);

    return {
      w,
      h,
    };
  },
});
