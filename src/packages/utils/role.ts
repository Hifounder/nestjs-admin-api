import { Enforcer, newEnforcer } from 'casbin';
import { join } from 'path';
import TypeORMAdapter from 'typeorm-adapter';

export enum Role {
  ROOT = 'root',
  OP = 'op',
  RD = 'rd',
  QA = 'qa',
  AC = 'ac',
  CS = 'cs',
  HR = 'hr',
  IT = 'it',
}
export class Rule {
  role?: Role;
  api: string;
  method: string;
  parent: string;
  child: string;
}
export const pathGuard = (value: string) => {
  //! 不需要進入 casbin_rule table 者路由記得於此新增
  switch (true) {
    case /\/login/i.test(value):
      break;
    case /\/metrics/i.test(value):
      break;
    case /\/menu/i.test(value):
      break;
    default:
      return value;
  }
};
// casbin 注入
export async function casbinInit() {
  const a = await TypeORMAdapter.newAdapter({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });
  return newEnforcer(join(__dirname, '../../../model.conf'), a);
}
// 菜單 注入
export async function insertAllRules(e: Enforcer, routes: any) {
  const rules: Rule[] = [];
  for (const { route } of routes) {
    if (pathGuard(route.path)) {
      //! 對於前台的菜單只會有兩層！根據 RouteMoudle 製作Tree
      rules.push({
        role: Role.ROOT,
        api: route.path,
        method: Object.keys(route.methods)[0].toUpperCase(),
        parent: route.path.split('/')[1],
        child: route.path.split('/')[2],
      });
    }
  }
  for (const rule of rules.map((obj) => Object.values(obj))) {
    await e.addPolicy(...rule);
  }
}
// 菜單 刪除
export async function deleteAllRules(e: Enforcer) {
  for (const role of Object.values(Role)) {
    await e.deleteRole(role);
  }
}
