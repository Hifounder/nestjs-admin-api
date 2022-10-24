import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAdminReqDto,
  createAdminRespDto,
  editAdminReqDto,
  editAdminRespDto,
  findByLocalReqDto,
  findByLocalRespDto,
  findByLocalValidateReqDto,
  findByLocalValidateRespDto,
} from './dto/admin.dto';
import { Admin, AdminStatus } from './entities/admin.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { AdminLocalAuth } from './entities/admin-local-auth.entity';
import { AdminAuthRelation } from './entities/admin-auth-relation.entity';
import { createHmac } from 'crypto';

@Injectable()
export class AdminService {
  private MD5(message: string): string {
    const algorithm = 'sha256';
    const inputEncoding = 'utf8';
    const outputEncoding = 'hex';
    const key = process.env.OFFICIAL_KEY;

    return createHmac(algorithm, key)
      .update(message, inputEncoding)
      .digest(outputEncoding);
  }
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
  // 查詢 admin
  async findByLocal(data: findByLocalReqDto): Promise<findByLocalRespDto> {
    const user = await this.adminLocalAuthRepo.findOne({
      select: {
        auth: {
          authType: true,
        },
      },
      where: {
        account: data.account,
        password: this.MD5(data.password),
      },
      relations: {
        auth: {
          admin: {
            profile: true,
          },
        },
      },
    });
    if (!user) return null;
    const findByLocalRespDto: findByLocalRespDto = {
      account: user.account,
      name: user.auth.admin.profile.name,
      status: user.auth.admin.status,
    };
    return findByLocalRespDto;
  }
  // 驗證 admin
  async findByLocalValidate(
    data: findByLocalValidateReqDto,
  ): Promise<findByLocalValidateRespDto> {
    const user = await this.adminLocalAuthRepo.findOne({
      select: {
        auth: {
          authType: true,
        },
      },
      where: {
        account: data.account,
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
  async createAdmin(dto: createAdminReqDto): Promise<createAdminRespDto> {
    const admin: Admin = {
      status: AdminStatus.ENABLE,
    };
    const adminProfile: AdminProfile = {
      name: dto.name,
      admin: admin,
    };
    const adminAuthRelation: AdminAuthRelation = {
      admin: admin,
      authType: 'local',
    };
    const adminLocalAuth: AdminLocalAuth = {
      account: dto.account,
      password: this.MD5(dto.password),
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
  async editAdmin(id: number, dto: editAdminReqDto): Promise<editAdminRespDto> {
    let admin: Admin = await this.adminRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!admin) {
      throw new ForbiddenException();
    }
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
}
