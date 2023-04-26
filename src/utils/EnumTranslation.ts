import { HouseholdMemberDTO, RecipeDTO } from '@/api';

export const HouseholdMemberRole = {
  [HouseholdMemberDTO.householdRole.OWNER]: 'Eier',
  [HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER]: 'Innkjøper',
  [HouseholdMemberDTO.householdRole.MEMBER]: 'Medlem',
};

export const RecipeDifficulty = {
  [RecipeDTO.recipeDifficulty.EASY]: 'Enkel',
  [RecipeDTO.recipeDifficulty.MEDIUM]: 'Middels',
  [RecipeDTO.recipeDifficulty.ADVANCED]: 'Avansert',
};
