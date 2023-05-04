import mountWithVuetify from '@/testUtils';
import { describe, test, expect } from 'vitest';
import { ChartData } from 'chart.js';
import BarStatChart from '@/components/Statistics/BarStatChart.vue';

describe('Test bar statistic', () => {
  test('Test chart is a canvas', () => {
    const wrapper = mountWithVuetify({
      component: BarStatChart,
      options: {
        props: {
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Kilos saved',
                data: [40, 20, 12, 39, 10, 40, 39],
              },
            ],
          } as ChartData<'bar', number[]>,
        },
      },
    });
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
  });
});
