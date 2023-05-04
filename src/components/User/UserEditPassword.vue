<template>
  <h1>Endre passord</h1>
  <v-card-text :title="user.username"></v-card-text>
  <form @submit.prevent="submit">
    <v-text-field
      :append-inner-icon="oldPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="oldPasswordVisible ? 'text' : 'password'"
      @click:append-inner="oldPasswordVisible = !oldPasswordVisible"
      density="compact"
      v-model="oldPassword"
      :error-messages="errors?.Oldpassword"
      label="Ditt nåværende passord"
      prepend-inner-icon="mdi-lock"
      data-testid="old-password"></v-text-field>
    <v-text-field
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="passwordVisible = !passwordVisible"
      density="compact"
      v-model="password"
      :error-messages="errors?.password"
      label="Nytt passord"
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
    <v-btn class="me-4" type="submit" data-testid="create-user-button"> oppdater </v-btn>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString, ref as yupRef } from 'yup';
import { useUserInfoStore } from '@/stores/UserStore';
import { UserService, UserPatchDTO } from '@/api';
import useFeedbackStore from '@/stores/FeedbackStore';

let user = await UserService.getUser1();

const feedbackStore = useFeedbackStore();

const userStore = useUserInfoStore();
const oldPasswordVisible = ref(false);
const passwordVisible = ref(false);
const passwordRepeatVisible = ref(false);
const errorMessage = ref('');
const emit = defineEmits(['update:activePage']);

/* form validation schema */
const schema = computed(() =>
  yupObject({
    oldPassword: yupString().required('Ditt gamle passord er obligatorisk'),
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
  const createPatchPayload: UserPatchDTO = {
    oldPassword: values.oldPassword,
    newPassword: values.password,
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
  feedbackStore.addFeedback('Passordet er oppdatert', 'success');
});

/* form values */
const { value: oldPassword } = useField('oldPassword') as FieldContext<string>;
const { value: password } = useField('password') as FieldContext<string>;
const { value: repeatPassword } = useField('repeatPassword') as FieldContext<string>;
</script>
