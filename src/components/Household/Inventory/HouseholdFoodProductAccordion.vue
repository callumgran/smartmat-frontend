<template>
  <v-expansion-panels class="mt-2">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="accordion-head">
          <v-img
            :src="
              hfProduct.foodProduct?.image
                ? hfProduct.foodProduct.image
                : '/product-placeholder.png'
            "
            class="product-image" />
          <b>{{ hfProduct.foodProduct?.name }}</b>
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          Gjenstående {{ getAmountLeft() }} {{ hfProduct.foodProduct?.unit?.abbreviation }}
          <v-spacer />
          Utløpsdato: {{ hfProduct.expirationDate }}

          <div v-if="hasAccessToEdit" class="edit-buttons">
            <v-divider />
            <div>
              <v-btn @click="addOverlay = true" style="margin-right: 1rem">Bruk</v-btn>
              <v-btn @click="throwOut()" style="margin-left: 1rem">Kast</v-btn>
            </div>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-dialog v-model="addOverlay" max-width="500px">
    <use-item-modal
      :hfp="hfProduct"
      @close="addOverlay = false"
      @use="
        (amount: number) => useUp(amount)
      " />
  </v-dialog>
</template>

<script setup lang="ts">
import UseItemModal from './UseItemModal.vue';
import { HouseholdFoodProductDTO, HouseholdfoodproductService } from '@/api';
import { ref, computed } from 'vue';
import { useField, FieldContext } from 'vee-validate';
import { object as yupObject, number as yupNumber } from 'yup';
import useFeedbackStore from '@/stores/FeedbackStore';

const props = defineProps({
  hfProduct: {
    type: Object as () => HouseholdFoodProductDTO,
    required: true,
  },
  hasAccessToEdit: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['remove']);

const addOverlay = ref(false);

const getAmountLeft = () => {
  if (
    props.hfProduct?.amountLeft === undefined ||
    props.hfProduct?.foodProduct?.amount === undefined
  ) {
    return 0;
  }
  return props.hfProduct?.amountLeft * props.hfProduct?.foodProduct?.amount;
};

/* form validation schema */
const schema = computed(() =>
  yupObject({
    amountInput: yupNumber()
      .required('Antall er obligatorisk')
      .min(0, 'Kan ikke ha negativt antall')
      .max(props.hfProduct.amountLeft ?? 0, 'Kan ikke bruke/legge til mer enn du har')
      .typeError('Antall må være et tall'),
  }),
);

const useUp = async (amount: number) => {
  addOverlay.value = false;
  await HouseholdfoodproductService.useHouseholdFoodProduct({
    householdId: props.hfProduct.householdId,
    id: props.hfProduct.id!,
    requestBody: amount,
  });

  useFeedbackStore().addFeedback(
    `Brukte ${Math.round(amount * props.hfProduct.foodProduct?.amount!)} ${props.hfProduct
      .foodProduct?.unit?.abbreviation!} ${props.hfProduct.foodProduct?.name!}`,
    'success',
  );

  props.hfProduct.amountLeft! -= amount;
  if (props.hfProduct.amountLeft! <= 0) {
    emits('remove', props.hfProduct.id);
  }
};

const throwOut = () => {
  HouseholdfoodproductService.throwHouseholdFoodProduct({
    householdId: props.hfProduct.householdId,
    id: props.hfProduct.id ?? '',
  }).then(() => {
    emits('remove', props.hfProduct.id);
  });
};

/* form values */
const { value: amountInput } = useField('amountInput') as FieldContext<string>;
amountInput.value = props.hfProduct.amountLeft?.toString() ?? '';
</script>

<style scoped>
.product-image {
  max-width: 100px;
}

.edit-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
