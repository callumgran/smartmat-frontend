/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UnitDTO = {
  name: string;
  abbreviation?: string;
  toNormalFormConversionFactor?: number;
  unitType?: UnitDTO.unitType;
};

export namespace UnitDTO {
  export enum unitType {
    SOLID = 'SOLID',
    LIQUID = 'LIQUID',
    BY_PIECE = 'BY_PIECE',
  }
}
