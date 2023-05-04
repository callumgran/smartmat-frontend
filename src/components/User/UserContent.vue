<template>
  <v-card
    class="mx-auto pa-12 pb-8 d-flex flex-column"
    min-height="70vh"
    elevation="8"
    max-width="448"
    rounded="lg">
    <component :is="activePageComponent" v-model:activePage="activePage" />
    <v-spacer></v-spacer>
    <v-card-actions>
      <div
        class="d-flex q-flex-column align-center justify-center"
        v-if="isMe && activePage === 'UserDetail'">
        <v-btn
          class="me-4"
          data-testid="go-to-edit"
          @click="activePage = 'UserEdit'"
          variant="outlined"
          >Endre bruker</v-btn
        >
        <v-btn
          class="me-4"
          data-testid="go-to-password"
          @click="activePage = 'UserEditPassword'"
          variant="outlined"
          >Endre passord</v-btn
        >
      </div>
      <div class="bottom d-flex" v-else>
        <v-btn
          class="me-4"
          data-testid="go-back-button"
          @click="activePage = 'UserDetail'"
          variant="outlined"
          primary
          >Gå tilbake</v-btn
        >
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import UserDetail from '@/components/User/UserDetail.vue';
import UserEdit from '@/components/User/UserEdit.vue';
import UserEditPassword from '@/components/User/UserEditPassword.vue';
import { useUserInfoStore } from '@/stores/UserStore';

const activePage = ref('UserDetail');

const components: Record<string, any> = {
  UserDetail,
  UserEdit,
  UserEditPassword,
};

const activePageComponent = computed(() => {
  return components[activePage.value];
});

const isMe: Ref<boolean> = computed(() => {
  return useUserInfoStore().username !== null;
});
</script>

<style scoped>
@media (max-width: 768px) {
  .q-flex-column {
    flex-direction: column;
  }
}
</style>
