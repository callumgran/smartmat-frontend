import { mount, MountingOptions, shallowMount } from '@vue/test-utils';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import { VApp } from 'vuetify/components';
import { h, Suspense } from 'vue';
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
      default: h(Suspense, [h(props.component, props.options?.props)]),
    },
    global: {
      plugins: [vuetify, router, createTestingPinia()],
    },
  });
};

const shallowMountWithVuetify = (props: MountingProps) => {
  const vuetify = createVuetify();
  return shallowMount(props.component, {
    parentComponent: VApp,
    props: props.options?.props,
    global: {
      plugins: [vuetify, router, createTestingPinia()],
    },
  });
};

export default mountWithVuetify;
export { shallowMountWithVuetify };
