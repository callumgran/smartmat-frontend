<template>
  <h1>Endre bruker</h1>
  <v-card-text :title="user.username"></v-card-text>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="mail"
      :error-messages="errors?.mail"
      label="E-post"
      prepend-inner-icon="mdi-email-outline"
      data-testid="email"></v-text-field>
    <v-text-field
      v-model="firstName"
      :counter="64"
      :error-messages="errors?.firstName"
      label="Fornavn"
      prepend-inner-icon="mdi-cursor-text"
      data-testid="firstname"></v-text-field>
    <v-text-field
      v-model="lastName"
      :counter="64"
      :v-text="user.lastName"
      :error-messages="errors?.lastName"
      label="Etternavn"
      prepend-inner-icon="mdi-cursor-text"
      data-testid="lastname"></v-text-field>
    <p v-if="errorMessage !== ''">
      {{ errorMessage }}
    </p>
    <v-btn class="me-4" type="submit" data-testid="create-user-button"> oppdater </v-btn>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';
import { UserService, UserPatchDTO } from '@/api';
import useFeedbackStore from '@/stores/FeedbackStore';

const emit = defineEmits(['update:activePage']);

let user = await UserService.getUser1();

const feedbackStore = useFeedbackStore();

const userStore = useUserInfoStore();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    mail: yupString()
      .email('E-post må være en gyldig e-postadresse')
      .max(128, 'E-post kan ikke være mer enn 128 tegn'),
    firstName: yupString()
      .min(1, 'Fornavn må være minst ett tegn')
      .max(64, 'Fornavn kan ikke være mer enn 64 tegn'),
    lastName: yupString()
      .min(1, 'Etternavn må være minst ett tegn')
      .max(64, 'Etternavn kan ikke være mer enn 64 tegn'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
  const createPatchPayload: UserPatchDTO = {
    email: values.mail,
    firstName: values.firstName,
    lastName: values.lastName,
  };

  let usernameStr: string = '';
  if (user.username !== undefined) {
    usernameStr = user.username;
  }
  await UserService.updateUser({ username: usernameStr, requestBody: createPatchPayload }).then(
    () => {
      emit('update:activePage', 'UserDetail');
      UserService.getUser({ username: usernameStr }).then((user) => {
        userStore.setUserInfo({
          firstname: user.firstName,
          lastname: user.lastName,
          username: user.username,
          role: user.role,
        });
      });
    },
  );
  feedbackStore.addFeedback('Bruker er oppdatert', 'success');
});

/* form values */
const { value: mail } = useField('mail') as FieldContext<string>;
const { value: firstName } = useField('firstName') as FieldContext<string>;
const { value: lastName } = useField('lastName') as FieldContext<string>;
mail.value = user.email!;
firstName.value = user.firstName!;
lastName.value = user.lastName!;
</script>
