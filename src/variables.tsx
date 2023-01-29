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
  dress: ["#ff9896", "#d62728"],
  pullover: ["#c5b0d5", "#9467bd"],
  sandal: ["#c49c94", "#8c564b"],
  shirt: ["#f7b6d2", "#e377c2"],
  sneaker: ["#c7c7c7", "#7f7f7f"],
  "t-shirt": ["#dbdb8d", "#bcbd22"],
  trouser: ["#9edae5", "#17becf"],
};
