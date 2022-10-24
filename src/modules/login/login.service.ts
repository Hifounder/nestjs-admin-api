import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { findByLocalRespDto } from '../admin/dto/admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}
  // 建立 Token
  async createToken(admin: LoginDto): Promise<RespBody> {
    const user: findByLocalRespDto = await this.adminService.findByLocal(admin);
    if (!user) {
      throw new ForbiddenException();
    }
    const option: JwtSignOptions = {
      expiresIn: 60 * 60,
      privateKey: process.env.OFFICIAL_JWT_SECRET,
    };
    const accessToken = this.jwtService.sign(user, option);
    return {
      code: 200,
      data: {
        expiration: option.expiresIn,
        accessToken: accessToken,
      },
      message: '登入成功',
    };
  }
}
