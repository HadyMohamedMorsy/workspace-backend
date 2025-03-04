import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { SignInProvider } from "./sign-in.provider";

import { UserService } from "src/users/user.service";
import { SignInDto } from "../dtos/signin.dto";

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
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(refreshToken: { refreshToken: string }) {
    return await this.signInProvider.refreshToken(refreshToken);
  }

  async getUserPermissions(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException("User Is Not Exist");
    return user.permission;
  }
}
