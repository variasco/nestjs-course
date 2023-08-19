import { Injectable } from "@nestjs/common";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { InjectModel } from "nestjs-typegoose";
import { ReviewModel } from "../review/review.model";
import { CreateProductDto } from "./dto/create.product.dto";
import { FindProductDto } from "./dto/find.product.dto";
import { ProductModel } from "./product.model";

@Injectable()
export class ProductService {
  constructor(
    //@ts-ignore
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductModel> {
    return this.productModel.create(dto);
  }

  async findById(id: string): Promise<ProductModel | null> {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<ProductModel | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateProductDto,
  ): Promise<ProductModel | null> {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto): Promise<
    | (ProductModel & {
        reviews: ReviewModel[];
        reviewsCount: number;
        reviewsAvg: number;
      })[]
    | null
  > {
    return this.productModel
      .aggregate([
        { $match: { categories: dto.category } },
        { $sort: { _id: 1 } },
        { $limit: dto.limit },
        {
          $lookup: {
            from: "Review",
            localField: "_id",
            foreignField: "productId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviewsCount: { $size: "$reviews" },
            reviewsAvg: { $avg: "$reviews.rating" },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
                  return reviews;
                }`,
                args: ["$reviews"],
                lang: "js",
              },
            },
          },
        },
      ])
      .exec();
  }
}