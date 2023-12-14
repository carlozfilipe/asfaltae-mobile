import Image from "../models/Image";

export default {
  render(image: Image) {

    return {
      id: image.id,
      //url: `http://172.18.131.65:3333/uploads/${image.path}`,
      url: `http:172.18.47.27:3333/uploads/${image.path}`,
    };
  },

  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  }
}
