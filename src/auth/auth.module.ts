import { Global, Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import jwtConfig from "./config/jwt.config";
import { AuthService } from "./providers/auth.service";
import { BcryptProvider } from "./providers/bcrypt.provider";
import { GenerateTokensProvider } from "./providers/generate-tokens.provider";
import { HashingProvider } from "./providers/hashing.provider";
import { RefreshTokensProvider } from "./providers/refresh-tokens.provider";
import { SignInProvider } from "./providers/sign-in.provider";

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
