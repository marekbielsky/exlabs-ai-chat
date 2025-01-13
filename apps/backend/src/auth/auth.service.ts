import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

export interface JwtTokenPayload {
  sub: string;
  name: string;
}

export interface SignInResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(name: string): Promise<SignInResponse> {
    const user = await this.usersService.findOneByName(name);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: JwtTokenPayload = { sub: user.id, name: user.businessName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
