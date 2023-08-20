import { Injectable } from "@nestjs/common";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateTopPageDto } from "./dto/create.top.page.dto";
import { FindTopPageDto } from "./dto/find.top.page.dto";
import { TopPageModel } from "./top.page.model";
import { InjectModel } from "nestjs-typegoose";

@Injectable()
export class TopPageService {
  constructor(
    //@ts-ignore
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<TopPageModel | null> {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string): Promise<TopPageModel | null> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async deleteById(id: string): Promise<TopPageModel | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<TopPageModel | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByCategory(
    dto: FindTopPageDto,
  ): Promise<
    Pick<TopPageModel, "_id" | "alias" | "secondCategory" | "title">[] | null
  > {
    return this.topPageModel
      .find(
        { firstCategory: dto.firstCategory },
        { alias: 1, secondCategory: 1, title: 1 },
      )
      .exec();
  }
}
