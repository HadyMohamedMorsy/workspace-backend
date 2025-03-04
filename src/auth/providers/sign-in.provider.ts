import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
  forwardRef,
} from "@nestjs/common";
import { UserStatus } from "src/shared/enum/global-enum";
import { UserService } from "src/users/user.service";
import { SignInDto } from "../dtos/signin.dto";
import { GenerateTokensProvider } from "./generate-tokens.provider";
import { HashingProvider } from "./hashing.provider";
import { RefreshTokensProvider } from "./refresh-tokens.provider";

@Injectable()
export class SignInProvider {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**
     * Inject the hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    let isEqual = false;

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid credentials");
    }

    try {
      isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: "Could not compare the password",
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException("Password does not match");
    }

    // Generate access token
    return await this.generateTokensProvider.generateTokens(user);
  }

  public async refreshToken(refreshToken: { refreshToken: string }) {
    try {
      const newTokens = await this.refreshTokensProvider.refreshTokens(refreshToken);
      return newTokens;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
