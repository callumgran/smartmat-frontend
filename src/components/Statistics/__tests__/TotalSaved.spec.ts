import mountWithVuetify from '@/testUtils';
import { describe, test, expect } from 'vitest';
import TotalSaved from '@/components/Statistics/TotalSaved.vue';
import { ConsumptionConstants } from '@/utils/ConsumptionConstants';

describe('Test total saved component', () => {
  test('Test kilos saved and calculated price saved is displayed', () => {
    const kilosSaved = 1;
    const priceSaved = ConsumptionConstants.PRICE_PER_KILO * kilosSaved;
    const wrapper = mountWithVuetify({
      component: TotalSaved,
      options: { props: { kilosSaved: kilosSaved } },
    });
    expect(wrapper.text()).toContain(kilosSaved);
    expect(wrapper.text()).toContain(113.5);
  });

  test('Kilos saved as big number is formatted with spaces between the thousands', () => {
    const kilosSaved = 1000000;
    const wrapper = mountWithVuetify({
      component: TotalSaved,
      options: { props: { kilosSaved: kilosSaved } },
    });
    expect(wrapper.text()).toContain('1 000 000');
  });
});
