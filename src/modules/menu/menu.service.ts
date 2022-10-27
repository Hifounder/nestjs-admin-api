import { Role, Rule } from 'src/packages/utils/role';
import { AUTHORIZATION_ENFORCER } from './../../packages/authorization/token.const';
import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';

@Injectable()
export class MenuService {
  constructor(
    @Inject(AUTHORIZATION_ENFORCER) private readonly enforcer: Enforcer,
  ) {}
  // 取得ROOT後台頁面
  async getMenuList(): Promise<Rule[]> {
    const ruleArr = await this.enforcer.getFilteredPolicy(0, Role.ROOT);
    const rules: Rule[] = [];
    ruleArr.forEach((obj) => {
      rules.push({
        api: obj[1],
        method: obj[2],
        parent: obj[3],
        child: obj[4],
      });
    });
    return rules;
  }
}
