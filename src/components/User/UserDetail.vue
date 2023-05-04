<template>
  <h1>Din bruker</h1>
  <v-card-text class="d-flex flex-column">
    <h2>{{ user.username }}</h2>
    <v-spacer />
    <p><strong>Navn:</strong></p>
    <p>{{ user.firstName }} {{ user.lastName }}</p>
    <v-divider />
    <v-spacer />
    <p><strong>Mail:</strong></p>
    <p>{{ user.email }}</p>
    <v-divider />
    <v-spacer />
    <p><strong>Rolle:</strong></p>
    <p>{{ user.role }}</p>
    <v-divider />
    <v-spacer />
    <p><strong>Husstander:</strong></p>
    <div v-if="households.length === 0">Du er ikke medlem av noen husstander</div>
    <div v-else style="max-height: 30vh; overflow-y: auto" class="light">
      <v-list lines="two">
        <v-list-item
          v-for="household in households"
          :key="household.id"
          :title="household.name"
          :subtitle="getHouseholdRole(household)">
          <template v-slot:append>
            <v-btn @click="router.push(`/household/${household.id}`)">
              <v-icon color="blue">mdi-arrow-right</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { UserService, HouseholdService, HouseholdDTO } from '@/api';
import { useRouter } from 'vue-router';

let user = await UserService.getUser1();
let households = await HouseholdService.getHouseholdsForUser({ username: user.username! });
const router = useRouter();

const getHouseholdRole = (household: HouseholdDTO) => {
  const role = household.members?.find(
    (member) => member.username === user.username,
  )?.householdRole;
  return role ? role : 'Medlem';
};
</script>
