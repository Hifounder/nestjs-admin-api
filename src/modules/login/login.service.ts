import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { FindByLocalRespDto } from '../admin/dto/admin.dto';
import { LoginReqDto, LoginRespDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}
  // 建立 Token
  async createToken(admin: LoginReqDto): Promise<LoginRespDto> {
    const user: FindByLocalRespDto = await this.adminService.findByLocal(admin);
    if (!user) throw new ForbiddenException();
    const option: JwtSignOptions = {
      expiresIn: 60 * 60,
      privateKey: process.env.OFFICIAL_JWT_SECRET,
    };
    return {
      expiration: +option.expiresIn,
      accessToken: this.jwtService.sign(user, option),
    };
  }
}
