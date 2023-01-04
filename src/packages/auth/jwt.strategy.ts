import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthType } from 'src/modules/admin/entities/admin-auth-relation.entity';
import { AdminStatus } from 'src/modules/admin/entities/admin.entity';
import { AdminService } from '../../modules/admin/admin.service';
import { FindByLocalValidateRespDto } from '../../modules/admin/dto/admin.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.OFFICIAL_JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<FindByLocalValidateRespDto> {
    if (payload.account === 'admin') {
      if (payload.password !== process.env.SUPERADMIN_PW)
        throw new UnauthorizedException();
      return {
        id: null,
        status: AdminStatus.ENABLE,
        name: 'SUPER_ADMIN',
        authType: AuthType.local,
      };
    }

    const admin: FindByLocalValidateRespDto =
      await this.adminService.findByLocalValidate(payload);
    if (!admin || admin.status !== AdminStatus.ENABLE)
      throw new UnauthorizedException();
    return admin;
  }
}
