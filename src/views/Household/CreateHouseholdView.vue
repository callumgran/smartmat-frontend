<template>
  <h1>Opprett ny husstand</h1>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="name"
      :counter="64"
      :error-messages="errors?.name"
      label="Navn"
      data-testid="name"></v-text-field>
    <p v-if="errorMessage !== ''">
      {{ errorMessage }}
    </p>
    <v-btn class="me-4" type="submit" data-testid="create-household-button"> opprett </v-btn>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import { HouseholdService, CreateHouseholdDTO } from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import useFeedbackStore from '@/stores/FeedbackStore';

const router = useRouter();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    name: yupString()
      .required('Navn på husstand er obligatorisk')
      .min(1, 'Navnet på husstanden må være minst ett tegn')
      .max(64, 'Navnet på husstanden kan ikke være mer enn 64 tegn'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
  const result = await HouseholdService.createHousehold({
    requestBody: values as CreateHouseholdDTO,
  });
  if (result) {
    useHouseholdStore().appendAndSelectHousehold(result);
    router.push({ name: 'household-detail', params: { id: result.id } });
    useFeedbackStore().addFeedback('Husstanden ble opprettet', 'success');
  }
});

/* form values */
const { value: name } = useField('name') as FieldContext<string>;
</script>
