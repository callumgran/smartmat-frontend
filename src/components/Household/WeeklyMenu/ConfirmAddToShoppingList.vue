<template>
  <v-dialog v-model="showModal" max-width="500" class="dialog">
    <v-card data-testid="modal-dialog">
      <v-card-item><h3>Legg ingredienser i handlelisten</h3></v-card-item>
      <v-card-text>
        <v-list>
          <v-checkbox
            v-for="(item, index) in missingIngridients"
            :key="index"
            :label="item.ingredient!.name"
            :value="item"
            v-model="selectedItems"
            density="compact"
            color="green"
            persistent-hint
            :hint="'Du mangler ' + item.amount + ' ' + item.ingredient!.unit?.abbreviation + ' i beholdningen'"
            data-testid="ingredient-checkbox" />
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="add()" data-testid="add-to-shopping-list-button"
          >Legg til</v-btn
        >
        <v-btn @click="close()">Lukk</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useFeedbackStore from '@/stores/FeedbackStore';
import {
  HouseholdService,
  ShoppinglistitemService,
  CreateShoppingListItemDTO,
  RecipeShoppingListItemDTO,
} from '@/api';

const props = defineProps<{
  mondayOfWeek: string;
}>();

const emit = defineEmits(['close']);

const route = useRoute();
const householdId = route.params.id as string;
const missingIngridients = ref([] as RecipeShoppingListItemDTO[]);
const showModal = ref(true);

missingIngridients.value = await HouseholdService.getShoppingListItems1({
  id: householdId,
  monday: props.mondayOfWeek,
});

const close = () => {
  showModal.value = false;
  emit('close');
};

const add = async () => {
  const shoppingListId = await HouseholdService.getCurrentShoppingList({ id: householdId });

  for (const item of selectedItems.value) {
    const payload = {
      name: item.ingredient?.name,
      amount: item.amount,
      ingredientId: item.ingredient?.id,
      shoppingListId: shoppingListId.id,
    } as CreateShoppingListItemDTO;

    ShoppinglistitemService.addItemToShoppingList({
      requestBody: payload,
    });
  }
  useFeedbackStore().addFeedback('Ingredienser lagt til i handlelisten', 'success');
  close();
};

const selectedItems = ref<RecipeShoppingListItemDTO[]>(missingIngridients.value ?? []);
</script>

<style scoped>
.dialog {
  width: 100%;
  z-index: 1;
}
</style>
