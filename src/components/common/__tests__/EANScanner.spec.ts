import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mountWithVuetify from '@/testUtils';
import EANScanner from '@/components/common/EANScanner.vue';
import { VueWrapper } from '@vue/test-utils';

describe('Test BarcodeScanner', () => {
  class MockMediaStream {
    constructor() {}
    getTracks() {
      return [];
    }
    getVideoTracks() {
      return [];
    }
  }

  global.MediaStream = MockMediaStream as any;

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    const mockEnumerateDevices = () => Promise.resolve([]);
    const mockGetUserMedia = (constraints: MediaStreamConstraints) =>
      Promise.resolve(new MediaStream());

    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        enumerateDevices: mockEnumerateDevices,
        getUserMedia: mockGetUserMedia,
      },
      writable: true,
      configurable: true,
    });

    wrapper = mountWithVuetify({
      component: EANScanner,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });
  test('Component shows "Avbryt" button', () => {
    const cancelButton = wrapper.find('button');
    expect(cancelButton.text()).toBe('Avbryt');
  });
  test('Component shows progress circle when scanner is loading', () => {
    const progressCircle = wrapper.find('.scanner-size');
    expect(progressCircle.exists()).toBeTruthy();
  });
});
