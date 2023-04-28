<template>
  <v-card>
    <v-card-title>
      <span class="headline">Legg til produkt</span>
    </v-card-title>

    <v-card-text>
      <v-text-field v-model="name" label="Produktnavn" required data-testid="product_name">
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(suggestion, index) in suggestions"
              :key="index"
              :data-testid="'suggestion-' + index.toString()"
              @click="choseProduct(suggestion)"
              >{{ suggestion.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-text-field>

      <v-text-field
        type="number"
        label="Antall stk"
        v-model="amount"
        :rules="[zeroOrNegativeNotAllowed]"
        required
        v-if="productChosen"
        data-testid="amount"></v-text-field>

      <p v-if="amount >= 1 && productChosen?.amount">
        {{ amount }} stk tilsvarer {{ productChosen?.amount * amount }}
        {{ productChosen.ingredient?.unit?.abbreviation }}
      </p>

      <v-text-field
        type="date"
        label="Utløpsdato"
        v-model="expirationDate"
        :rules="[zeroOrNegativeNotAllowed]"
        v-if="productChosen"
        data-testid="date"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Avbryt</v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="add"
        :disabled="!productChosen || amount <= 0"
        data-testid="add-item"
        >Legg til</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FoodproductService,
  FoodProductDTO,
  FilterRequest,
  SortRequest,
  HouseholdfoodproductService,
  HouseholdFoodProductDTO,
} from '@/api';
import { watch } from 'vue';

const suggestions = ref([] as FoodProductDTO[]);
const productChosen = ref(null as FoodProductDTO | null);

const props = defineProps<{
  householdId: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add', res: HouseholdFoodProductDTO): HouseholdFoodProductDTO;
}>();

const name = ref('');
const amount = ref(0);
const expirationDate = ref('');

const add = async () => {
  const amountUnit = Number(amount.value) * (productChosen.value?.amount ?? 1);
  const parts = expirationDate.value.split('-');
  const year = parts[0];
  const month = parts[1].padStart(2, '0');
  const day = parts[2].padStart(2, '0');
  const newDateStr = `${year}-${month}-${day}`;

  const res: HouseholdFoodProductDTO = await HouseholdfoodproductService.createHouseholdFoodProduct(
    {
      householdId: props.householdId,
      requestBody: {
        foodProductId: productChosen.value?.id,
        amountLeft: amountUnit,
        expirationDate: newDateStr,
      },
    },
  );

  emit('add', res);
};

const close = () => {
  emit('close');
};

const choseProduct = (product: FoodProductDTO) => {
  name.value = product.name;
  productChosen.value = product;
};

const zeroOrNegativeNotAllowed = (value: number) => {
  if (value <= 0) {
    return 'Må være større enn 0';
  }
  return true;
};

watch([name], async () => {
  if (name.value.length == 0) {
    return;
  }

  let res = await FoodproductService.searchFoodProducts({
    requestBody: {
      sortRequests: [{ keyWord: 'name', sortDirection: SortRequest.sortDirection.ASC }],
      page: 0,
      size: 0,
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
});
</script>
