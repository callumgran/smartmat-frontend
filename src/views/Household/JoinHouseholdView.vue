<template>
  <h1>Bli med i en husstand</h1>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="inviteCode"
      :counter="128"
      :error-messages="errors?.inviteCode"
      label="Kode"
      data-testid="kode"></v-text-field>
    <p v-if="errorMessage !== ''">
      {{ errorMessage }}
    </p>
    <v-btn class="me-4" type="submit" data-testid="create-household-button"> bli med </v-btn>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';

const userStore = useUserInfoStore();
const router = useRouter();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    name: yupString().required('Navn på husstand er obligatorisk').length(8, 'Må være 8 tegn'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {});

/* form values */
const { value: inviteCode } = useField('name') as FieldContext<string>;
</script>
