import { PassportUser } from './permissions/passport-request';

export function isAdministrator(user: PassportUser) {
  return user.permissions.length > 0;
}
