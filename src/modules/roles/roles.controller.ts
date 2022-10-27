import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/packages/guards/role.guard';
import { Role } from 'src/packages/utils/role';
import { DeleteRoleRuleDto, InsertRoleRuleDto } from './dto/role.dto';
import { RolesService } from './roles.service';

@Controller()
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  // 新增角色規則
  @Post('/:role')
  async insertRoleRule(
    @Param('role') role: Role,
    @Body() dto: InsertRoleRuleDto[],
  ): Promise<RespBody> {
    return { data: await this.rolesService.insertRoleRule(role, dto) };
  }
  // 刪除角色規則
  @Delete('/:role')
  async deleteRoleRule(
    @Param('role') role: Role,
    @Body() dto: DeleteRoleRuleDto[],
  ): Promise<RespBody> {
    return { data: await this.rolesService.deleteRoleRule(role, dto) };
  }
}
