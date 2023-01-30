import { selection } from "d3";
import { atom, selector } from "recoil";
import { Category } from "./variables";

/**
 * Data
 */

interface IDataPointRef {
  x: number;
  y: number;
  cat: Category;
}
interface IDataPointLiv {
  x: number;
  y: number;
  cat: Category;
  date: Date;
}

export const SDataRef = atom<IDataPointRef[]>({
  key: "dataRef",
  default: [],
});

export const SDataLiv = atom<IDataPointLiv[]>({
  key: "dataLiv",
  default: [],
});

export const SDataLoadedRef = atom<boolean>({
  key: "dataLoadedRef",
  default: false,
});
export const SDataLoadedLiv = atom<boolean>({
  key: "dataLoadedLiv",
  default: false,
});

export const SDataLivSelected = selector<IDataPointLiv[]>({
  key: "dataLivSelected",
  get: ({ get }) => {
    const data = get(SDataLiv);
    const selectedDate = get(STimeSelection);

    return data.filter((d) => d.date.valueOf() === selectedDate.valueOf());
  },
});

export const SDataCategories = selector<Category[]>({
  key: "dataCategories",
  get: ({ get }) => {
    const data = get(SDataRef);
    return Array.from(new Set(data.map((d) => d.cat)));
  },
});

export const SDataRefExtent = selector<[number, number, number, number]>({
  key: "dataRefExtent",
  get: ({ get }) => {
    const data = get(SDataRef);
    if (data.length === 0) {
      return [0, 0, 0, 0];
    }
    return [
      Math.min(...data.map((d) => d.x)),
      Math.max(...data.map((d) => d.x)),
      Math.min(...data.map((d) => d.y)),
      Math.max(...data.map((d) => d.y)),
    ];
  },
});

export const SDataLivExtent = selector<[number, number, number, number]>({
  key: "dataLivExtent",
  get: ({ get }) => {
    const data = get(SDataLiv);
    if (data.length === 0) {
      return [0, 0, 0, 0];
    }
    return [
      Math.min(...data.map((d) => d.x)),
      Math.max(...data.map((d) => d.x)),
      Math.min(...data.map((d) => d.y)),
      Math.max(...data.map((d) => d.y)),
    ];
  },
});

/**
 * Handling time filtering
 */

export const STimeExtent = atom<[Date, Date]>({
  key: "timeExtent",
  default: [new Date(), new Date()],
});

export const STimeSelection = atom<Date>({
  key: "timeSelection",
  default: new Date(),
});

export const SDataTimeExtent = selector<[Date, Date]>({
  key: "dataTimeExtent",
  get: ({ get }) => {
    const data = get(SDataLiv);
    if (data.length) {
      const sortedData = [...data];
      sortedData.sort((a, b) => (a.date > b.date ? 1 : -1));

      return [sortedData[0].date, sortedData[data.length - 1].date];
    } else {
      return [new Date(), new Date()];
    }
  },
});

export const SMaxInTimeIntervals = selector<number>({
  key: "maxIndataTimeIntervals",
  get: ({ get }) => {
    const intervals = get(STimeIntervals);
    const data = get(SDataLiv);
    let maxInInterval = 0;

    intervals.forEach((timeInterval: Date, ti) => {
      const dataTimeInterval = data.filter(
        (d) => d.date.valueOf() === timeInterval.valueOf()
      );
      if (dataTimeInterval.length > maxInInterval) {
        maxInInterval = dataTimeInterval.length;
      }
    });
    return maxInInterval;
  },
});

export const STimeIntervals = selector<Date[]>({
  key: "dataTimeIntervals",
  get: ({ get }) => {
    const startDate = get(SDataTimeExtent)[0];
    const endDate = get(SDataTimeExtent)[1];
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
  },
});

/**
 * Handling sizes
 */

const SIZE_SETTINGS = {
  APP_P: 10,
  HEADER_H: 50,
  TIMELINE_H: 150,
  MENU_H: 0,
  SCATTER_W: 500,
  CONTAINER_M: 5,
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
      y:
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.APP_P +
        1 * SIZE_SETTINGS.CONTAINER_M,
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
      y:
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.APP_P +
        2 * SIZE_SETTINGS.CONTAINER_M,
    };
  },
});
export const SSizesScatter = selector<ISizesContainer>({
  key: "sizesScatter",
  get: ({ get }) => {
    const sizes = get(SSizes);

    const scatterS =
      sizes.h -
      (2 * SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H) -
      3 * SIZE_SETTINGS.CONTAINER_M;

    return {
      w: scatterS,
      h: scatterS,
      x: SIZE_SETTINGS.APP_P,
      y:
        SIZE_SETTINGS.APP_P +
        SIZE_SETTINGS.HEADER_H +
        SIZE_SETTINGS.MENU_H +
        SIZE_SETTINGS.TIMELINE_H +
        3 * SIZE_SETTINGS.CONTAINER_M,
    };
  },
});
export const SSizesCategories = selector<ISizesContainer>({
  key: "sizesCategories",
  get: ({ get }) => {
    const sizes = get(SSizes);

    return {
      w:
        sizes.w -
        get(SSizesScatter).w -
        2 * SIZE_SETTINGS.APP_P -
        1 * SIZE_SETTINGS.CONTAINER_M,
      h: get(SSizesScatter).h,
      x:
        SIZE_SETTINGS.APP_P +
        get(SSizesScatter).w +
        1 * SIZE_SETTINGS.CONTAINER_M,
      y: get(SSizesScatter).y,
    };
  },
});
