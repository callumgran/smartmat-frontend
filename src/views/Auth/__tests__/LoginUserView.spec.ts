import { describe, test, expect } from 'vitest';
import mountWithVuetify from '@/testUtils';
import LoginUserViewVue from '@/views/Auth/LoginUserView.vue';

describe('Test login user view', () => {
  test('Login user view has a login form', () => {
    const wrapper = mountWithVuetify({ component: LoginUserViewVue });
    const usernameInput = wrapper.find('[data-testid="username"]');
    const passwordInput = wrapper.find('[data-testid="password"]');
    expect(usernameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    /* submit button should exist, but should not be active */
    const submitBtn = wrapper.find('[data-testid="login-user-button"]');
    expect(submitBtn.attributes().disabled).toBeDefined();
  });

  test('Submit button becomes active when form input is valid', async () => {
    const wrapper = mountWithVuetify({ component: LoginUserViewVue });
    const usernameInput = wrapper.find('[data-testid="username"]');
    const passwordInput = wrapper.find('[data-testid="password"]');
    expect(usernameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    /* what we have found using the testid is the vuetify wrappers */
    await usernameInput.find('input').setValue('TestUser');
    await passwordInput.find('input').setValue('TestPassword123');

    const submitBtn = wrapper.find('[data-testid="login-user-button"]');
    expect(submitBtn.exists()).toBe(true);
    expect(submitBtn.attributes().disabled).toBeUndefined();
    submitBtn.trigger('click');
  });
});
