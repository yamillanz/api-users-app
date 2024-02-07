import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailUserName(username);
    console.log('🚀 ~ AuthService ~ validateUser ~ user:', user);
    const isMatch = user && (await bcrypt.compare(pass, user.password));
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userFound = await this.usersService.findByEmailUserName(
      user.username,
    );
    const payload = {
      email: userFound.email,
      user_id: userFound.user_id,
      id: userFound.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
