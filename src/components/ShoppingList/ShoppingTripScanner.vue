<template>
  <v-card class="d-flex flex-column justify-center align-center">
    <v-dialog v-model="linking" persistent>
      <ingredient-picker @onChoice="onIngredientChoice" chooseNullText="" />
    </v-dialog>
    <v-dialog v-model="showRemoveOtherDialog"> </v-dialog>
    <v-alert
      v-if="itemFound && !itemFound.ingredient && !itemFound.notIngredient"
      title="Ulinket Produkt"
      text="Produktet du har scannet er ikke linket i våre databaser enda, for at produktet skal funke skikkelig må du velge ingrediensen som dette produktet tilhører."
      type="warning" />
    <EANScanner v-if="!fetchingItem && !itemFound" @onScan="onScan" @on-close="emit('onClose')" />
    <v-progress-circular v-if="fetchingItem" indeterminate />
    <div v-if="itemFound" class="d-flex flex-column justify-center align-center">
      <ScannedItem :food-product="itemFound" />
      <v-btn @click="itemFound = null">Scan annen vare</v-btn>
      <v-btn v-if="itemFound.ingredient" class="bg-green" @click="onAddClick">Legg til</v-btn>
      <v-btn v-if="itemFound.notIngredient" class="bg-green" @click="onAddAndRemoveClick"
        >Legg til og fjern annet</v-btn
      >
      <v-btn v-else class="bg-orange" @click="linking = true">Link Ingrediens</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { BareFoodProductDTO, FoodProductDTO, FoodproductService, IngredientDTO } from '@/api';
import EANScanner from '@/components/common/EANScanner.vue';
import ScannedItem from '@/components/ShoppingList/ScannedItem.vue';
import { ref } from 'vue';
import IngredientPicker from '../common/IngredientPicker.vue';

const emit = defineEmits<{
  (e: 'onClose'): void;
  (e: 'onAdd', item: FoodProductDTO): void;
}>();

const fetchingItem = ref(false);
const itemFound = ref<FoodProductDTO | null>();
const linking = ref(false);

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

const onScan = async (ean: string) => {
  fetchingItem.value = true;
  const foodProduct = await FoodproductService.getFoodProductByEan({ ean });
  itemFound.value = foodProduct;
  fetchingItem.value = false;
};
</script>

<style scoped></style>
