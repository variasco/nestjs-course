import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypegooseModule } from "nestjs-typegoose";
import { getMongoConfig } from "./configs/mongo.config";
import { AuthModule } from "./modules/auth/auth.module";
import { FilesModule } from "./modules/files/files.module";
import { ProductModule } from "./modules/product/product.module";
import { ReviewModule } from "./modules/review/review.module";
import { TelegramModule } from "./modules/telegram/telegram.module";
import { TopPageModule } from "./modules/top.page/top.page.module";
import { getTelegramConfig } from "./configs/telegram.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    TopPageModule,
    ReviewModule,
    ProductModule,
    FilesModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
  ],
})
export class AppModule {}
