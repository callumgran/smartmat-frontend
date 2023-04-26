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
    <div v-for="(hfProduct, index) in household.foodProducts" :key="hfProduct.id">
      <household-food-product-card :hfProduct="hfProduct" @remove="removeHfProduct(index)" />
    </div>
  </div>
  <div v-else>Du har ingen varer i beholdningen din :-(</div>

  <v-btn
    :to="{ name: 'household-inventory-add', params: { id } }"
    elevation="2"
    fab
    style="position: fixed; right: 50px; bottom: 50px"
    color="primary">
    <v-icon icon="mdi-plus" />
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdService, HouseholdDTO } from '@/api';
import { HouseholdMemberRole } from '@/utils/EnumTranslation';
import HouseholdFoodProductCard from '@/components/Household/HouseholdFoodProductCard.vue';

const userStore = useUserInfoStore();
const username = userStore.username;
const route = useRoute();
const id = route.params.id as string;
const household = ref<HouseholdDTO>({} as HouseholdDTO);

HouseholdService.getHousehold({ id }).then((res) => {
  household.value = res;
});

const role = computed(() => {
  const r = household.value.members?.find((member) => member.username === username)?.householdRole;
  if (r === undefined) {
    return '';
  }
  return HouseholdMemberRole[r];
});

const removeHfProduct = (index: number) => {
  household.value?.foodProducts?.splice(index, 1);
};
</script>
