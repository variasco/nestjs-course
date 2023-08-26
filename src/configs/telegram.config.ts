import { ConfigService } from "@nestjs/config";
import { TelegramOptions } from "../modules/telegram/telegram.interface";

export function getTelegramConfig(
  configService: ConfigService,
): TelegramOptions {
  const token = configService.get("TELEGRAM_BOT_TOKEN");

  if (!token) throw new Error("TELEGRAM_BOT_TOKEN не задан");

  return { token, chatId: configService.get("TELEGRAM_CHATID") ?? "" };
}
