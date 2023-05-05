import { describe, test, expect, beforeEach, afterEach, afterAll, beforeAll } from 'vitest';
import mountWithVuetify from '@/testUtils';
import HouseholdListView from '@/views/Household/HouseholdListView.vue';
import { VueWrapper } from '@vue/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { K as Server } from 'msw/lib/glossary-de6278a9';
import { HouseholdDTO } from '@/api';

describe('Test HouseholdListView', () => {
  let wrapper: VueWrapper<any>;
  let server: Server;

  beforeAll(() => {
    const restTemplates = [
      rest.get('http://localhost:8080/api/v1/private/households/user/', (req, res, ctx) => {
        return res(
          ctx.json({
            name: 'test',
          } as HouseholdDTO),
        );
      }),
    ];

    server = setupServer(...restTemplates);
    server.listen();
  });

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: HouseholdListView,
      options: {
        props: {
          households: [
            {
              id: 'household1',
              name: 'My First Household',
            },
            {
              id: 'household2',
              name: 'My Second Household',
            },
          ],
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test('Component renders header', () => {
    const header = wrapper.find('h2');
    expect(header.text()).toBe('Mine husstander');
  });

  test('Component renders create household button', () => {
    const button = wrapper.find('[data-testid="create-household-button"]');
    expect(button.exists()).toBe(true);
  });
});
