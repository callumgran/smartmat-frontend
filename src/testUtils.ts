import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import { VApp } from 'vuetify/components';
import { h } from 'vue';
import router from '@/router';

const mountWithVuetify = (component: any) => {
  const vuetify = createVuetify();
  return mount(VApp, {
    slots: {
      default: h(component),
    },
    global: {
      plugins: [vuetify, router],
    },
  });
};

export default mountWithVuetify;
