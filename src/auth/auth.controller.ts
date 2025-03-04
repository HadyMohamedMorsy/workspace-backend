import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Auth } from "src/shared/decorators/auth.decorator";
import { AuthType } from "src/shared/enum/global-enum";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { SignInDto } from "./dtos/signin.dto";
import { AuthService } from "./providers/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post("refresh-tokens")
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post("logout")
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedException("Invalid Token");
    await this.cacheManager.reset();

    return {
      data: true,
    };
  }
}
