import { describe, test, expect } from 'vitest';
import mountWithVuetify from '@/testUtils';
import RegisterUserView from '../RegisterUserView.vue';

describe('Test register user view', () => {
  test('Register user view has a login form', () => {
    const wrapper = mountWithVuetify(RegisterUserView);
    const usernameInput = wrapper.find('[data-testid="username"]');
    const passwordInput = wrapper.find('[data-testid="password"]');
    expect(usernameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    /* submit button should exist, but should not be active */
    const submitBtn = wrapper.find('[data-testid="create-user-button"]');
    expect(submitBtn.exists()).toBe(true);
  });

  test('Submit button is clickable when form input is valid', async () => {
    const wrapper = mountWithVuetify(RegisterUserView);
    const usernameInput = wrapper.find('[data-testid="username"]');
    const emailInput = wrapper.find('[data-testid="email"]');
    const firstnameInput = wrapper.find('[data-testid="firstname"]');
    const lastnameInput = wrapper.find('[data-testid="lastname"]');
    const passwordInput = wrapper.find('[data-testid="password"]');
    const repeatPasswordInput = wrapper.find('[data-testid="repeat-password"]');
    expect(usernameInput.exists()).toBe(true);
    expect(emailInput.exists()).toBe(true);
    expect(firstnameInput.exists()).toBe(true);
    expect(lastnameInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    expect(repeatPasswordInput.exists()).toBe(true);

    /* what we have found using the testid is the vuetify wrappers */
    await usernameInput.find('input').setValue('TestUser');
    await emailInput.find('input').setValue('test@mail.no');
    await firstnameInput.find('input').setValue('Test');
    await lastnameInput.find('input').setValue('User');
    await passwordInput.find('input').setValue('TestPassword123');
    await repeatPasswordInput.find('input').setValue('TestPassword123');

    const submitBtn = wrapper.find('[data-testid="create-user-button"]');
    expect(submitBtn.exists()).toBe(true);
    expect(submitBtn.attributes().disabled).toBeUndefined();
    submitBtn.trigger('click');
  });
});
