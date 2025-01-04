import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { Auth } from "./decorators/auth.decorator";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { SignInDto } from "./dtos/signin.dto";
import { AuthType } from "./enums/auth-type.enum";
import { AuthService } from "./providers/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
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
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
