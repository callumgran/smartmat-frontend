<template>
  <!-- TODO: Use form here-->
  <v-card>
    <v-card-title>
      <span class="headline">Legg til vare</span>
    </v-card-title>

    <v-alert
      v-if="customItem"
      text="Du har ikke valgt en kjent ingrediens som ligger i våres oppskrifter, dette vil gi dårligere forslag."
      title="Ukjent vare"
      type="warning">
    </v-alert>

    <v-card-text>
      <v-text-field v-model="name" label="Varenavn" required @update:focused="checkProduct">
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="chooseIngredient(suggestion)"
              >{{ suggestion.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-text-field>

      <v-text-field
        type="number"
        v-model="amount"
        :rules="[zeroOrNegativeNotAllowed]"
        :label="productChosen ? productChosen.unit?.name : 'Stykk'"
        required
        v-if="productChosen || customItem"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Avbryt</v-btn>
      <v-btn color="blue darken-1" text @click="add" :disabled="!productChosen && !customItem"
        >Legg til</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  CustomfooditemService,
  FilterRequest,
  IngredientDTO,
  IngredientService,
  ShoppinglistitemService,
  SortRequest,
} from '@/api';
import { ShoppingListService } from '@/api';
import { watch } from 'vue';

const suggestions = ref([] as IngredientDTO[]);

const customItem = ref(false);
const productChosen = ref(null as IngredientDTO | null);
const props = defineProps<{
  shoppingListId: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const name = ref('');
const amount = ref(0);

const add = async () => {
  if (customItem.value) {
    let res = await CustomfooditemService.addItemToShoppingList1({
      requestBody: { name: name.value, amount: amount.value, shoppingListId: props.shoppingListId },
    });
  } else if (productChosen.value) {
    let res = await ShoppinglistitemService.addItemToShoppingList({
      requestBody: {
        name: name.value,
        amount: amount.value,
        ingredientId: productChosen.value?.id,
        shoppingListId: props.shoppingListId,
      },
    });
  } else {
    throw new Error('No product chosen');
  }

  emit('close');
};

const zeroOrNegativeNotAllowed = (value: number) => {
  if (value <= 0) {
    return 'Må være større enn 0';
  }
  return true;
};

const close = () => {
  emit('close');
};

const chooseIngredient = (ingredient: IngredientDTO) => {
  name.value = ingredient.name;
  customItem.value = false;
  productChosen.value = ingredient;
};

const checkProduct = (e: any) => {
  if (!e) {
    if (suggestions.value.length < 1) {
      customItem.value = true;
    }
  }
};

watch([name], async () => {
  if (name.value.length > 0) {
    let res = await IngredientService.searchIngredients({
      requestBody: {
        sortRequests: [{ keyWord: 'name', sortDirection: SortRequest.sortDirection.ASC }],
        page: undefined,
        size: undefined,
        filterRequests: [
          {
            keyWord: 'name',
            value: name.value,
            operator: FilterRequest.operator.LIKE,
            fieldType: FilterRequest.fieldType.STRING,
            valueTo: '',
            values: [],
          },
        ],
      },
    });
    suggestions.value = res;
  }
});
</script>
