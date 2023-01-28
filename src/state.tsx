import { atom, selector } from "recoil";

export const STestMessage = atom({
  key: "testMessage",
  default: "",
});

export const SAppW = atom({
  key: "appW",
  default: 0,
});

export const SAppH = atom({
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
    const w = get(SAppH);
    const h = get(SAppW);

    return {
      w,
      h,
    };
  },
});
