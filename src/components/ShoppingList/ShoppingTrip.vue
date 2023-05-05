<template>
  <div>
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab data-testid="button" :value="1">Handleliste</v-tab>
      <v-tab :value="2">Kurv</v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="tab">
      <v-window-item :value="1" class="">
        <v-expansion-panels variant="accordion">
          <shopping-trip-item
            v-for="item in shoppingListItems"
            :item="item"
            @add-to-basket="manualShoppingListItemToBasket"
            :key="item.id"></shopping-trip-item>

          <shopping-trip-item
            v-for="item in customShoppingListItems"
            :item="item"
            @add-to-basket="manualCustomProductItemToBasket"
            :key="item.id"></shopping-trip-item>
        </v-expansion-panels>
      </v-window-item>
      <v-window-item :value="2">
        <v-btn v-if="selectedBasked.length" class="bg-red text-white" @click="deleteSelectedBasked"
          >Slett markerte</v-btn
        >
        <v-list>
          <food-product-card
            v-for="basketItem in basket.basketItems"
            :key="basketItem.id"
            :item="basketItem.foodProduct"
            selectable
            v-model:selected="selectedBasked"
            :selectedValue="basketItem">
          </food-product-card>
          <food-product-card
            v-for="basketItem in basket.customFoodItems"
            :key="basketItem.id"
            :item="{ image: '', looseWeight: false, ...basketItem, id: 0 }"
            selectable
            v-model:selected="selectedBasked"
            :selectedValue="basketItem">
          </food-product-card>
        </v-list>
      </v-window-item>
    </v-window>

    <v-dialog v-model="scanOpen">
      <shopping-trip-scanner
        @on-add="onAdd"
        @on-close="scanOpen = false"
        @on-remove-other="onRemoveOther" />
    </v-dialog>
    <div class="justify-space-around d-flex pa-10">
      <v-btn @click="closeDialog = true" class="bg-green">Fullfør Handletur</v-btn>
      <v-btn class="bg-blue" @click="scanOpen = true">Scan vare</v-btn>
    </div>
    <v-dialog v-model="closeDialog">
      <v-card>
        <v-card-title>Fullfør handletur</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              >Er du sikker på at du vil fullføre handleturen?<br />Produktene i handlekurven vil
              bli lagt til i din beholdning</v-list-item
            >
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog = false">Avbryt</v-btn>
          <v-btn @click="onClose" class="bg-green">Fullfør</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  BasketItemDTO,
  BasketService,
  CustomFoodItemDTO,
  CustomfooditemService,
  FoodProductDTO,
  FoodproductService,
  HouseholdService,
  HouseholdfoodproductService,
  ShoppingListItemDTO,
  ShoppingListService,
} from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import ShoppingTripScanner from '@/components/ShoppingList/ShoppingTripScanner.vue';
import { computed, ref } from 'vue';
import router from '@/router';
import { useRouter } from 'vue-router';
import FoodProductCard from '@/components/common/FoodProductCard.vue';
import { watch } from 'vue';
import ShoppingTripItem from '@/components/ShoppingList/ShoppingTripItem.vue';

const householdId = ref(useHouseholdStore().getSelectedId);
const currentShoppingList = ref(
  await HouseholdService.getCurrentShoppingList({
    id: householdId.value,
  }),
);

if (!currentShoppingList.value.basket) {
  useRouter().push({ name: 'shopping-list' });
  throw new Error('Fant ingen handleliste');
}
const basket = ref(await BasketService.getBasket({ basketId: currentShoppingList.value.basket }));

const diffList = ref(
  await ShoppingListService.getShoppingListDiff({ id: currentShoppingList.value.id }),
);

watch(diffList, async () => {
  if (currentShoppingList.value.basket) {
    basket.value = await BasketService.getBasket({ basketId: currentShoppingList.value.basket });
  }
});

const shoppingListItems = computed(() => diffList.value.shoppingListItems);

watch(diffList, () => {
  console.log('sorting', diffList);
  diffList.value.shoppingListItems.sort((a, b) => {
    if (a.amount < b.amount) {
      return -1;
    }
    if (a.amount > b.amount) {
      return 1;
    }
    return 0;
  });
});

const customShoppingListItems = ref(currentShoppingList.value.customFoodItems);

watch(currentShoppingList, () => {
  currentShoppingList.value.customFoodItems.sort((a, b) => {
    if (a.amount < b.amount) {
      return -1;
    }
    if (a.amount > b.amount) {
      return 1;
    }
    return 0;
  });
  customShoppingListItems.value = currentShoppingList.value.customFoodItems;
});

const selectedBasked = ref<BasketItemDTO[]>([]);

const closeDialog = ref(false);
const tab = ref(1);

const onClose = async () => {
  await ShoppingListService.completeShoppingList({ id: currentShoppingList.value.id });
  await ShoppingListService.createShoppingList({ requestBody: { household: householdId.value } });
  router.push({ name: 'shopping-list' });
};
const onAdd = async (item: FoodProductDTO) => {
  BasketService.addItemToBasket({
    basketId: basket.value.id,
    requestBody: {
      foodProductId: item.id,
      amount: 1,
    },
  });
  basket.value = await BasketService.getBasket({ basketId: basket.value.id });
  diffList.value = await ShoppingListService.getShoppingListDiff({
    id: currentShoppingList.value.id,
  });
};

const onRemoveOther = async (item: CustomFoodItemDTO) => {
  if (diffList.value.customFoodItems) {
    const basketItem = diffList.value.customFoodItems.find((i) => i.id === item.id);
    if (!basketItem) {
      throw new Error('No basket item');
    }
    await BasketService.removeCustomItemFromBasket({
      basketId: basket.value.id,
      basketItemId: basketItem.id,
    });
    CustomfooditemService.checkOrUncheckItemOnShoppingList1({ id: item.id });
  } else {
    throw new Error('No basket');
  }
  currentShoppingList.value = await HouseholdService.getCurrentShoppingList({
    id: householdId.value,
  });
};

const scanOpen = ref(false);

const deleteSelectedBasked = async () => {
  for (const item of selectedBasked.value) {
    if (item.foodProduct) {
      await BasketService.removeItemFromBasket({
        basketId: basket.value.id,
        basketItemId: item.id,
      });
    } else {
      await BasketService.removeCustomItemFromBasket({
        basketId: basket.value.id,
        basketItemId: item.id,
      });
      CustomfooditemService.checkOrUncheckItemOnShoppingList1({ id: item.id });
    }
  }
  basket.value = await BasketService.getBasket({ basketId: basket.value.id });
  diffList.value = await ShoppingListService.getShoppingListDiff({
    id: currentShoppingList.value.id,
  });
};

const manualShoppingListItemToBasket = async (item: CustomFoodItemDTO | ShoppingListItemDTO) => {
  item = item as ShoppingListItemDTO;
  if (!item.ingredient) {
    throw new Error('Denne gjenstanden er ikke en gyldig ingrediens');
  }
  const foodProduct = await FoodproductService.getLooseFoodProductByIngredient({
    ingredientId: item.ingredient.id,
  });

  await BasketService.addItemToBasket({
    basketId: basket.value.id,
    requestBody: {
      foodProductId: foodProduct.id,
      amount: item.amount,
    },
  });
  basket.value = await BasketService.getBasket({ basketId: basket.value.id });
  diffList.value = await ShoppingListService.getShoppingListDiff({
    id: currentShoppingList.value.id,
  });
};

const manualCustomProductItemToBasket = async (item: CustomFoodItemDTO | ShoppingListItemDTO) => {
  item = item as CustomFoodItemDTO;
  await BasketService.addItemToBasket1({
    basketId: basket.value.id,
    requestBody: item.id,
  });
  await CustomfooditemService.checkOrUncheckItemOnShoppingList1({ id: item.id });
  currentShoppingList.value = await HouseholdService.getCurrentShoppingList({
    id: householdId.value,
  });
};
</script>
