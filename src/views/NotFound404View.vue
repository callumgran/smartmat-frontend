<template>
  <v-container fluid>
    <h1 data-testid="not-found-header">Kunne ikke finne siden du lette etter</h1>
    <v-btn-group>
      <v-btn class="mx-3" :to="{ name: 'home' }" data-testid="goto-main">til hovedside</v-btn>
      <v-btn class="mx-3" @click="$router.go(-1)" :to="{ name: 'home' }" data-testid="goback"
        >tilbake</v-btn
      >
    </v-btn-group>
  </v-container>
</template>
