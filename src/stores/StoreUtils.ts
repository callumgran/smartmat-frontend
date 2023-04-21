import useFeedbackStore from '@/stores/FeedbackStore';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { useUserInfoStore } from '@/stores/UserStore';

const feedbackStore = useFeedbackStore();
const householdStore = useHouseholdStore();
const userInfoStore = useUserInfoStore();

/**
 * Used when logging out
 */
export const clearStores = () => {
  feedbackStore.clearFeedbacks();
  householdStore.clearHousehold();
  userInfoStore.clearUserInfo();
};
