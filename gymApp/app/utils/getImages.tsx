import { imageMap } from "../../assets/images/imageMap";

const getLocalImage = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, "").trim();
    return imageMap[key] || imageMap["default"];
  };

export default getLocalImage;
