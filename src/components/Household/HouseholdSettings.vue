<template>
  <v-container class="d-flex align-center justify-center">
    <v-btn
      @click="$emit('delete-household')"
      class="delete-household-button"
      data-testid="delete-household-btn"
      rounded="xl"
      color="warning"
      size="small"
      variant="flat">
      slett husstand
      <v-icon icon="mdi:mdi-delete" />
    </v-btn>
  </v-container>

  <v-card class="settings">
    <v-card-title>Endre navn</v-card-title>
    <v-card-item>
      <form @submit.prevent="submit" class="household-name">
        <v-text-field
          @keyup.enter="submit()"
          v-model="householdName"
          :counter="64"
          :error-messages="errors?.householdName"
          label="Husstandens navn"
          data-testid="edit-name-input" />
        <v-btn type="submit">
          <v-icon icon="mdi:mdi-content-save" data-testid="save-name-button" />
        </v-btn>
      </form>
    </v-card-item>
  </v-card>

  <br />

  <v-card class="settings">
    <v-card-title>Oppdater medlemmer</v-card-title>
    <v-card-item>
      Legg til medlem
      <div class="add-member">
        <v-text-field
          @keyup.enter="addMember()"
          v-model="newMemberName"
          :counter="64"
          label="Brukernavn"
          data-testid="new-member-name" />
        <v-btn @click="addMember()">
          <v-icon icon="mdi:mdi-account-plus-outline" data-testid="add-member-button" />
        </v-btn>
      </div>
    </v-card-item>

    <v-card-item>
      <household-members-edit
        :members="household.members ?? []"
        @remove-member="(username) => $emit('remove-member', username)"
        @update-member-role="(username, role) => $emit('update-member-role', username, role)" />
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { HouseholdDTO } from '@/api';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import HouseholdMembersEdit from './HouseholdMembersEdit.vue';

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: true,
  },
});

const emit = defineEmits([
  'delete-household',
  'update-name',
  'add-member',
  'remove-member',
  'update-member-role',
]);

const newMemberName = ref('');

const addMember = () => {
  if (!newMemberName.value) return;
  emit('add-member', newMemberName.value);
  newMemberName.value = '';
};

/* edit name stuff */
/* form validation schema */
const schema = computed(() =>
  yupObject({
    householdName: yupString()
      .required('Navn på husstand er obligatorisk')
      .min(1, 'Navnet på husstanden må være minst ett tegn')
      .max(64, 'Navnet på husstanden kan ikke være mer enn 64 tegn'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const submit = handleSubmit((values) => {
  if (errors.value.householdName) return;
  emit('update-name', values.householdName);
});

/* form values */
const { value: householdName } = useField('householdName') as FieldContext<string>;
householdName.value = props.household.name;
</script>

<style scoped>
.household-name {
  display: flex;
  align-items: center;
}

.add-member {
  display: flex;
  align-items: center;
  justify-content: end;
}

/* center */
.delete-household-button {
  margin-bottom: 1rem;
}

.settings {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}
</style>
