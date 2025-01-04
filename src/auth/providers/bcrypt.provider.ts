import * as bcrypt from "bcrypt";

import { Injectable } from "@nestjs/common";
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    // Generate the salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  public async comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
