<template>
  <v-navigation-drawer location="bottom" :width="height" :model-value="open">
    <v-list :class="column" data-testid="drawer-link-list">
      <v-btn
        class="ma-2"
        :block="name === 'xs' || name === 'sm'"
        v-for="item in items"
        :key="item.title"
        link
        :prepend-icon="item.icon"
        @click="emit('click', { to: item.to, params: item.params })">
        {{ item.title }}
      </v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
  (e: 'click', id: { to: string; params: Record<string, string | number> | undefined }): void;
}>();

const { name } = useDisplay();

const column = computed(() => {
  switch (name.value) {
    case 'xs':
      return 'd-flex align-center justify-center flex-column';
    case 'sm':
      return 'd-flex align-center justify-center flex-column';
    case 'md':
      return 'd-flex align-center justify-center flex-row';
    case 'lg':
      return 'd-flex align-center justify-center flex-row';
    case 'xl':
      return 'd-flex align-center justify-center flex-row';
    case 'xxl':
      return 'd-flex align-center justify-center flex-row';
  }
});

const height = computed(() => {
  switch (name.value) {
    case 'xs':
      return 225;
    case 'sm':
      return 225;
    case 'md':
      return 100;
    case 'lg':
      return 100;
    case 'xl':
      return 100;
    case 'xxl':
      return 100;
  }
});

defineProps<{
  items: {
    title: string;
    icon: string;
    to: string;
    params?: Record<string, string | number>;
  }[];
  open: boolean;
}>();
</script>
