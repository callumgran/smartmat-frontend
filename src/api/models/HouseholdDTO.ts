/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HouseholdMemberDTO } from './HouseholdMemberDTO';

export type HouseholdDTO = {
  id?: string;
  name?: string;
  members?: Array<HouseholdMemberDTO>;
};
