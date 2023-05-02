<template>
  <v-card variant="outlined">
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <div class="d-flex">
            <div>
              <v-card-item>
                <h3 data-testid="recipe-card-title">
                  {{ props.recipe.name }}
                </h3>
              </v-card-item>

              <v-card-text> Bruker opp mye i din beholdning </v-card-text>
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

const props = defineProps({
  recipe: {
    type: Object as () => RecipeDTO,
    required: true,
  },
});
</script>

<style scoped>
.float-right {
  float: right;
  margin: 0 0 1em 1em;
}
</style>
