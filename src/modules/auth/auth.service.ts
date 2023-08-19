import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { compare, genSalt, hash } from "bcryptjs";
import { InjectModel } from "nestjs-typegoose";
import { USER_NOT_EXIST_ERROR } from "./auth.constants";
import { AuthDto } from "../auth/dto/auth.dto";
import { UserModel } from "./user.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    //@ts-ignore
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const user = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    return user.save();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, "email">> {
    const user = await this.findUserByEmail(email);

    if (!user) throw new UnauthorizedException(USER_NOT_EXIST_ERROR);
    if (!(await compare(password, user.passwordHash)))
      throw new UnauthorizedException(USER_NOT_EXIST_ERROR);

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
