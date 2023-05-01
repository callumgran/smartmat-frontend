<template>
  <v-card
    class="mx-auto"
    :prepend-icon="
      member.householdRole === HouseholdMemberDTO.householdRole.MEMBER ? 'mdi-account' : 'mdi-crown'
    ">
    <template v-slot:item>
      <p :data-testid="member.username">{{ member.firstName }} {{ member.lastName }}</p>
      <p class="mail">{{ member.email }}</p>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { HouseholdMemberDTO } from '@/api';

const props = defineProps({
  member: {
    type: Object as () => HouseholdMemberDTO,
    required: true,
  },
});
</script>

<style scoped>
.mail {
  font-size: 14px;
  color: grey;
}
</style>
