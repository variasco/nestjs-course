import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { ReviewModel } from "../review/review.model";
import { DeleteSuccess } from "../types/delete.success.response";
import { CreateProductDto } from "./dto/create.product.dto";
import { FindProductDto } from "./dto/find.product.dto";
import {
  PRODUCTS_BY_CATEGORY_NOT_FOUND,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_NOT_FOUND_ERROR,
} from "./product.constants";
import { ProductModel } from "./product.model";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("create")
  async create(@Body() dto: CreateProductDto): Promise<ProductModel> {
    return this.productService.create(dto);
  }

  @Get(":id")
  async get(@Param("id", IdValidationPipe) id: string): Promise<ProductModel> {
    const product = await this.productService.findById(id);

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR(id));

    return product;
  }

  @Delete(":id")
  async delete(
    @Param("id", IdValidationPipe) id: string,
  ): Promise<DeleteSuccess> {
    const deletedProduct = await this.productService.deleteById(id);

    if (!deletedProduct)
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR(id));

    return {
      status: "OK",
      statusCode: HttpStatus.OK,
      message: PRODUCT_DELETE_SUCCESS(id),
    };
  }

  @Patch(":id")
  async update(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: CreateProductDto,
  ): Promise<ProductModel> {
    const updatedProduct = await this.productService.updateById(id, dto);

    if (!updatedProduct)
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR(id));

    return updatedProduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("find")
  async findByCategory(@Body() dto: FindProductDto): Promise<
    (ProductModel & {
      reviews: ReviewModel[];
      reviewsCount: number;
      reviewsAvg: number;
    })[]
  > {
    const products = await this.productService.findWithReviews(dto);

    if (!products) throw new NotFoundException(PRODUCTS_BY_CATEGORY_NOT_FOUND);

    return products;
  }
}
