import { mount, MountingOptions } from '@vue/test-utils';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import { VApp } from 'vuetify/components';
import { h } from 'vue';
import router from '@/router';
import { createTestingPinia } from '@pinia/testing';

type MountingProps = {
  component: any;
  options?: MountingOptions<Record<string, any>>;
};

const mountWithVuetify = (props: MountingProps) => {
  const vuetify = createVuetify();
  return mount(VApp, {
    slots: {
      default: h(props.component, props.options?.props),
    },
    global: {
      plugins: [vuetify, router, createTestingPinia()],
    },
  });
};

export default mountWithVuetify;
