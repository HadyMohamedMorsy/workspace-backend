import { Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
import jwtConfig from "../config/jwt.config";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // Injecting UserService
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // Verify the refresh token using jwtService
    try {
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, "sub">>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      // Fetch the user from the database
      const user = await this.usersService.findOne(sub);

      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
