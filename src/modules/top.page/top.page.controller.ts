import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { IdValidationPipe } from "../../pipes/id.validation.pipe";
import { DeleteSuccess } from "../../types/delete.success.response";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CreateTopPageDto } from "./dto/create.top.page.dto";
import { FindTopPageDto } from "./dto/find.top.page.dto";
import {
  PAGE_ALREADY_EXIST,
  PAGE_DELETE_SUCCESS,
  PAGE_NOT_FOUND,
  PAGE_NOT_FOUND_BY_ALIAS,
  PAGE_NOT_FOUND_BY_CATEGORY,
  PAGE_NOT_FOUND_ERROR,
} from "./top.page.constants";
import { TopPageModel } from "./top.page.model";
import { TopPageService } from "./top.page.service";

@Controller("top-page")
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post("create")
  async create(@Body() dto: CreateTopPageDto): Promise<TopPageModel> {
    const page = await this.topPageService.findByAlias(dto.alias);

    if (page) throw new ConflictException(PAGE_ALREADY_EXIST(dto.alias));

    return await this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async get(@Param("id", IdValidationPipe) id: string): Promise<TopPageModel> {
    const page = await this.topPageService.findById(id);

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR(id));

    return page;
  }

  @Get("byAlias/:alias")
  async getByAlias(@Param("alias") alias: string): Promise<TopPageModel> {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_BY_ALIAS(alias));

    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id", IdValidationPipe) id: string,
  ): Promise<DeleteSuccess> {
    const page = await this.topPageService.deleteById(id);

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR(id));

    return {
      status: "OK",
      statusCode: HttpStatus.OK,
      message: PAGE_DELETE_SUCCESS(id),
    };
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(":id")
  async update(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ): Promise<TopPageModel> {
    const page = await this.topPageService.updateById(id, dto);

    if (!page) throw new NotFoundException(PAGE_NOT_FOUND_ERROR(id));

    return page;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("find")
  async findByFirstCategory(
    @Body() dto: FindTopPageDto,
  ): Promise<
    Pick<TopPageModel, "_id" | "alias" | "secondCategory" | "title">[]
  > {
    const pages = await this.topPageService.findByCategory(dto);

    if (!pages) throw new NotFoundException(PAGE_NOT_FOUND_BY_CATEGORY);

    return pages;
  }

  @Get("textSearch/:query")
  async textSearch(@Param("query") query: string): Promise<TopPageModel[]> {
    const pages = await this.topPageService.findByTextSearch(query);

    if (!pages) throw new NotFoundException(PAGE_NOT_FOUND);

    return pages;
  }
}
