import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { AUTHORIZATION_ENFORCER } from 'src/packages/authorization/token.const';
import { Role } from 'src/packages/utils/role';
import { DeleteRoleRuleDto, InsertRoleRuleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(AUTHORIZATION_ENFORCER) private readonly enforcer: Enforcer,
  ) {}
  // 新增角色規則
  async insertRoleRule(role: Role, dto: InsertRoleRuleDto[]): Promise<boolean> {
    for (const rule of dto.map((obj) => Object.values(obj))) {
      rule.unshift(role);
      await this.enforcer.addPolicy(...rule);
    }
    return true;
  }
  // 刪除角色規則
  async deleteRoleRule(role: Role, dto: DeleteRoleRuleDto[]): Promise<boolean> {
    for (const rule of dto.map((obj) => Object.values(obj))) {
      rule.unshift(role);
      await this.enforcer.removePolicy(...rule);
    }
    return true;
  }
}
