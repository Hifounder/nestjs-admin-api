import { PickType } from '@nestjs/mapped-types';
import { AdminLocalAuth } from 'src/modules/admin/entities/admin-local-auth.entity';

export class LoginReqDto extends PickType(AdminLocalAuth, [
  'account',
  'password',
] as const) {}

export class LoginRespDto {
  expiration: number;
  accessToken: string;
}
