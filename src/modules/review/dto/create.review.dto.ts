import { IsNumber, IsString, Max, Min } from "class-validator";
import {
  RATING_MAX_VALUE_ERROR,
  RATING_MIN_VALUE_ERROR,
} from "../review.constants";

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: RATING_MAX_VALUE_ERROR })
  @Min(1, { message: RATING_MIN_VALUE_ERROR })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
