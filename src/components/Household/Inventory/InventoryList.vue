<template>
  <!-- TODO: this should be it's own 'search-and-filter' generic component maybe -->
  <v-card class="mx-auto" color="grey-lighten-3" max-width="400" data-testid="inventory">
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

  <div class="add-button mt-2">
    <v-btn
      v-if="hasAccessToEdit"
      @click="addOverlay = true"
      elevation="2"
      fab
      prepend-icon="mdi-plus"
      color="primary"
      data-testid="add-foodproduct">
      legg til
    </v-btn>
  </div>

  <household-food-product-accordion
    v-for="hfProduct in hfProductsViewable"
    :key="hfProduct.id"
    :hfProduct="hfProduct"
    :hasAccessToEdit="hasAccessToEdit"
    @remove="removeHfProduct(hfProduct)"
    data-testid="inventory-table" />
  <div v-if="household.foodProducts?.length === 0">Du har ingen varer i beholdningen din :-(</div>

  <v-dialog v-model="addOverlay" max-width="500px">
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
import { ref, computed, watch, watchEffect } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { HouseholdDTO, HouseholdFoodProductDTO, HouseholdMemberDTO } from '@/api';
import AddFoodproductModal from '@/components/Household/Inventory/AddFoodproductModal.vue';
import HouseholdFoodProductAccordion from '@/components/Household/Inventory/HouseholdFoodProductAccordion.vue';

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: true,
  },
});

const userStore = useUserInfoStore();
const username = userStore.username;

/* super cursed search and filter */
const hfProductsViewable = ref<HouseholdFoodProductDTO[]>([]);
watchEffect(() => {
  hfProductsViewable.value = props.household.foodProducts || [];
});
const filterChoice = ref('');
const searchInput = ref('');

const addOverlay = ref(false);

const hasAccessToEdit = computed(() => {
  const r = props.household.members?.find((member) => member.username === username)?.householdRole;
  if (r === undefined) {
    return false;
  }
  return (
    r === HouseholdMemberDTO.householdRole.OWNER ||
    r === HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER
  );
});

const removeHfProduct = (hfProdct: HouseholdFoodProductDTO) => {
  props.household!.foodProducts = props.household!.foodProducts?.filter(
    (item) => item !== hfProdct,
  );
  hfProductsViewable.value = hfProductsViewable.value.filter((item) => item !== hfProdct);
};

const addHfProduct = (hfProduct: HouseholdFoodProductDTO) => {
  props.household?.foodProducts?.push(hfProduct);
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
  if (props.household.foodProducts === undefined) {
    return;
  }
  if (searchInput.value === '') {
    hfProductsViewable.value = props.household.foodProducts;
    return;
  }
  hfProductsViewable.value = fuzzySearch(props.household.foodProducts, searchInput.value);
});

const fuzzySearch = (list: HouseholdFoodProductDTO[], query: string): HouseholdFoodProductDTO[] => {
  return list.filter((item) => item.foodProduct?.name?.toLowerCase().includes(query.toLowerCase()));
};
</script>

<style scoped>
.filter-wrapper {
  margin-top: 0.5rem;
}

.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
