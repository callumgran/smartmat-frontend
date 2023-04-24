<template>
  <div class="household-name">
    <v-text-field
      v-if="editNameMode && isSuperUser"
      @keyup.enter="updateHouseholdName()"
      v-model="householdName"
      :counter="64"
      :error-messages="errors?.name"
      label="Husstandens navn"
      data-testid="edit-name-input" />
    <h2 v-else data-testid="name">{{ household.name }}</h2>

    <div v-if="isSuperUser" @click="updateHouseholdName">
      <v-icon v-if="editNameMode" icon="mdi:mdi-content-save" data-testid="save-name-button" />
      <v-icon v-else icon="mdi:mdi-square-edit-outline" data-testid="edit-name-button" />
    </div>
  </div>

  <div v-if="isSuperUser">
    <v-btn @click="deleteHousehold()" data-testid="delete-household-button">
      slett husholdning
      <v-icon icon="mdi:mdi-delete" />
    </v-btn>
  </div>

  <household-members
    v-model:household="household"
    :is-super-user="isSuperUser"
    @remove-member="removeMember($event)" />

  <div v-if="isSuperUser">
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
import { HouseholdDTO, HouseholdMemberDTO, UpdateHouseholdDTO, HouseholdService } from '@/api';
import { onMounted } from 'vue';
import { useForm, useField, FieldContext } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import HouseholdMembers from '@/components/Household/HouseholdMembers.vue';

const userStore = useUserInfoStore();
const router = useRouter();
const household = ref<HouseholdDTO>({} as HouseholdDTO);
const editNameMode = ref(false);
const newMemberName = ref('');
const isSuperUser = ref(false);

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
      (member.householdRole === HouseholdMemberDTO.householdRole.OWNER ||
        member.householdRole === HouseholdMemberDTO.householdRole.PRIVILEGED_MEMBER)
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
