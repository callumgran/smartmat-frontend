<template>
  <h1>{{ household?.name }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { HouseholdDTO, HouseholdService, ApiError } from '@/api';
import { onMounted } from 'vue';

const household = ref<HouseholdDTO>();

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
});
</script>
