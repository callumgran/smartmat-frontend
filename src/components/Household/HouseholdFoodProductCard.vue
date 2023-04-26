<template>
  <v-expansion-panels>
    <v-expansion-panel :title="hfProduct.foodProduct?.name">
      <v-expansion-panel-text>
        <div>
          <p>
            Gjenstående: {{ hfProduct.amountLeft }}
            {{ hfProduct.foodProduct?.ingredient?.unit?.abbreviation }}
          </p>
          <p>Planlagt i ukesmeny: 0</p>

          <p>Utløpsdato: {{ hfProduct.expirationDate }}</p>

          <div v-if="!editMode">
            <v-btn @click="editMode = true">Brukt opp?</v-btn>
            <v-btn @click="throwOut()">Kastet?</v-btn>
          </div>
          <div v-else>
            <span v-if="setNewAmountMode"
              >Hvor mange {{ hfProduct.foodProduct?.ingredient?.unit?.name }} har du igjen?</span
            >
            <span v-else
              >Hvor mange {{ hfProduct.foodProduct?.ingredient?.unit?.name }} har du brukt
              opp?</span
            >
            <v-btn @click="setNewAmountMode = !setNewAmountMode">
              <v-icon icon="mdi-rotate-3d-variant" />
            </v-btn>
            <form @submit.prevent="submit">
              <v-text-field
                type="number"
                :error-messages="errors.amountInput"
                v-model="amountInput" />
              <v-btn type="submit">oppdater</v-btn>
            </form>
            <v-btn @click="editMode = false">tilbake</v-btn>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import {
  HouseholdFoodProductDTO,
  UpdateHouseholdFoodProductDTO,
  HouseholdfoodproductService,
} from '@/api';
import { ref, computed } from 'vue';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, number as yupNumber } from 'yup';

const props = defineProps({
  hfProduct: {
    type: Object as () => HouseholdFoodProductDTO,
    required: true,
  },
});

const emits = defineEmits(['remove']);

const editMode = ref(false);
const setNewAmountMode = ref(false);

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

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
  useUp(values.amountInput);
});

const useUp = (amount: number) => {
  if (props.hfProduct.amountLeft == null) return;

  const newAmountLeft = setNewAmountMode.value ? amount : props.hfProduct.amountLeft - amount;

  HouseholdfoodproductService.updateHouseholdFoodProduct({
    householdId: props.hfProduct.householdId,
    id: props.hfProduct.id ?? '',
    requestBody: {
      ...props.hfProduct,
      amountLeft: newAmountLeft,
    } as UpdateHouseholdFoodProductDTO,
  }).then(() => {
    if (newAmountLeft == 0) emits('remove', props.hfProduct.id);
  });
};

const throwOut = () => {
  HouseholdfoodproductService.deleteHouseholdFoodProduct({
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
.horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
