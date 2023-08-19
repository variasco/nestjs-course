import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { DeleteSuccess } from "../types/delete.success.response";
import { CreateReviewDto } from "./dto/create.review.dto";
import { REVIEW_DELETE_SUCCESS, REVIEW_NOT_FOUND } from "./review.constants";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id", IdValidationPipe) id: string,
  ): Promise<DeleteSuccess> {
    const deletedDoc = await this.reviewService.delete(id);

    if (!deletedDoc)
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);

    return {
      status: "OK",
      statusCode: HttpStatus.OK,
      message: REVIEW_DELETE_SUCCESS(id),
    };
  }

  @Get("byProduct/:productId")
  async getByProduct(@Param("productId", IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }
}
