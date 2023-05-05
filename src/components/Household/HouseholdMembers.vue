<template>
  <h3 class="members-head">Medlemmer ({{ householdMembers.length }})</h3>
  <member-card
    v-for="member in householdMembers"
    :key="member.username"
    :member="member"
    class="members" />
</template>

<script setup lang="ts">
import { HouseholdMemberDTO } from '@/api';
import MemberCard from './MemberCard.vue';

defineProps({
  householdMembers: {
    type: Array as () => HouseholdMemberDTO[],
    required: true,
  },
});
</script>

<style scoped>
.members-head {
  text-align: center;
}

.members {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}
</style>
