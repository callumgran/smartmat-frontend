<template>
  <v-app-bar>
    <v-toolbar-title data-testid="navbar-title" style="font-weight: 600; font-size: 1.5em"
      >SmartMat</v-toolbar-title
    >
    <v-toolbar-title style="font-size: 1em" v-if="currentHousehold"
      ><v-icon icon="mdi-home"></v-icon>{{ currentHousehold }}</v-toolbar-title
    >

    <v-btn
      v-if="currentRouteName === 'login' || currentRouteName === 'register'"
      variant="outlined"
      rounded="lg"
      data-testid="home-button"
      :to="{ name: 'base' }"
      >hovedside</v-btn
    >
    <v-btn
      v-else-if="!userStore.isLoggedIn"
      variant="outlined"
      rounded="lg"
      data-testid="login-button"
      :to="{ name: 'login' }"
      >Logg inn</v-btn
    >
    <v-app-bar-nav-icon
      v-else
      data-testid="navbar-drawer-button"
      variant="text"
      @click="openDrawer = !openDrawer"></v-app-bar-nav-icon>
  </v-app-bar>

  <v-navigation-drawer v-model="openDrawer" location="top">
    <v-list data-testid="drawer-link-list">
      <router-link v-for="item in items" :key="item.title" :to="{ name: item.to }">
        <v-list-item link :prepend-icon="item.icon">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </router-link>
      <!-- log out router link that needs extra logic -->
      <router-link
        @click="
          userStore.clearUserInfo();
          householdStore.clearHousehold();
        "
        :to="{ name: 'login' }">
        <v-list-item link prepend-icon="mdi-logout">
          <v-list-item-title>Logg ut</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import { useHouseholdStore } from '@/stores/HouseholdStore';

const openDrawer = ref(false);
const route = useRoute();
const userStore = useUserInfoStore();
const householdStore = useHouseholdStore();
const currentRouteName = computed(() => route.name);
const currentHousehold = computed(() => useHouseholdStore().householdName);
const items = [
  {
    title: 'Hjem',
    icon: 'mdi-account-box',
    to: 'base',
  },
  {
    title: 'Mine husstander',
    icon: 'mdi-home',
    to: 'household',
  },
  {
    title: 'Oppskrifter',
    icon: 'mdi-hamburger',
    to: 'recipe',
  },
  {
    title: 'Handleliste',
    icon: 'mdi-cart-outline',
    to: 'shopping-list',
  },
];
</script>
