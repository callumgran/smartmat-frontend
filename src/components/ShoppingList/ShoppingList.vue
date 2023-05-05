<template>
  <div class="d-flex flex-column">
    <div class="d-flex align-center">
      <v-text-field
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Søk i handleliste"
        single-line
        hide-details></v-text-field>
      <v-btn icon="mdi-history" @click="showLog = true"></v-btn>
    </div>

    <v-dialog v-model="showLog">
      <shopping-list-log />
    </v-dialog>

    <v-divider />

    <div v-if="selected.length">
      <div class="d-flex">
        <v-btn data-testid="button" @click="deleteSelected"> Slett markerte produkter </v-btn>
      </div>

      <v-divider></v-divider>
    </div>

    <v-list class="h-80vh">
      <!-- <v-list-item-group v-if="shoppingListItemSuggestions.length"> -->
      <!--   <v-list-item v-for="(item, index) in shoppingListItemSuggestions" :key="index"> -->
      <!--     <v-list-item-content class="d-flex justify-space-between"> -->
      <!--       <div> -->
      <!--         <div class="d-flex justify-space-between"> -->
      <!--           <v-list-item-title>{{ item.name }}</v-list-item-title> -->
      <!--           <v-list-item-title>{{ item.amount }} {{ item.unit.shortName }}</v-list-item-title> -->
      <!--         </div> -->
      <!--         <v-list-item-subtitle>Foreslått av {{ item.suggestedBy.name }}</v-list-item-subtitle> -->
      <!--       </div> -->
      <!--       <v-list-item-action> -->
      <!--         <v-btn class="bg-green" @click="addShoppingListSuggestion(item)"><v-icon>mdi-check-bold</v-icon></v-btn> -->
      <!--         <v-btn class="bg-red" @click="addShoppingListItem"><v-icon>mdi-close</v-icon></v-btn> -->
      <!--       </v-list-item-action> -->
      <!--     </v-list-item-content> -->
      <!--   </v-list-item> -->
      <!--   <v-divider /> -->
      <!-- </v-list-item-group> -->
      <v-list-item-title v-if="shoppingListItems.length"> Ingredienser </v-list-item-title>
      <v-list-item v-for="(item, index) in shoppingListItems" :key="index">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center justify-center">
            <v-checkbox
              v-if="editable"
              hide-details
              density="compact"
              v-model="selected"
              :value="item"></v-checkbox>
            <v-list-item-title> {{ item.ingredient?.name }}</v-list-item-title>
          </div>
          <v-list-item-title
            >{{ item.amount }} {{ item.ingredient?.unit?.abbreviation }}</v-list-item-title
          >
        </div>
        <v-divider />
      </v-list-item>
      <v-list-item-title v-if="customShoppingListItems.length"> Annet </v-list-item-title>
      <v-list-item v-for="(item, index) in customShoppingListItems" :key="index">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center justify-center">
            <v-checkbox
              v-if="editable"
              hide-details
              density="compact"
              v-model="selected"
              :value="item"></v-checkbox>
            <v-list-item-title> {{ item.name }}</v-list-item-title>
          </div>
          <v-list-item-title>{{ item.amount }} stk</v-list-item-title>
        </div>
        <v-divider />
      </v-list-item>
    </v-list>
    <v-bottom-navigation v-if="editable && hasAccessToEdit" class="justify-space-around" grow>
      <v-btn class="" @click="addOverlay = true">Legg til vare</v-btn>
      <v-btn @click="startShoppingTrip" :disabled="loadingStart">Start Handletur</v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="addOverlay">
      <add-shopping-list-item-modal @close="addOverlay = false" :shoppingListId="shoppingListId" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import {
  BasketService,
  CustomFoodItemDTO,
  HouseholdMemberDTO,
  HouseholdService,
  ShoppingListDTO,
  ShoppingListItemDTO,
  ShoppingListService,
  ShoppinglistitemService,
} from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import AddShoppingListItemModal from '@/components/ShoppingList/AddShoppingListItemModal.vue';
import ShoppingListLog from './ShoppingListLog.vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';

const props = defineProps<{
  shoppingListId?: string;
}>();

const editable = ref(props.shoppingListId ? false : true);
const householdId = useHouseholdStore().getSelectedId;
const shoppingList = ref<ShoppingListDTO>(
  props.shoppingListId
    ? await ShoppingListService.getShoppingList({ id: props.shoppingListId })
    : await HouseholdService.getCurrentShoppingList({ id: householdId }),
);

const household = await HouseholdService.getHousehold({ id: householdId });
const hasAccessToEdit = computed(() => {
  const r = household.members?.find(
    (member) => member.username === useUserInfoStore().username,
  )?.householdRole;
  return (
    r === HouseholdMemberDTO.householdRole.OWNER ||
    r === HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER
  );
});
const router = useRouter();

if (shoppingList.value.basket && !props.shoppingListId) {
  useRouter().push({ name: 'shopping-trip' });
}

const loadingStart = ref(false);
const startShoppingTrip = async () => {
  loadingStart.value = true;
  await BasketService.createBasket({ requestBody: { shoppingListId: shoppingList.value.id } });
  router.push({ name: 'shopping-trip' });
};

const shoppingListId = shoppingList.value.id;
const search = ref('');

const selected = ref([] as (ShoppingListItemDTO | CustomFoodItemDTO)[]);

const showLog = ref(false);

const getShoppingListItems = (shoppingList: ShoppingListDTO) => {
  return shoppingList.shoppingListItems;
};

const getCustomShoppingListItems = (shoppingList: ShoppingListDTO) => {
  return shoppingList.customFoodItems;
};

const shoppingListItems = ref(getShoppingListItems(shoppingList.value));
const customShoppingListItems = ref(getCustomShoppingListItems(shoppingList.value));

watch(shoppingList, () => {
  shoppingListItems.value = getShoppingListItems(shoppingList.value);
  customShoppingListItems.value = getCustomShoppingListItems(shoppingList.value);
});
const addOverlay = ref(false);

watch(addOverlay, async () => {
  if (!addOverlay.value) {
    shoppingList.value = await HouseholdService.getCurrentShoppingList({ id: householdId });
  }
});

const deleteSelected = async () => {
  selected.value.map(async (item) => {
    await ShoppinglistitemService.deleteItemFromShoppingList({
      id: item.id,
      householdId: householdId,
    });
  });

  shoppingListItems.value = shoppingListItems.value.filter(
    (item) => !selected.value.includes(item),
  );
  customShoppingListItems.value = customShoppingListItems.value.filter(
    (item) => !selected.value.includes(item),
  );
  selected.value = [];
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
