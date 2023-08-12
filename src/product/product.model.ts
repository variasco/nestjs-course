export class ProductModel {
  _id: number;
  image: string;
  title: string;
  price: number;
  oldPrice: number;
  credit: number;
  calculatedRating: number;
  description: string;
  advantages: string;
  disadvantages: string;
  categories: string[];
  tags: string;
  characteristics: Record<string, string>;
}
