import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthDto } from "../auth/dto/auth.dto";
import { AuthService } from "./auth.service";
import { USER_EXIST_ERROR } from "./auth.constants";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUserByEmail(dto.login);
    if (oldUser) throw new BadRequestException(USER_EXIST_ERROR);

    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.login, dto.password);

    return await this.authService.login(user.email);
  }
}
