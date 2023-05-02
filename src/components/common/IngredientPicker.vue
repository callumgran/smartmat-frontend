<template>
  <v-card>
    <v-title>Velg ingrediens</v-title>
    <v-text-field
      v-model="search"
      label="Søk etter ingrediens"
      outlined
      dense
      @input="onSearch"
      class="mb-4" />
    <v-divider />
    <v-list>
      <v-list-item-group v-model="ingredients">
        <v-list-item
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          @click="emit('onChoice', ingredient)">
          <v-list-item-content>
            <v-list-item-title>{{ ingredient.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-btn @click="emit('onChoice', null)">Dette produktet er <br />ikke en ingrediens</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { FilterRequest, IngredientDTO, IngredientService, SortRequest } from '@/api';
import { ref } from 'vue';

const props = defineProps<{
  startList?: IngredientDTO[];
}>();

const emit = defineEmits<{
  (e: 'onChoice', ingredient: IngredientDTO | null): void;
}>();

const search = ref('');

const getIngredients = async (search: string): Promise<IngredientDTO[]> => {
  return IngredientService.searchIngredients({
    requestBody: {
      filterRequests: [
        {
          keyWord: 'name',
          operator: FilterRequest.operator.LIKE,
          fieldType: FilterRequest.fieldType.STRING,
          value: search,
        },
      ],
      sortRequests: [{ keyWord: 'name', sortDirection: SortRequest.sortDirection.ASC }],
      size: undefined,
      page: undefined,
    },
  });
};

const ingredients = ref<IngredientDTO[]>(props.startList ?? (await getIngredients('')));

const onSearch = async (search: string) => {
  ingredients.value = await getIngredients(search);
};
</script>

<style scoped></style>