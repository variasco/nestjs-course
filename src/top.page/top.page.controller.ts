import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { FindTopPageDto } from "./dto/find.top.page.dto";
import { TopPageModel } from "./top.page.model";

@Controller("top-page")
export class TopPageController {
  // constructor(private readonly configService: ConfigService) {}

  @Post("create")
  async create(@Body() dto: Omit<TopPageModel, "_id">) {
    // const test = this.configService.get("TEST");
  }

  @Get(":id")
  async get(@Param("id", IdValidationPipe) id: string) {}

  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {}

  @Patch(":id")
  async update(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: TopPageModel,
  ) {}

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {}
}
