import Point from "../models/Point";
import imagesView from "./images_view";

export default {
  render(point: Point) {

    return {
      id: point.id,
      name: point.name,
      about: point.about,
      latitude: point.latitude,
      longitude: point.longitude,
      images: imagesView.renderMany(point.images),
    };
  },

  renderMany(points: Point[]) {
    return points.map(point => this.render(point));
  }
}