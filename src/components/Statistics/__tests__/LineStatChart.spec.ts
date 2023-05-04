import mountWithVuetify from '@/testUtils';
import { describe, test, expect } from 'vitest';
import LineStatChart from '@/components/Statistics/LineStatChart.vue';
import { ChartData } from 'chart.js';

describe('Test line statistic chart', () => {
  test('Test chart is a canvas', () => {
    const wrapper = mountWithVuetify({
      component: LineStatChart,
      options: {
        props: {
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Money saved',
                data: [40, 20, 12, 39, 10, 40, 39],
              },
            ],
          } as ChartData<'line', number[]>,
        },
      },
    });
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
  });
});
