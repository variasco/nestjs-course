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
import { IdValidationPipe } from "../../pipes/id.validation.pipe";
import { DeleteSuccess } from "../../types/delete.success.response";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CreateReviewDto } from "../review/dto/create.review.dto";
import { REVIEW_DELETE_SUCCESS, REVIEW_NOT_FOUND } from "./review.constants";
import { ReviewService } from "./review.service";
import { TelegramService } from "../telegram/telegram.service";

@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post("notify")
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `Имя: ${dto.name}\n` +
      `Заголовок: ${dto.title}\n` +
      `Описание: ${dto.description}\n` +
      `Рейтинг: ${dto.rating}\n` +
      `ID Продукта: ${dto.productId}`;
      
    await this.telegramService.sendMessage(message);
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
