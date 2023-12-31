<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <h1>Registrer ny bruker</h1>
    <form @submit.prevent="submit">
      <v-text-field
        v-model="username"
        :counter="32"
        :error-messages="errors?.username"
        label="Brukernavn"
        prepend-inner-icon="mdi-account"
        data-testid="username"></v-text-field>
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
        :error-messages="errors?.lastName"
        label="Etternavn"
        prepend-inner-icon="mdi-cursor-text"
        data-testid="lastname"></v-text-field>
      <v-text-field
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisible ? 'text' : 'password'"
        @click:append-inner="passwordVisible = !passwordVisible"
        density="compact"
        v-model="password"
        :error-messages="errors?.password"
        label="Passord"
        prepend-inner-icon="mdi-lock"
        data-testid="password"></v-text-field>
      <v-text-field
        :append-inner-icon="passwordRepeatVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordRepeatVisible ? 'text' : 'password'"
        @click:append-inner="passwordRepeatVisible = !passwordRepeatVisible"
        v-model="repeatPassword"
        :error-messages="errors?.repeatPassword"
        label="Gjenta passord"
        prepend-inner-icon="mdi-lock-alert"
        data-testid="repeat-password">
      </v-text-field>
      <p v-if="errorMessage !== ''">
        {{ errorMessage }}
      </p>
      <v-btn class="me-4" type="submit" data-testid="create-user-button"> registrer </v-btn>
    </form>

    <span>Har du allerede en bruker? </span>
    <router-link to="/login">logg inn</router-link>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString, ref as yupRef } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';
import { OpenAPI, UserService, TokenControllerService, RegisterDTO, AuthenticateDTO } from '@/api';
import useFeedbackStore from '@/stores/FeedbackStore';
import { RegexValidation } from '@/utils/RegexValidation';

const feedbackStore = useFeedbackStore();

const userStore = useUserInfoStore();
const passwordVisible = ref(false);
const passwordRepeatVisible = ref(false);
const router = useRouter();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    username: yupString()
      .required('Brukernavn er obligatorisk')
      .min(4, 'Brukernavn må være minst 4 tegn')
      .max(32, 'Brukernavn kan ikke være mer enn 32 tegn')
      .test('isValidUsername', 'Brukernavnet er ikke gyldig', (value) =>
        RegexValidation.USERNAME.test(value),
      ),
    mail: yupString()
      .required('E-post er obligatorisk')
      .max(128, 'E-post kan ikke være mer enn 128 tegn')
      .test('isValidEmail', 'E-post må være en gyldig e-postadresse', (value) =>
        RegexValidation.EMAIL.test(value),
      ),
    firstName: yupString()
      .required('Fornavn er obligatorisk')
      .min(1, 'Fornavn må være minst ett tegn')
      .max(64, 'Fornavn kan ikke være mer enn 64 tegn')
      .test('isValidName', 'Fornavnet er ikke gyldig. Vi støtter A til Å', (value) =>
        RegexValidation.NAME.test(value),
      ),
    lastName: yupString()
      .required('Etternavn er obligatorisk')
      .min(1, 'Etternavn må være minst ett tegn')
      .max(64, 'Etternavn kan ikke være mer enn 64 tegn')
      .test('isValidName', 'Etternavnet er ikke gyldig. Vi støtter A til Å', (value) =>
        RegexValidation.NAME.test(value),
      ),
    password: yupString()
      .required('Passord er obligatorisk')
      .min(8, 'Passord må være minst 8 tegn')
      .test(
        'isValidPass',
        'Passordet må inneholdet minst en liten bokstav, stor bokstav og ett tall',
        (value) => {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          return hasUpperCase && hasLowerCase && hasNumber;
        },
      )
      .test('isValidPass', 'Passordet er ikke gyldig', (value) =>
        RegexValidation.PASSWORD.test(value),
      ),
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
      router.push({ name: 'home' });
    });
  });
});

/* form values */
const { value: username } = useField('username') as FieldContext<string>;
const { value: mail } = useField('mail') as FieldContext<string>;
const { value: firstName } = useField('firstName') as FieldContext<string>;
const { value: lastName } = useField('lastName') as FieldContext<string>;
const { value: password } = useField('password') as FieldContext<string>;
const { value: repeatPassword } = useField('repeatPassword') as FieldContext<string>;
</script>
