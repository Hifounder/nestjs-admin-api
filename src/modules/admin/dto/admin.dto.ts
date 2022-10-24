import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AdminStatus } from '../entities/admin.entity';

// Req
// 查詢後台人員 傳入
export class findByLocalReqDto {
  @IsString()
  account: string;

  @IsString()
  password: string;
}
// 驗證一方人員 傳入
export class findByLocalValidateReqDto {
  @IsString()
  account: string;

  @IsString()
  name: string;

  @IsEnum(AdminStatus)
  status: AdminStatus;
}
// 建立後台人員 傳入
export class createAdminReqDto {
  @IsString()
  account: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
// 修改後台人員 傳入
export class editAdminReqDto {
  @IsString()
  name: string;

  @IsEnum(AdminStatus)
  @IsOptional()
  status?: AdminStatus;
}

// Resp
// 查詢後台人員 回傳
export class findByLocalRespDto {
  account?: string;
  name?: string;
  status?: AdminStatus;
}
// 驗證一方人員 回傳
export class findByLocalValidateRespDto {
  id: number;
  status: AdminStatus;
  name: string;
  authType: 'local' | 'third';
}
// 建立後台人員 回傳
export class createAdminRespDto {
  id: number;
  status: AdminStatus;
  name: string;
  authType: 'local' | 'third';
}
// 修改後台人員 回傳
export class editAdminRespDto {
  id: number;
  status: AdminStatus;
  name: string;
}
