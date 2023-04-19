<template>
  <v-app-bar>
    <v-app-bar-nav-icon
      data-testid="navbar-drawer-button"
      variant="text"
      @click="openDrawer = !openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title data-testid="navbar-title">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-navigation-drawer v-model="openDrawer">
    <v-list data-testid="drawer-link-list">
      <router-link v-for="item in items" :key="item.title" :to="{ name: item.to }">
        <v-list-item link :prepend-icon="item.icon">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const openDrawer = ref(false);
const route = useRoute();
const title = computed(() => route.meta.title);

const items = [
  {
    title: 'Husholdninger',
    icon: 'mdi-home',
    to: 'base',
  },
  {
    title: 'Logg inn',
    icon: 'mdi-login',
    to: 'login',
  },
];
</script>
