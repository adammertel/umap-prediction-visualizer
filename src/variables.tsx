export enum Category {
  ANKLE_BOOT = "ankle boot",
  BAG = "bag",
  COAT = "coat",
  DRESS = "dress",
  PULLOVER = "pullover",
  SANDAL = "sandal",
  SHIRT = "shirt",
  SNEAKER = "sneaker",
  TSHIRT = "t-shirt",
  TROUSER = "trouser",
}

export const categoryColors: { [key in Category]: [string, string] } = {
  "ankle boot": ["#aec7e8", "#1f77b4"],
  bag: ["#ffbb78", "#ff7f0e"],
  coat: ["#98df8a", "#2ca02c"],
  dress: ["#d98fbb", "#B41F77"],
  pullover: ["#c5b0d5", "#9467bd"],
  sandal: ["#c49c94", "#8c564b"],
  shirt: ["#f7b6d2", "#e377c2"],
  sneaker: ["#9d942b", "#5f5a1a"],
  "t-shirt": ["#dbdb8d", "#bcbd22"],
  trouser: ["#9edae5", "#17becf"],
};

export const colors = {
  selection: "#eb5e28",
  unselected: "#ccc5b9",
  background: "#252422",
  secondary1: "#ccc5b9",
  white: "#fffcf2",
};
