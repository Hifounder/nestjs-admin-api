import { Admin } from '../entities/admin.entity';
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PageReqDto, PageRespDto } from 'src/packages/utils/pages';
import { AdminProfile } from '../entities/admin-profile.entity';
import { AdminLocalAuth } from '../entities/admin-local-auth.entity';
import { AdminAuthRelation } from '../entities/admin-auth-relation.entity';
import { Role } from 'src/packages/utils/role';
import { IsNotEmpty } from 'class-validator';

// Req
// 後台人員列表 傳入
export class GetAdminListReqDto extends PartialType(
  IntersectionType(
    IntersectionType(PageReqDto),
    PickType(Admin, ['status'] as const),
    PickType(AdminProfile, ['name'] as const),
  ),
) {}
// 查詢後台人員 傳入
export class FindByLocalReqDto extends PartialType(
  PickType(AdminLocalAuth, ['account', 'password'] as const),
) {}
// 驗證一方人員 傳入
export class FindByLocalValidateReqDto extends PartialType(
  IntersectionType(
    PickType(AdminLocalAuth, ['account'] as const),
    PickType(Admin, ['status'] as const),
    PickType(AdminProfile, ['name'] as const),
  ),
) {}
// 建立後台人員 傳入
export class CreateAdminReqDto extends IntersectionType(
  PickType(AdminLocalAuth, ['account', 'password'] as const),
  PickType(AdminProfile, ['name'] as const),
) {
  @IsNotEmpty()
  roles: Role[];
}
// 修改後台人員 傳入
export class EditAdminReqDto extends PartialType(
  IntersectionType(
    PickType(Admin, ['status'] as const),
    PickType(AdminProfile, ['name'] as const),
    PickType(CreateAdminReqDto, ['roles'] as const),
  ),
) {}

// Resp
// 後台人員列表 回傳
export class GetAdminListRespDto extends IntersectionType(PageRespDto<Admin>) {}
// 後台人員資訊 回傳
export class GetAdminInfoRespDto extends IntersectionType(Admin) {}
// 查詢後台人員 回傳
export class FindByLocalRespDto extends IntersectionType(
  PickType(AdminLocalAuth, ['account'] as const),
  PickType(Admin, ['status'] as const),
  PickType(AdminProfile, ['name'] as const),
) {}
// 驗證一方人員 回傳
export class FindByLocalValidateRespDto extends IntersectionType(
  PickType(Admin, ['id', 'status'] as const),
  PickType(AdminProfile, ['name'] as const),
  PickType(AdminAuthRelation, ['authType'] as const),
) {}
// 建立後台人員 回傳
export class CreateAdminRespDto extends IntersectionType(
  PickType(Admin, ['id', 'status'] as const),
  PickType(AdminProfile, ['name'] as const),
  PickType(AdminAuthRelation, ['authType'] as const),
  PickType(CreateAdminReqDto, ['roles'] as const),
) {}
// 修改後台人員 回傳
export class EditAdminRespDto extends IntersectionType(
  PickType(Admin, ['id', 'status'] as const),
  PickType(AdminProfile, ['name'] as const),
  PickType(CreateAdminRespDto, ['roles'] as const),
) {}
