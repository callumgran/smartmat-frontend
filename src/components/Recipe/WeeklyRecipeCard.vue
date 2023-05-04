<template>
  <v-card variant="outlined" class="weekly-recipe-card">
    <v-btn
      v-if="date > today && recipe && !used"
      class="delete-recipe"
      icon="mdi-close-circle-outline"
      @click="confirmDelete = true"
      data-testid="delete-button" />
    <v-btn
      v-if="todayEvening > date && recipe && !used"
      class="use-recipe"
      @click="emit('used')"
      data-testid="useup-button">
      spist opp
    </v-btn>
    <v-row dense>
      <v-col cols="12">
        <v-card class="main" @click="onClick()">
          <div class="d-flex">
            <v-card-item class="date-content">
              <b>{{ dayToNO() }}</b>
              <h3>{{ date.getDate() }}.</h3>
              <p>{{ monthToNO() }}</p>
            </v-card-item>
            <div size="100" class="main-content">
              <v-card-item v-if="recipe">
                <h3 data-testid="recipe-name">
                  {{ recipe?.name }}
                </h3>
                <span data-testid="servings">
                  {{ servings }} {{ servings! > 1 ? 'porsjoner' : 'porsjon' }}
                </span>
              </v-card-item>
              <v-card-item v-else>
                <v-icon v-if="date > today" size="50">mdi-plus</v-icon>
                <p v-else>ingen oppskrift ble brukt</p>
              </v-card-item>
            </div>

            <v-avatar
              v-if="recipe"
              class="ma-3"
              size="100"
              rounded="0"
              style="align-self: flex-end">
              <v-img
                src="https://www.hackerspace-ntnu.no/media/profilepictures/cache/30/1b/301bbf8859ebf1c2edaf5d0c60a1c1d8.jpg"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <confirm-delete-planned v-if="confirmDelete" @confirmDelete="(rc) => confirm(rc)" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { RecipeDTO } from '@/api';
import ConfirmDeletePlanned from '@/components/Household/WeeklyMenu/ConfirmDeletePlanned.vue';

const props = defineProps<{
  recipe?: RecipeDTO;
  servings?: number;
  used?: boolean;
  date: Date;
}>();

const emit = defineEmits(['plan-recipe', 'delete-planned-recipe', 'used']);

const router = useRouter();
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayEvening = new Date();
todayEvening.setDate(today.getDate() + 1);
todayEvening.setHours(0, 0, 0, 0);
const confirmDelete = ref(false);

const confirm = (rc: number) => {
  confirmDelete.value = false;
  if (rc) emit('delete-planned-recipe');
};

const onClick = () => {
  if (props.recipe) {
    console.log('true');
    router.push({
      name: 'recipe-detail',
      params: {
        recipeId: props.recipe.id,
      },
      query: {
        servings: props.servings,
      },
    });
    return;
  }

  /* can't set a recipe for an earlier date than today */
  if (today > props.date) {
    return;
  }

  emit('plan-recipe', dateFormatString());
};

const monthToNO = (): string => {
  const months = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
  ];
  return months[props.date.getMonth()];
};

const dayToNO = (): string => {
  const days = ['Søn', 'Man.', 'Tir.', 'Ons.', 'Tor.', 'Fre.', 'Lør.', 'Søn.'];
  return days[props.date.getDay()];
};

const dateFormatString = (): string => {
  return dayToNO()
    .concat(' ')
    .concat(props.date.getDate().toString())
    .concat('. ')
    .concat(monthToNO());
};

const dateContentBgColor = computed(() => {
  return today.getDate() === props.date.getDate() && today.getMonth() === props.date.getMonth()
    ? '#B5F49F'
    : '#E9E9E9';
});

const bgColor = computed(() => {
  if (
    today.getDate() === props.date.getDate() &&
    today.getMonth() === props.date.getMonth() &&
    props.used === false
  )
    return '#B5F49F';

  if (today > props.date || props.used === true) return '#E9E9E9';
});
</script>

<style scoped>
.date-content {
  text-align: center;
  background-color: v-bind('dateContentBgColor');
}

.main-content {
  margin: auto;
}

.main {
  background-color: v-bind('bgColor');
}

.delete-recipe {
  position: absolute;
  background-color: white;
  color: red;
  right: 0;
  z-index: 1;
}

.use-recipe {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.weekly-recipe-card {
  width: 100%;
  margin-top: 1rem;
}
</style>
