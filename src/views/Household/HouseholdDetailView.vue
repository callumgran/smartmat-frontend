<template>
  <div v-if="editMode">
    <v-btn @click="deleteHousehold()" data-testid="delete-household-button">
      slett husholdning
      <v-icon icon="mdi:mdi-delete" />
    </v-btn>
  </div>

  <div class="household-name">
    <v-text-field
      v-if="editMode"
      @keyup.enter="updateHouseholdName()"
      v-model="householdName"
      :counter="64"
      :error-messages="errors?.name"
      label="Husstandens navn"
      data-testid="edit-name-input" />
    <h2 v-else data-testid="name">{{ household.name }}</h2>

    <v-btn v-if="!editMode && isSuperUser" @click="editMode = true">
      <v-icon icon="mdi:mdi-cog" data-testid="edit-button" />
    </v-btn>

    <v-btn v-if="editMode" @click="updateHouseholdName">
      <v-icon icon="mdi:mdi-content-save" data-testid="save-name-button" />
    </v-btn>
  </div>

  <household-members
    v-model:household="household"
    :edit-mode="editMode"
    @remove-member="removeMember($event)"
    @update-member-role="(username, role) => updateMemberRole(username, role)" />

  <div v-if="editMode">
    <p>Legg til medlem</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/UserStore';
import useFeedbackStore from '@/stores/FeedbackStore';
import { HouseholdDTO, HouseholdMemberDTO, UpdateHouseholdDTO, HouseholdService } from '@/api';
import { onMounted } from 'vue';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import HouseholdMembers from '@/components/Household/HouseholdMembers.vue';

const userStore = useUserInfoStore();
const feedbackStore = useFeedbackStore();
const router = useRouter();
const household = ref<HouseholdDTO>({} as HouseholdDTO);
const isSuperUser = ref(false);
const editMode = ref(false);

const editNameMode = ref(false);
const newMemberName = ref('');

const props = defineProps({
  household: {
    type: Object as () => HouseholdDTO,
    required: false,
  },
});

onMounted(async () => {
  if (props.household) {
    household.value = props.household;
  } else {
    const route = useRoute();
    const id = route.params.id as string;
    household.value = await HouseholdService.getHousehold({ id });
  }
  householdName.value = household.value.name;

  household.value.members?.forEach((member) => {
    if (
      member.username === userStore.username &&
      member.householdRole === HouseholdMemberDTO.householdRole.OWNER
    ) {
      isSuperUser.value = true;
      return;
    }
  });
});

const deleteHousehold = async () => {
  if (
    !confirm(
      `Er du sikker at du vil slette husholdningen ${household.value.name}? Dette er ikke reversibelt.`,
    )
  )
    return;

  await HouseholdService.deleteHousehold({ id: household.value.id });
  router.push({ name: 'household' });
};

const addMember = async () => {
  const member = await HouseholdService.addUserToHousehold({
    id: household.value.id,
    username: newMemberName.value,
  });

  household.value.members?.push(member);
  newMemberName.value = '';
};

const removeMember = async (username: string) => {
  await HouseholdService.removeUserFromHousehold({ id: household.value.id, username: username });
  household.value.members = household.value?.members?.filter(
    (member) => member.username !== username,
  );
};

const updateMemberRole = async (username: string, role: HouseholdMemberDTO.householdRole) => {
  await HouseholdService.updateUserInHousehold({
    id: household.value.id,
    username: username,
    requestBody: role,
  });

  feedbackStore.addFeedback(`Rollen til ${username} ble oppdatert`, 'success');
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

const submit = handleSubmit(async (values) => {
  const payload = {
    id: household.value.id,
    name: values.householdName,
  } as UpdateHouseholdDTO;

  household.value = await HouseholdService.updateHouseholdName({ requestBody: payload });
  feedbackStore.addFeedback(
    `Navnet på husstanden ble oppdatert til ${household.value.name}`,
    'success',
  );
});

const updateHouseholdName = async () => {
  /* if not came from edit name mode, then do nothing */
  if (!editNameMode.value) {
    editNameMode.value = !editNameMode.value;
    return;
  }
  /* if household name did not change, then do nothing*/
  if (householdName.value === household.value?.name) {
    editNameMode.value = !editNameMode.value;
    return;
  }

  /* if household name changed, then update it */
  await submit();
  editNameMode.value = !editNameMode.value;
};

/* form values */
const { value: householdName } = useField('householdName') as FieldContext<string>;
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
</style>
