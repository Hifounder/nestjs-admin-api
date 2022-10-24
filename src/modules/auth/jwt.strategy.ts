import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../admin/admin.service';
import { findByLocalValidateRespDto } from '../admin/dto/admin.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.OFFICIAL_JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<findByLocalValidateRespDto> {
    const admin: findByLocalValidateRespDto =
      await this.adminService.findByLocalValidate(payload);
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}
