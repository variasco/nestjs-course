import { ConfigService } from "@nestjs/config";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export async function getMongoConfig(
  configService: ConfigService,
): Promise<TypegooseModuleOptions> {
  return {
    uri: getMongoUri(configService),
    ...getMongoOptions(),
  };
}

function getMongoUri(configService: ConfigService) {
  return (
    "mongodb://" +
    configService.get("MONGO_USER") +
    ":" +
    configService.get("MONGO_PASSWORD") +
    "@" +
    configService.get("MONGO_HOST") +
    ":" +
    configService.get("MONGO_PORT") +
    "/" +
    configService.get("MONGO_AUH_DB")
  );
}

function getMongoOptions() {
  return {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  };
}
