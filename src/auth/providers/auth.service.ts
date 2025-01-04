import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { SignInProvider } from "./sign-in.provider";

import { UserService } from "src/users/user.service";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { SignInDto } from "../dtos/signin.dto";
import { RefreshTokensProvider } from "./refresh-tokens.provider";

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**
     * Inject the signInProvider
     */
    private readonly signInProvider: SignInProvider,

    /**
     * Inject refreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  async getUserPermissions(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException("User Is Not Exist");
    return user.permission;
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
