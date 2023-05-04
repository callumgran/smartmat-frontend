import mountWithVuetify from '@/testUtils';
import { describe, test, expect } from 'vitest';
import { ChartData } from 'chart.js';
import DoughnutStatChart from '../DoughnutStatChart.vue';

describe('Test over time chart', () => {
  test('Test chart is a canvas', () => {
    const wrapper = mountWithVuetify({
      component: DoughnutStatChart,
      options: {
        props: {
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Food products thrown',
                data: [40, 20, 12, 39, 10, 40, 39],
              },
            ],
          } as ChartData<'doughnut', number[]>,
        },
      },
    });
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
  });
});
