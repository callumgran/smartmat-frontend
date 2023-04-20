<template>
  <h1>Logg inn</h1>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="username"
      :counter="64"
      :error-messages="errors?.username"
      label="Brukernavn"
      data-testid="username">
    </v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      :error-messages="errors?.password"
      label="Passord"
      data-testid="password">
    </v-text-field>
    <p v-if="errorMessage !== ''">
      {{ errorMessage }}
    </p>
    <v-btn class="me-4" type="submit" :disabled="!submitEnabled" data-testid="login-user-button">
      logg inn
    </v-btn>
  </form>

  <span>Har du ikke bruker? </span>
  <router-link to="/register" data-testid="goto-register-user-button">register deg</router-link>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';
import { TokenControllerService, AuthenticateDTO, OpenAPI, UserService, ApiError } from '@/api';

const userStore = useUserInfoStore();
const router = useRouter();
const route = useRoute();
const errorMessage = ref('');

/* form validation schema */
const schema = computed(() =>
  yupObject({
    username: yupString()
      .required('Brukernavn er obligatorisk')
      .min(4, 'Brukernavn må være minst 4 tegn')
      .max(32, 'Brukernavn kan ikke være mer enn 32 tegn'),
    password: yupString().required('Passord er obligatorisk'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit(async (values) => {
  const loginUserPayload: AuthenticateDTO = {
    username: values.username,
    password: values.password,
  };

  try {
    let token = await TokenControllerService.generateToken({ requestBody: loginUserPayload });
    /* got 201, but token is not present */
    if (token == null || token == undefined) {
      errorMessage.value = 'Intern feil, prøv igjen senere';
      return;
    }

    /* store token */
    OpenAPI.TOKEN = token;
    /* fetch and store logged in user info */
    let user = await UserService.getUser1();
    userStore.setUserInfo({
      accessToken: token,
      firstname: user.firstName,
      lastname: user.lastName,
      username: user.username,
      role: user.role,
    });

    /* redirect to where we came from, alternatevely back to home */
    router.push((route.query.redirect as string) || '/');
  } catch (error: ApiError | any) {
    if (error.status == 401) {
      errorMessage.value = 'Feil brukernavn eller passord';
      return;
    }
    throw error;
  } finally {
    clearPassword();
  }
});

const submitEnabled = computed(() => {
  return !errors.value.username && !errors.value.password && username.value && password.value;
});

const clearPassword = () => {
  password.value = '';
};

/* form values */
const { value: username } = useField('username') as FieldContext<string>;
const { value: password } = useField('password') as FieldContext<string>;
</script>
