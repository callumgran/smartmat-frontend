/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HouseholdMemberDTO } from './HouseholdMemberDTO';

export type UserDTO = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserDTO.role;
  households?: Array<HouseholdMemberDTO>;
};

export namespace UserDTO {
  export enum role {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
}
