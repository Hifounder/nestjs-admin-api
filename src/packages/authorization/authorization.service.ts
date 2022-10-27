import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { AUTHORIZATION_ENFORCER } from './token.const';

export enum AuthorizationAction {
  POST = 'POST',
  GET = 'GET',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
  NONE = 'NONE',
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
        return AuthorizationAction.GET;
      case 'POST':
        return AuthorizationAction.POST;
      case 'PATCH':
        return AuthorizationAction.PATCH;
      case 'PUT':
        return AuthorizationAction.PUT;
      case 'DELETE':
        return AuthorizationAction.DELETE;
      default:
        return AuthorizationAction.NONE;
    }
  }
}
