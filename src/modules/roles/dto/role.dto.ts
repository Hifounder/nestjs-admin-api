import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Rule } from 'src/packages/utils/role';

// 新增角色規則
export class InsertRoleRuleDto extends IntersectionType(Rule) {}
// 刪除角色規則
export class DeleteRoleRuleDto extends PartialType(Rule) {}
