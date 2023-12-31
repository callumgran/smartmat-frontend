/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HouseholdMemberDTO = {
  household: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  householdRole: HouseholdMemberDTO.householdRole;
};

export namespace HouseholdMemberDTO {
  export enum householdRole {
    OWNER = 'OWNER',
    PRIVILEGED_MEMBER = 'PRIVILEGED_MEMBER',
    MEMBER = 'MEMBER',
  }
}
