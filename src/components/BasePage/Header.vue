<template>
  <v-app-bar>
    <v-toolbar-title data-testid="navbar-title">{{ title }}</v-toolbar-title>
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
      <router-link @click="userStore.clearUserInfo()" :to="{ name: 'login' }">
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

const openDrawer = ref(false);
const route = useRoute();
const userStore = useUserInfoStore();
const title = computed(() => route.meta.title);
const currentRouteName = computed(() => route.name);

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
    to: 'base',
  },
  {
    title: 'Handleliste',
    icon: 'mdi-cart-outline',
    to: 'base',
  },
];
</script>
