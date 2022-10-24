import { Inject, Injectable } from '@nestjs/common';

import { Enforcer } from 'casbin';
import { AUTHORIZATION_ENFORCER } from './authorization.module';
export enum AuthorizationAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  NONE = 'none',
}
@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(AUTHORIZATION_ENFORCER) private readonly enforcer: Enforcer,
  ) {}

  public checkPermission(subject: string, object: string, action: string) {
    return this.enforcer.enforce(subject, object, action);
  }

  public mappingAction(method: string): AuthorizationAction {
    switch (method.toUpperCase()) {
      case 'GET':
        return AuthorizationAction.READ;
      case 'POST':
        return AuthorizationAction.CREATE;
      case 'PATCH':
      case 'PUT':
        return AuthorizationAction.UPDATE;
      case 'DELETE':
        return AuthorizationAction.DELETE;
      default:
        return AuthorizationAction.NONE;
    }
  }
}
