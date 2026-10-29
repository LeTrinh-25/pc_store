const productPhotos = [
  "photo-1587202372775-e229f172b9d7",
  "photo-1593305841991-05c297ba4575",
  "photo-1597872200969-2b65d56bd16b",
  "photo-1593640408182-31c70c8268f5",
  "photo-1587202372634-32705e3bf49c",
  "photo-1562976540-1502c2145186",
];

const categoryPhotos: Record<string, string[]> = {
  vga: [productPhotos[0], productPhotos[2]],
  gpu: [productPhotos[0], productPhotos[2]],
  pc: [productPhotos[0], productPhotos[1], productPhotos[3]],
  ram: [productPhotos[5], productPhotos[2]],
  ssd: [productPhotos[2], productPhotos[5]],
  mainboard: [productPhotos[3], productPhotos[0]],
  monitor: [productPhotos[1], productPhotos[4]],
  màn: [productPhotos[1], productPhotos[4]],
  mouse: [productPhotos[4], productPhotos[3]],
  chuột: [productPhotos[4], productPhotos[3]],
  keyboard: [productPhotos[4], productPhotos[3]],
  bàn: [productPhotos[4], productPhotos[3]],
  headset: [productPhotos[1], productPhotos[4]],
  tai: [productPhotos[1], productPhotos[4]],
};

export function productImage(name: string, category = "") {
  const text = `${category} ${name}`.toLocaleLowerCase("vi");
  const matchingKey = Object.keys(categoryPhotos).find((key) => text.includes(key));
  const options = matchingKey ? categoryPhotos[matchingKey] : productPhotos;
  const index = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
  return `https://images.unsplash.com/${options[index]}?auto=format&fit=crop&w=900&q=85`;
}
