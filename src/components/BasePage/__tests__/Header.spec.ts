import { describe, test, expect } from 'vitest';
import Header from '@/components/BasePage/Header.vue';
import mountWithVuetify from '@/testUtils';

describe('Test base header component', () => {
  test('Clicking on drawer button shows app drawer', async () => {
    const wrapper = mountWithVuetify({ component: Header });
    const drawerButton = wrapper.find("[data-testid='navbar-drawer-button']");
    expect(drawerButton.exists()).toBe(true);
    await drawerButton.trigger('click');
    const navDrawer = wrapper.find("[data-testid='drawer-link-list']");
    expect(navDrawer.exists()).toBe(true);
  });

  test('Navigation bar shows title', async () => {
    const wrapper = mountWithVuetify({ component: Header });
    const navBarTitle = wrapper.find("[data-testid='navbar-title']");
    expect(navBarTitle.exists()).toBe(true);
  });
});
