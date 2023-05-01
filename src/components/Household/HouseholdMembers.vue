<template>
  <member-card v-for="member in householdMembers" :key="member.username" :member="member" />
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
