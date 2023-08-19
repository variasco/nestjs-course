import { HttpStatus } from "@nestjs/common";

export type DeleteSuccess = {
  status: string;
  statusCode: HttpStatus.OK;
  message: string;
};
