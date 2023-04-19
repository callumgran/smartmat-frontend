import { describe, test, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserInfoStore } from '@/stores/UserStore';
import Header from '@/components/BasePage/Header.vue';
import mountWithVuetify from '@/testUtils';

describe('Test base header component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Drawer button does not exist for non-logged in user', async () => {
    const wrapper = mountWithVuetify({ component: Header });
    const drawerButton = wrapper.find("[data-testid='navbar-drawer-button']");
    expect(drawerButton.exists()).toBe(false);
    const loginButton = wrapper.find("[data-testid='login-button']");
    expect(loginButton.exists()).toBe(true);
  });

  //test('Drawer button exists for logged in user', async () => {
  //  const store = useUserInfoStore();
  //  store.setUserInfo({ username: 'eilor', firstname: 'first', lastname: 'last', accessToken: 'dummy', role: 'USER' });
  //  const wrapper = mountWithVuetify({ component: Header });
  //  const drawerButton = wrapper.find("[data-testid='login-button']");
  //  expect(drawerButton.exists()).toBe(true);
  //});

  test('Navigation bar shows title', async () => {
    const wrapper = mountWithVuetify({ component: Header });
    const navBarTitle = wrapper.find("[data-testid='navbar-title']");
    expect(navBarTitle.exists()).toBe(true);
  });
});
