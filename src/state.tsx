import { atom, selector } from "recoil";

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

const SIZE_SETTINGS = {
  APP_P: 10,
  HEADER_H: 50,
  TIMELINE_H: 100,
  MENU_H: 100,
  CATEG_H: 300,
  SCATTER_W: 500,
};

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

interface ISizesContainer {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SSizesHeader = selector<ISizesContainer>({
  key: "sizesHeader",
  get: ({ get }) => {
    const sizes = get(SSizes);

    return {
      w: sizes.w - 2 * SIZE_SETTINGS.APP_P,
      h: SIZE_SETTINGS.HEADER_H,
      x: SIZE_SETTINGS.APP_P,
      y: SIZE_SETTINGS.APP_P,
    };
  },
});

export const SSizesMenu = selector<ISizesContainer>({
  key: "sizesMenu",
  get: ({ get }) => {
    const sizes = get(SSizes);

    return {
      w: sizes.w - 2 * SIZE_SETTINGS.APP_P,
      h: SIZE_SETTINGS.MENU_H,
      x: SIZE_SETTINGS.APP_P,
      y: SIZE_SETTINGS.HEADER_H + SIZE_SETTINGS.APP_P,
    };
  },
});
export const SSizesTimeline = selector<ISizesContainer>({
  key: "sizesTimeline",
  get: ({ get }) => {
    const sizes = get(SSizes);

    return {
      w: sizes.w - 2 * SIZE_SETTINGS.APP_P,
      h: SIZE_SETTINGS.TIMELINE_H,
      x: SIZE_SETTINGS.APP_P,
      y: SIZE_SETTINGS.MENU_H + SIZE_SETTINGS.HEADER_H + SIZE_SETTINGS.APP_P,
    };
  },
});
export const SSizesScatter = selector<ISizesContainer>({
  key: "sizesScatter",
  get: ({ get }) => {
    const sizes = get(SSizes);

    const h =
      sizes.h -
      (2 * SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H +
        SIZE_SETTINGS.CATEG_H);

    return {
      w: h,
      h: h,
      x: SIZE_SETTINGS.APP_P,
      y:
        2 * SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H,
    };
  },
});
export const SSizesStats = selector<ISizesContainer>({
  key: "sizesStats",
  get: ({ get }) => {
    const sizes = get(SSizes);

    const hScatter =
      sizes.h -
      (2 * SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H +
        SIZE_SETTINGS.CATEG_H);

    return {
      w: sizes.w - 2 * SIZE_SETTINGS.APP_P - hScatter,
      h: hScatter,
      x: SIZE_SETTINGS.APP_P + hScatter,
      y:
        2 * SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H,
    };
  },
});
export const SSizesCategories = selector<ISizesContainer>({
  key: "sizesCategories",
  get: ({ get }) => {
    const sizes = get(SSizes);

    return {
      w: sizes.w - 2 * SIZE_SETTINGS.APP_P,
      h: SIZE_SETTINGS.CATEG_H,
      x: SIZE_SETTINGS.APP_P,
      y: sizes.h - SIZE_SETTINGS.APP_P - SIZE_SETTINGS.CATEG_H,
    };
  },
});
