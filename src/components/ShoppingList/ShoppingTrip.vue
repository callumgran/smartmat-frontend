<template>
  <div>
    <v-dialog v-model="scanOpen">
      <EANScanner @onScan="onScan" @onClose="scanOpen = false" />
    </v-dialog>
    <v-dialog v-model="scanLoading">
      <v-card>
        <v-card-title>Loading...</v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="scanFoundBool">
      <v-card>
        <v-card-title>Scan result</v-card-title>
        <v-card-text>
          <v-img :src="scanFound?.imageUrl" />
          <v-card-title>{{ scanFound?.name }}</v-card-title>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="scanFound = null">Cancel</v-btn>
          <v-btn @click="addToList">Add to list</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="chooseIngredient">
      <choose-ingredient-modal
        v-model="chosenIngredient"
        @onClose="onChooseIngredientClose"
        :ingredients="shoppingListItems" />
    </v-dialog>
    <v-list class="h-80vh">
      <v-list-item-group>
        <v-list-item-title v-if="shoppingListItems.length"> Ingredienser </v-list-item-title>
        <v-list-item v-for="(item, index) in shoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between align-center">
            <div class="d-flex align-center justify-center">
              <v-list-item-title :style="item.checked ? 'text-decoration: line-through' : ''">
                {{ item.ingredient?.name }}</v-list-item-title
              >
            </div>
            <v-list-item-title
              >{{ item.amount }} {{ item.ingredient?.unit?.abbreviation }}</v-list-item-title
            >
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group>
        <v-list-item-title v-if="customShoppingListItems.length"> Annet </v-list-item-title>
        <v-list-item v-for="(item, index) in customShoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between align-center">
            <div class="d-flex align-center justify-center">
              <v-list-item-title :style="item.checked ? 'text-decoration: line-through' : ''">
                {{ item.name }}</v-list-item-title
              >
            </div>
            <v-list-item-title>{{ item.amount }} stk</v-list-item-title>
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-bottom-navigation class="justify-space-around" grow>
      <v-btn class="color-red" @click="closeDialog = true">Avslutt Handletur</v-btn>
      <v-btn class="bg-green" @click="scanOpen = true">Scan vare</v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="closeDialog">
      <v-card>
        <v-card-title>Avslutt handletur</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  >Er du sikker på at du vil avslutte handleturen?</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog = false">Avbryt</v-btn>
          <v-btn @click="onClose">Avslutt</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  FoodProductDTO,
  FoodproductService,
  HouseholdService,
  HouseholdfoodproductService,
  ShoppingListService,
  ShoppinglistitemService,
} from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import EANScanner from '@/components/common/EANScanner.vue';
import ChooseIngredientModal from '@/components/ShoppingList/ChooseIngredientModal.vue';
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const householdId = useHouseholdStore().householdId;
const currentShoppingList = await HouseholdService.getCurrentShoppingList({
  id: householdId,
});

const shoppingListItems = currentShoppingList.shoppingListItems;
const customShoppingListItems = currentShoppingList.customFoodItems;

const closeDialog = ref(false);
const scanLoading = ref(false);
const scanFound = ref(null as (FoodProductDTO & { imageUrl?: string }) | null);
const scanFoundBool = ref(false);
// TODO: check if this is the correct type
const chosenIngredient = ref(null as FoodProductDTO | null);
const chooseIngredient = ref(false);

const onClose = async () => {
  await ShoppingListService.completeShoppingList({ id: currentShoppingList.id });
  await ShoppingListService.createShoppingList({ requestBody: { household: householdId } });
  router.push({ name: 'shopping-list' });
};

const setFound = (name: string, ean: string, imageUrl?: string) => {
  scanLoading.value = false;
  scanFoundBool.value = true;
  scanFound.value = {
    name: name,
    ean: ean,
    imageUrl: imageUrl,
  };
};
const onScan = async (ean: string) => {
  scanLoading.value = true;
  scanOpen.value = false;
  try {
    const item = await FoodproductService.getFoodProductByEan({ ean: ean });
    console.log('item from backend', item);
    if (item.ean) {
      setFound(item.name, item.ean);
    }
  } catch (e) {
    console.log('item not found, trying kassalap');
    const response = await axios.get(`https://kassal.app/api/v1/products/ean/${ean}`, {
      headers: {
        Authorization: 'Bearer h3wmE37m3eNg72aJPm5k1jhG7tX9gjL5rhwtsEoe',
      },
    });
    console.log('response', response);
    if (response.status === 200) {
      const item = response.data.data.products[0];
      console.log('item from kassalap', item);
      if (item) {
        setFound(item.name, ean, item.image);
      }
    }
  }
};

const scanOpen = ref(false);

const onChooseIngredientClose = async () => {
  console.log('onChooseIngredientClose');
  chooseIngredient.value = false;
  if (scanFound.value) {
    if (chosenIngredient.value && chosenIngredient.value.ingredient) {
      scanFound.value.ingredient = {
        id: chosenIngredient.value.ingredient.id,
        name: chosenIngredient.value.ingredient.name,
      };
      await addToBackend();
    }
  }
};

const addToList = async () => {
  scanFoundBool.value = false;
  console.log('scanFound', scanFound.value?.ingredient);
  if (!scanFound.value?.ingredient) {
    chooseIngredient.value = true;
  } else {
    await addToBackend();
  }
};

const addToBackend = async () => {
  if (scanFound.value && scanFound.value.ingredient) {
    console.log('adding to backend');
    const foodProduct = await FoodproductService.createFoodProduct({
      requestBody: {
        name: scanFound.value?.name,
        ean: scanFound.value?.ean,
        amount: 1,
        ingredientId: scanFound.value?.ingredient?.id,
        looseWeight: false,
      },
    });
    if (foodProduct.id) {
      await addToHousehold(foodProduct);
    } else {
      throw new Error('foodProduct.id is undefined');
    }
    scanLoading.value = false;
  }
};

const addToHousehold = async (foodProduct: FoodProductDTO) => {
  const huseholdItem = await HouseholdfoodproductService.createHouseholdFoodProduct({
    householdId: householdId,
    requestBody: {
      foodProductId: foodProduct.id,
      expirationDate: new Date().toISOString().slice(0, 10),
      amountLeft: 1,
    },
  });
  if (chosenIngredient.value?.id) {
    const shoppingListItem = shoppingListItems.find(
      (item) => item.ingredient?.id === foodProduct.ingredient?.id,
    );
    if (shoppingListItem) {
      const checkItem = await ShoppinglistitemService.checkOrUncheckItemOnShoppingList({
        id: shoppingListItem?.id,
      });
      shoppingListItem.checked = checkItem.checked;
    } else {
      throw new Error('shoppingListItem is undefined');
    }
  } else {
    throw new Error('chosenIngredient.value is undefined');
  }
  console.log('shoppingListItem', huseholdItem);
};
</script>
