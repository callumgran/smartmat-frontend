<template>
  <h1>Registrer ny bruker</h1>

  <form @submit.prevent="submit">
    <v-text-field
      v-model="username"
      :counter="64"
      :error-messages="errors?.username"
      label="Brukernavn"
      data-testid="username"></v-text-field>
    <v-text-field v-model="mail" :error-messages="errors?.mail" label="E-post" data-testid="email"></v-text-field>
    <v-text-field
      v-model="firstName"
      :counter="64"
      :error-messages="errors?.firstName"
      label="Fornavn"
      data-testid="firstname"></v-text-field>
    <v-text-field
      v-model="lastName"
      :counter="64"
      :error-messages="errors?.lastName"
      label="Etternavn"
      data-testid="lastname"></v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      :error-messages="errors?.password"
      label="Passord"
      data-testid="password"></v-text-field>
    <v-text-field
      v-model="repeatPassword"
      type="password"
      :error-messages="errors?.repeatPassword"
      label="Gjenta passord"
      data-testid="repeat-password">
    </v-text-field>
    <p v-if="errorMessage !== ''">
      {{ errorMessage }}
    </p>
    <v-btn class="me-4" type="submit" data-testid="create-user-button"> registrer </v-btn>
  </form>

  <span>Har du allerede en bruker? </span>
  <router-link to="/login">logg inn</router-link>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString, ref as yupRef } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';
import { OpenAPI, UserService, TokenControllerService, RegisterDTO, AuthenticateDTO } from '@/api';
import useFeedbackStore from '@/stores/FeedbackStore';

const feedbackStore = useFeedbackStore();

const userStore = useUserInfoStore();
const router = useRouter();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    username: yupString()
      .required('Brukernavn er obligatorisk')
      .min(4, 'Brukernavn må være minst 4 tegn')
      .max(32, 'Brukernavn kan ikke være mer enn 32 tegn'),
    mail: yupString()
      .required('E-post er obligatorisk')
      .email('E-post må være en gyldig e-postadresse')
      .max(128, 'E-post kan ikke være mer enn 128 tegn'),
    firstName: yupString()
      .required('Fornavn er obligatorisk')
      .min(1, 'Fornavn må være minst ett tegn')
      .max(64, 'Fornavn kan ikke være mer enn 64 tegn'),
    lastName: yupString()
      .required('Etternavn er obligatorisk')
      .min(1, 'Etternavn må være minst ett tegn')
      .max(64, 'Etternavn kan ikke være mer enn 64 tegn'),
    password: yupString()
      .required('Passord er obligatorisk')
      .min(8, 'Passord må være minst 8 tegn')
      .test('isValidPass', 'Passordet må inneholdet minst en liten bokstav, stor bokstav og ett tall', (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        return hasUpperCase && hasLowerCase && hasNumber;
      }),
    repeatPassword: yupString()
      .required('Gjenta passord er obligatorisk')
      .oneOf([yupRef('password')], 'Passordene må være like'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
  const createUserPayload: RegisterDTO = {
    username: values.username,
    email: values.mail,
    firstName: values.firstName,
    lastName: values.lastName,
    password: values.password,
  };

  await UserService.createUser({ requestBody: createUserPayload }).then(() => {
    let auth: AuthenticateDTO = { username: values.username, password: values.password };

    TokenControllerService.generateToken({ requestBody: auth }).then(async (token) => {
      /* got 201, but token is not present */
      if (token == null || token == undefined) {
        errorMessage.value = 'Intern feil, prøv igjen senere';
        return;
      }
      OpenAPI.TOKEN = token;

      /* fetch and store user data */
      let user = await UserService.getUser1();
      userStore.setUserInfo({
        accessToken: token,
        firstname: user.firstName,
        lastname: user.lastName,
        username: user.username,
        role: user.role,
      });
      feedbackStore.addFeedback('Bruker registrert', 'success');
      router.push({ name: 'base' });
    });
  });
});

const clearPassword = () => {
  password.value = '';
  repeatPassword.value = '';
};

/* form values */
const { value: username } = useField('username') as FieldContext<string>;
const { value: mail } = useField('mail') as FieldContext<string>;
const { value: firstName } = useField('firstName') as FieldContext<string>;
const { value: lastName } = useField('lastName') as FieldContext<string>;
const { value: password } = useField('password') as FieldContext<string>;
const { value: repeatPassword } = useField('repeatPassword') as FieldContext<string>;
</script>
