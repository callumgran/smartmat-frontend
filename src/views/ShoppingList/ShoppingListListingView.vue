<template>
  <div class="d-flex flex-column">
    <v-title class="text-h4 text-center">Handleliste</v-title>
    <div class="d-flex align-center">
      <v-text-field
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details></v-text-field>
      <!-- <v-btn
          class="py-auto mx-2"
          @click="addShoppingListItem"
        ><v-icon>mdi-plus</v-icon></v-btn> -->
    </div>
    <v-divider />
    <v-list class="h-80vh">
      <v-list-item-group v-if="shoppingListItemSuggestions.length">
        <v-list-item v-for="(item, index) in shoppingListItemSuggestions" :key="index">
          <v-list-item-content class="d-flex justify-space-between">
            <div>
              <div class="d-flex justify-space-between">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-title>{{ item.amount }} {{ item.unit.shortName }}</v-list-item-title>
              </div>
              <v-list-item-subtitle>Foreslått av {{ item.suggestedBy.name }}</v-list-item-subtitle>
            </div>
            <v-list-item-action>
              <v-btn class="bg-green" @click="addShoppingListSuggestion(item)"
                ><v-icon>mdi-check-bold</v-icon></v-btn
              >
              <v-btn class="bg-red" @click="addShoppingListItem"><v-icon>mdi-close</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
      </v-list-item-group>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in shoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-title>{{ item.amount }} {{ item.unit.shortName }}</v-list-item-title>
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-bottom-navigation class="justify-space-around" grow>
      <v-btn class="">Legg til vare</v-btn>
      <v-btn style="">Start Handletur</v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const search = ref('');
const shoppingListItems = ref([
  {
    name: 'Melk',
    amount: '1',
    unit: {
      name: 'Liter',
      shortName: 'L',
    },
  },
]);
const shoppingListItemSuggestions = ref([
  {
    name: 'Sjokolade',
    amount: '400',
    unit: {
      name: 'Gram',
      shortName: 'g',
    },
    suggestedBy: {
      name: 'Ola Nordmann',
    },
  },
]);

const addShoppingListItem = () => {
  console.log('addShoppingListItem');
};

const addShoppingListSuggestion = (item: any) => {
  shoppingListItems.value.push(item);
  shoppingListItemSuggestions.value = shoppingListItemSuggestions.value.filter(
    (suggestion) => suggestion !== item,
  );
};
</script>

<style scoped>
.h-80vh {
  height: 65vh;
}

.fixed-bottom {
  bottom: 0;
  margin-bottom: 4rem;
  position: fixed;
  transform: translate();
}
</style>
