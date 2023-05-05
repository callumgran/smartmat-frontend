<template>
  <v-bottom-navigation grow>
    <v-btn v-for="item in items.value" :key="item.title" @click="routeTo(item.to, item?.params)">
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </v-btn>
    <v-btn v-if="loggedIn" @click="drawerOpen = !drawerOpen">
      <v-icon>mdi-menu</v-icon>
      <span>Meny</span>
    </v-btn>
  </v-bottom-navigation>
  <hamburger-menu :open="drawerOpen" :items="drawerItems" @click="(e) => routeTo(e.to, e.params)" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { useUserInfoStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';
import HamburgerMenu from './HamburgerMenu.vue';
import { getISOWeek } from 'date-fns';

const householdStore = useHouseholdStore();
const userStore = useUserInfoStore();
const router = useRouter();

const today = new Date();

const loggedIn = computed(() => userStore.isLoggedIn);

const routeTo = (name: string, params?: Record<string, string | number> | undefined) => {
  drawerOpen.value = false;
  if (name === 'household-detail' || name == 'shopping-list' || name === 'household-weekly') {
    if (!householdStore.getSelectedId) {
      router.push({ name: 'household-create' });
      return;
    }
  }
  if (name === 'logout') {
    userStore.clearUserInfo();
    householdStore.clearHousehold();
    router.push({ name: 'home' });
    return;
  }
  router.push({ name, params });
};

const items = computed(() => (loggedIn.value ? itemsLoggedIn : itemsNotLoggedIn));

const itemsNotLoggedIn = computed(() => [
  {
    title: 'Hjem',
    icon: 'mdi-view-dashboard',
    to: 'home',
  },
  {
    title: 'Logg inn',
    icon: 'mdi-login',
    to: 'login',
    params: undefined,
  },
]);

const itemsLoggedIn = computed(() => [
  {
    title: 'Hjem',
    icon: 'mdi-view-dashboard',
    to: 'home',
  },
  {
    title: 'Min husstand',
    icon: 'mdi-home',
    to: 'household-detail',
    params: { id: householdStore.getSelectedId },
  },
  {
    title: 'Handleliste',
    icon: 'mdi-cart-outline',
    to: 'shopping-list',
  },
]);

const drawerItems = computed(() => [
  {
    title: 'Profil',
    icon: 'mdi-account',
    to: 'profile',
  },
  {
    title: 'Ukesmeny',
    icon: 'mdi-calendar-month-outline',
    to: 'household-weekly',
    params: {
      id: householdStore.getSelectedId,
      year: today.getFullYear(),
      week: getISOWeek(today),
    },
  },
  {
    title: 'Alle oppskrifter',
    icon: 'mdi-book-open-page-variant',
    to: 'recipe',
  },
  {
    title: 'Logg ut',
    icon: 'mdi-logout',
    to: 'logout',
  },
]);

const drawerOpen = ref(false);
</script>
