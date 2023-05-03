import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mountWithVuetify from '@/testUtils';
import AddFoodproductModal from '@/components/Household/Inventory/AddFoodproductModal.vue';
import { VueWrapper } from '@vue/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { K as Server } from 'msw/lib/glossary-de6278a9';
import { FoodProductDTO } from '@/api';

describe('test AddProduct', () => {
  const testData = {
    productName: 'Melk',
    amount: 2,
    expirationDate: '2023-06-01',
    householdId: 'household_123',
  };

  let server: Server;

  beforeAll(() => {
    const restTemplates = [
      rest.post('http://localhost:8080/api/v1/private/foodproducts/search', (req, res, ctx) => {
        return res(
          ctx.json([
            {
              name: 'ørret kaffe',
            },
          ] as FoodProductDTO[]),
        );
      }),
    ];
    server = setupServer(...restTemplates);
    server.listen();
  });

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mountWithVuetify({
      component: AddFoodproductModal,
      options: {
        props: testData,
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

  test('Component renders with correct title', () => {
    const title = wrapper.find('.headline');
    expect(title.text()).toBe('Legg til produkt');
  });

  test('Product name input field exists and works', async () => {
    const productNameInput = wrapper.find('[data-testid="product_name"] input');
    expect(productNameInput.exists()).toBe(true);

    await productNameInput.setValue(testData.productName);
    const productNameInputAgain = wrapper.find('[data-testid="product_name"] input');
    expect((productNameInputAgain.element as any)._value.indexOf(testData.productName)).not.toBe(
      -1,
    );
  });

  test('Check if amount input field exists', async () => {
    const productNameInput = wrapper.find('[data-testid="product_name"]');
    expect(productNameInput.exists()).toBe(true);
  });
});
