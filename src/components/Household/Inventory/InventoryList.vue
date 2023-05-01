<template>
  <!-- TODO: this should be it's own 'search-and-filter' generic component maybe -->
  <v-card class="mx-auto" color="grey-lighten-3" max-width="400">
    <v-card-item class="search-and-filter">
      <v-text-field
        v-model="searchInput"
        density="compact"
        variant="solo"
        label="Søk i beholdningen"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        data-testid="search-input"></v-text-field>

      <div class="d-flex justify-center align-center filter-wrapper">
        <v-btn-toggle v-model="filterChoice" mandatory color="primary">
          <v-btn value="alphabetical" size="x-small">Alfabetisk</v-btn>
          <v-btn value="expiration" size="x-small">Utløpsdato</v-btn>
          <v-btn value="amount" size="x-small" data-testid="sort-by-amount">Mengde</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-item>
  </v-card>

  <household-food-product-card
    v-for="hfProduct in hfProductsViewable"
    :key="hfProduct.id"
    :hfProduct="hfProduct"
    :hasAccessToEdit="hasAccessToEdit"
    @remove="removeHfProduct(hfProduct)"
    data-testid="inventory-table" />
  <div v-if="household.foodProducts?.length === 0">Du har ingen varer i beholdningen din :-(</div>

  <v-btn
    v-if="hasAccessToEdit"
    @click="addOverlay = true"
    elevation="2"
    fab
    style="position: fixed; right: 30px; bottom: 50px; z-index: 999"
    color="primary"
    data-testid="add-foodproduct">
    <v-icon icon="mdi-plus" />
  </v-btn>

  <v-dialog v-model="addOverlay">
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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdDTO, HouseholdFoodProductDTO, HouseholdMemberDTO } from '@/api';
import HouseholdFoodProductCard from '@/components/Household/HouseholdFoodProductCard.vue';
import AddFoodproductModal from '@/components/Household/Inventory/AddFoodproductModal.vue';

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: true,
  },
});

const userStore = useUserInfoStore();
const username = userStore.username;
const route = useRoute();
const id = route.params.id as string;
const household = ref<HouseholdDTO>({} as HouseholdDTO);
household.value = props.household;

/* super cursed search and filter */
const hfProductsViewable = ref<HouseholdFoodProductDTO[]>([]);
hfProductsViewable.value = props.household.foodProducts || [];
const filterChoice = ref('');
const searchInput = ref('');

const addOverlay = ref(false);

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

const removeHfProduct = (hfProdct: HouseholdFoodProductDTO) => {
  household.value!.foodProducts = household.value!.foodProducts?.filter(
    (item) => item !== hfProdct,
  );
  hfProductsViewable.value = hfProductsViewable.value.filter((item) => item !== hfProdct);
};

const addHfProduct = (hfProduct: HouseholdFoodProductDTO) => {
  household.value?.foodProducts?.push(hfProduct);
  filterViewable();
};

const filterViewable = () => {
  switch (filterChoice.value) {
    case 'alphabetical':
      hfProductsViewable.value.sort((a, b) => {
        const nameA = a.foodProduct?.name?.toLowerCase() || '';
        const nameB = b.foodProduct?.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      break;

    case 'expiration':
      hfProductsViewable.value.sort((a, b) => {
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        return dateA.getTime() - dateB.getTime();
      });
      break;

    case 'amount':
      hfProductsViewable.value.sort((a, b) => {
        const amountA = a.amountLeft || 0;
        const amountB = b.amountLeft || 0;
        return amountB - amountA;
      });
      break;
  }
};

watch([filterChoice], async () => {
  filterViewable();
});

watch([searchInput], async () => {
  if (household.value.foodProducts === undefined) {
    return;
  }
  if (searchInput.value === '') {
    hfProductsViewable.value = household.value.foodProducts;
    return;
  }
  hfProductsViewable.value = fuzzySearch(household.value.foodProducts, searchInput.value);
});

const fuzzySearch = (list: HouseholdFoodProductDTO[], query: string): HouseholdFoodProductDTO[] => {
  return list.filter((item) => item.foodProduct?.name?.toLowerCase().includes(query.toLowerCase()));
};
</script>

<style scoped>
.filter-wrapper {
  margin-top: 0.5rem;
}
</style>
