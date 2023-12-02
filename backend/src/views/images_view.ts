import Image from "../models/Image";

export default {
  render(image: Image) {

    return {
      id: image.id,
      url: `http://192.168.100.2:3333/uploads/${image.path}`,
      //url: `http:172.18.47.33:3333/uploads/${image.path}`,
    };
  },

  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  }
}