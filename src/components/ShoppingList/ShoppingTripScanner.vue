<template>
  <v-card class="d-flex flex-column justify-center align-center">
    <v-dialog v-model="linking">
      <ingredient-picker @onChoice="onIngredientChoice" chooseNullText="" />
    </v-dialog>
    <v-dialog v-model="showRemoveOtherDialog">
      <remove-other :items="others" @onChoice="onRemoveOther" />
    </v-dialog>
    <v-alert
      v-if="itemFound && !itemFound.ingredient && !itemFound.notIngredient"
      title="Ulinket Produkt"
      text="Produktet du har scannet er ikke linket i våre databaser enda, for at produktet skal funke skikkelig må du velge ingrediensen som dette produktet tilhører."
      type="warning" />
    <EANScanner v-if="!fetchingItem && !itemFound" @onScan="onScan" @on-close="emit('onClose')" />
    <v-progress-circular v-if="fetchingItem" indeterminate />
    <div v-if="itemFound" class="d-flex flex-column justify-center align-center">
      <ScannedItem :food-product="itemFound" />
      <v-btn class="ma-2 bg-grey" @click="itemFound = null">Scan annen vare</v-btn>
      <v-btn
        class="ma-2 bg-green"
        v-if="itemFound.ingredient && !itemFound.firstTime"
        @click="onAddClick"
        >Legg til</v-btn
      >
      <div
        v-else-if="itemFound.notIngredient"
        class="d-flex flex-column justify-center align-center">
        <v-btn class="ma-2 bg-green" @click="onAddAndRemoveClick">Legg til og fjern annet</v-btn>
        <v-btn class="ma-2" @click="onAddClick">Legg til uten å fjerne annet</v-btn>
      </div>
      <v-btn class="ma-2 bg-orange" v-else @click="linking = true">Link Ingrediens</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {
  BareFoodProductDTO,
  CustomFoodItemDTO,
  FoodProductDTO,
  FoodproductService,
  HouseholdService,
  IngredientDTO,
} from '@/api';
import EANScanner from '@/components/common/EANScanner.vue';
import ScannedItem from '@/components/ShoppingList/ScannedItem.vue';
import { ref } from 'vue';
import RemoveOther from '@/components/ShoppingList/RemoveOther.vue';
import IngredientPicker from '../common/IngredientPicker.vue';
import { computed } from 'vue';
import { useHouseholdStore } from '@/stores/HouseholdStore';

const emit = defineEmits<{
  (e: 'onClose'): void;
  (e: 'onAdd', item: FoodProductDTO): void;
  (e: 'onRemoveOther', item: CustomFoodItemDTO): void;
}>();

const fetchingItem = ref(false);
const itemFound = ref<FoodProductDTO | null>();
const linking = ref(false);
const householdId = computed(() => useHouseholdStore().getSelectedId);

const others = ref(
  (await HouseholdService.getCurrentShoppingList({ id: householdId.value })).customFoodItems.filter(
    (item) => !item.checked,
  ),
);

const onIngredientChoice = async (ingredient: IngredientDTO | null) => {
  linking.value = false;
  if (!itemFound.value || !itemFound.value.amount) {
    throw new Error('No item found');
  } else if (!ingredient) {
    const updatedItem: BareFoodProductDTO = {
      id: itemFound.value.id,
      amount: itemFound.value.amount,
      looseWeight: itemFound.value.looseWeight,
      ean: itemFound.value.ean,
      name: itemFound.value.name,
      image: itemFound.value.image,
      notIngredient: true,
      unit: itemFound.value.unit,
    };

    itemFound.value = await FoodproductService.updateFoodProduct({
      id: itemFound.value.id,
      requestBody: updatedItem,
    });
    return;
  } else {
    const updatedItem: BareFoodProductDTO = {
      id: itemFound.value.id,
      ingredientId: ingredient.id,
      amount: itemFound.value.amount,
      looseWeight: itemFound.value.looseWeight,
      ean: itemFound.value.ean,
      name: itemFound.value.name,
      image: itemFound.value.image,
      unit: itemFound.value.unit,
    };
    itemFound.value = await FoodproductService.updateFoodProduct({
      id: itemFound.value.id,
      requestBody: updatedItem,
    });
  }
};

const onAddClick = async () => {
  if (!itemFound.value) {
    throw new Error('No item found');
  } else {
    emit('onAdd', itemFound.value);
    emit('onClose');
  }
};

const showRemoveOtherDialog = ref(false);

const onAddAndRemoveClick = () => {
  if (!itemFound.value) {
    throw new Error('No item found');
  } else {
    showRemoveOtherDialog.value = true;
  }
};

const onRemoveOther = (item: CustomFoodItemDTO) => {
  if (!itemFound.value) {
    throw new Error('No item found');
  }
  emit('onAdd', itemFound.value);
  emit('onRemoveOther', item);
  emit('onClose');
};

const onScan = async (ean: string) => {
  fetchingItem.value = true;
  const foodProduct = await FoodproductService.getFoodProductByEan({ ean });
  itemFound.value = foodProduct;
  fetchingItem.value = false;
};
</script>

<style scoped></style>
