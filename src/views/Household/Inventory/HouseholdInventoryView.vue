<template>
  <h2>Beholdning '{{ household.name }}'</h2>

  <div v-if="household.foodProducts?.length != 0">
    <!-- TODO: add filters -->
    <div>
      Søk:
      <v-text-field />

      Sorter etter:
      <div>
        <v-btn>Alfabetisk</v-btn>
        <v-btn>Utløpsdato</v-btn>
        <v-btn>Mengde</v-btn>
      </div>
    </div>

    <br />
    <household-food-product-card
      v-for="(hfProduct, index) in household.foodProducts"
      :key="hfProduct.id"
      :hfProduct="hfProduct"
      :hasAccessToEdit="hasAccessToEdit"
      @remove="removeHfProduct(index)"
      data-testid="inventory-table" />
  </div>
  <div v-else>Du har ingen varer i beholdningen din :-(</div>

  <v-btn
    @click="addOverlay = true"
    elevation="2"
    fab
    style="position: fixed; right: 30px; bottom: 50px"
    color="primary"
    data-testid="add-foodproduct">
    <v-icon icon="mdi-plus" />
  </v-btn>

  <v-dialog v-if="hasAccessToEdit" v-model="addOverlay">
    <add-foodproduct-modal
      @close="addOverlay = false"
      @add="
        addHfProduct($event);
        addOverlay = false;
      "
      :householdId="household.id" />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdService, HouseholdDTO, HouseholdFoodProductDTO, HouseholdMemberDTO } from '@/api';
import HouseholdFoodProductCard from '@/components/Household/HouseholdFoodProductCard.vue';
import AddFoodproductModal from '@/components/Household/Inventory/AddFoodproductModal.vue';

const userStore = useUserInfoStore();
const username = userStore.username;
const route = useRoute();
const id = route.params.id as string;
const household = ref<HouseholdDTO>({} as HouseholdDTO);

const addOverlay = ref(false);

HouseholdService.getHousehold({ id }).then((res) => {
  household.value = res;
});

const hasAccessToEdit = computed(() => {
  const r = household.value.members?.find((member) => member.username === username)?.householdRole;
  if (r === undefined) {
    return false;
  }
  return (
    r === HouseholdMemberDTO.householdRole.OWNER ||
    r === HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER
  );
});

const removeHfProduct = (index: number) => {
  household.value?.foodProducts?.splice(index, 1);
};

const addHfProduct = (hfProduct: HouseholdFoodProductDTO) => {
  household.value?.foodProducts?.push(hfProduct);
};
</script>
