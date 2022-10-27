import { Enforcer } from 'casbin';
import { AUTHORIZATION_ENFORCER } from '../authorization/token.const';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FindByLocalValidateRespDto } from 'src/modules/admin/dto/admin.dto';
import { AuthorizationService } from '../authorization/authorization.service';
import { Role } from 'src/packages/utils/role';
import { AdminStatus } from 'src/modules/admin/entities/admin.entity';
import { AuthType } from 'src/modules/admin/entities/admin-auth-relation.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @Inject(AUTHORIZATION_ENFORCER) private readonly enforcer: Enforcer,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { user, path, method } = request;
    const action = this.authorizationService.mappingAction(method);
    if (!request.headers.authorization) throw new UnauthorizedException();
    const roleValidate: boolean[] = [];
    const { id, ...info } = user as FindByLocalValidateRespDto;
    if (
      id === null &&
      info.status === AdminStatus.ENABLE &&
      info.name === 'SUPER_ADMIN' &&
      info.authType === AuthType.local
    ) {
      return true;
    }
    const roles = (await this.enforcer.getRolesForUser(`${id}`)) as Role[];
    for (const role of roles) {
      roleValidate.push(
        await this.authorizationService.checkPermission(role, path, action),
      );
    }
    return roleValidate.find((v) => v) === true;
  }
}
