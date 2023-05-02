<template>
  <v-card variant="outlined">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <div class="d-flex">
            <div>
              <v-card-item>
                <h3 data-testid="recipe-card-title">
                  {{ recipe.name }}
                </h3>
              </v-card-item>

              <v-card-text v-if="score">
                <div v-if="score > 100" style="color: #02b509">
                  Bruker opp veldig mye av din beholdningen
                </div>
                <div v-else-if="score > 50" style="color: #6ed072">
                  Bruker opp mye av din beholdningen
                </div>
                <div v-else color="yellow" style="color: #f9b404">
                  Bruker opp litt av din beholdningen
                </div>
              </v-card-text>
              <v-card-text v-else> {{ getDescription(recipe.description) }} </v-card-text>
            </div>

            <v-avatar class="ma-3" size="125" rounded="0" style="align-self: flex-end">
              <v-img
                src="https://www.hackerspace-ntnu.no/media/profilepictures/cache/30/1b/301bbf8859ebf1c2edaf5d0c60a1c1d8.jpg"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { RecipeDTO } from '@/api';

defineProps<{
  recipe: RecipeDTO;
  score?: number;
}>();

const getDescription = (description: string): string => {
  if (description.length > 42) return description.slice(0, 42).concat('...');
  return description;
};
</script>

<style scoped>
.float-right {
  float: right;
  margin: 0 0 1em 1em;
}
</style>
