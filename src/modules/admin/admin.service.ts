import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAdminReqDto,
  CreateAdminRespDto,
  EditAdminReqDto,
  EditAdminRespDto,
  FindByLocalReqDto,
  FindByLocalRespDto,
  FindByLocalValidateReqDto,
  FindByLocalValidateRespDto,
  GetAdminInfoRespDto,
  GetAdminListReqDto,
  GetAdminListRespDto,
} from './dto/admin.dto';
import { Admin, AdminStatus } from './entities/admin.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { AdminLocalAuth } from './entities/admin-local-auth.entity';
import {
  AdminAuthRelation,
  AuthType,
} from './entities/admin-auth-relation.entity';
import { MD5 } from 'src/packages/utils/utils';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(AdminProfile)
    private readonly adminProfileRepo: Repository<AdminProfile>,
    @InjectRepository(AdminLocalAuth)
    private readonly adminLocalAuthRepo: Repository<AdminLocalAuth>,
    @InjectRepository(AdminAuthRelation)
    private readonly adminAuthRelationRepo: Repository<AdminAuthRelation>,
  ) {}
  // 後台人員列表
  async getAdminList({
    rows,
    page,
    ...dto
  }: GetAdminListReqDto): Promise<GetAdminListRespDto> {
    const list = await this.adminRepo.find({
      where: {
        status: dto.status,
        profile: {
          name: dto.name,
        },
      },
      relations: { profile: true },
      order: { id: 'DESC' },
      skip: page,
      take: rows,
    });
    return { page, rows, list };
  }
  // 後台人員資訊
  async getAdminInfo(id: number): Promise<GetAdminInfoRespDto> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!admin) throw new ForbiddenException();
    return admin;
  }
  // 查詢 admin
  async findByLocal(dto: FindByLocalReqDto): Promise<FindByLocalRespDto> {
    const user = await this.adminLocalAuthRepo.findOne({
      select: {
        auth: {
          authType: true,
        },
      },
      where: {
        account: dto.account,
        password: MD5(dto.password),
      },
      relations: {
        auth: {
          admin: {
            profile: true,
          },
        },
      },
    });
    if (!user) throw new ForbiddenException();
    return {
      account: user.account,
      name: user.auth.admin.profile.name,
      status: user.auth.admin.status,
    };
  }
  // 驗證 admin
  async findByLocalValidate(
    dto: FindByLocalValidateReqDto,
  ): Promise<FindByLocalValidateRespDto> {
    const user = await this.adminLocalAuthRepo.findOne({
      select: {
        auth: {
          authType: true,
        },
      },
      where: {
        account: dto.account,
      },
      relations: {
        auth: {
          admin: {
            profile: true,
          },
        },
      },
    });
    if (user.auth.admin.status !== AdminStatus.ENABLE)
      throw new ForbiddenException();
    return {
      id: user.auth.admin.id,
      status: user.auth.admin.status,
      name: user.auth.admin.profile.name,
      authType: user.auth.authType,
    };
  }
  // 建立後台人員
  async createAdmin(dto: CreateAdminReqDto): Promise<CreateAdminRespDto> {
    const admin: Admin = {
      status: AdminStatus.ENABLE,
    };
    const adminProfile: AdminProfile = {
      name: dto.name,
      admin: admin,
    };
    const adminAuthRelation: AdminAuthRelation = {
      admin: admin,
      authType: AuthType.local,
    };
    const adminLocalAuth: AdminLocalAuth = {
      account: dto.account,
      password: dto.password,
      auth: adminAuthRelation,
    };

    await this.adminRepo.save(admin);
    await this.adminProfileRepo.save(adminProfile);
    await this.adminRepo.save({ ...admin, profileId: adminProfile.id });
    await this.adminAuthRelationRepo.save(adminAuthRelation);
    await this.adminLocalAuthRepo.save(adminLocalAuth);

    return {
      id: admin.id,
      status: admin.status,
      name: adminProfile.name,
      authType: adminAuthRelation.authType,
    };
  }
  // 修改後台人員
  async editAdmin(id: number, dto: EditAdminReqDto): Promise<EditAdminRespDto> {
    let admin: Admin = await this.adminRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!admin) throw new ForbiddenException();
    admin = await this.adminRepo.save({ id: admin.id, status: dto.status });
    const adminProfile: AdminProfile = await this.adminProfileRepo.save({
      id: admin.profile.id,
      name: dto.name,
      admin: {
        status: dto.status,
      },
    });

    return {
      id: admin.id,
      status: admin.status,
      name: adminProfile.name,
    };
  }
  // 刪除後台人員(改狀態)
  async deleteAdmin(id: number) {
    const admin: Admin = await this.adminRepo.findOne({
      select: {
        id: true,
        status: true,
      },
      where: { id },
    });
    if (!admin) {
      throw new ForbiddenException();
    }
    if (admin.status === AdminStatus.DELETE) return;
    await this.adminRepo.save({ id: admin.id, status: AdminStatus.DELETE });
  }
}
