import { describe, test, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useHouseholdStore } from '../HouseholdStore';

describe('Test household store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Initial store has no household', () => {
    const store = useHouseholdStore();
    expect(store.getSelectedName).toEqual('');
    expect(store.getSelectedId).toEqual('');
  });

  test('Append and set appends proper name and id', () => {
    const store = useHouseholdStore();
    store.appendAndSelectHousehold({ id: '1', name: 'Household 1' });
    expect(store.getSelectedName).toEqual('Household 1');
    expect(store.getSelectedId).toEqual('1');
  });

  test('Append in itself does not set household', () => {
    const store = useHouseholdStore();
    store.appendAndSelectHousehold({ id: '1', name: 'Household 1' });
    store.appendHousehold({ id: '2', name: 'Household 2' });
    expect(store.getSelectedName).toEqual('Household 1');
    expect(store.getSelectedId).toEqual('1');
  });

  test('Appending list of households returns first households name and id', () => {
    const store = useHouseholdStore();
    store.appendHouseholds([
      { id: '1', name: 'Household 1' },
      { id: '2', name: 'Household 2' },
    ]);
    expect(store.getSelectedName).toEqual('Household 1');
    expect(store.getSelectedId).toEqual('1');
  });

  test('Select household by id', () => {
    const store = useHouseholdStore();
    store.appendHouseholds([
      { id: '1', name: 'Household 1' },
      { id: '2', name: 'Household 2' },
      { id: '3', name: 'Household 3' },
    ]);
    store.selectHouseholdById('2');

    expect(store.getSelectedName).toEqual('Household 2');
    expect(store.getSelectedId).toEqual('2');
  });

  test('Select household by name', () => {
    const store = useHouseholdStore();
    store.appendHouseholds([
      { id: '1', name: 'Household 1' },
      { id: '2', name: 'Household 2' },
      { id: '3', name: 'Household 3' },
    ]);
    store.selectHouseholdByName('Household 2');

    expect(store.getSelectedName).toEqual('Household 2');
    expect(store.getSelectedId).toEqual('2');
  });

  test('Clear household', () => {
    const store = useHouseholdStore();
    store.appendHouseholds([
      { id: '1', name: 'Household 1' },
      { id: '2', name: 'Household 2' },
      { id: '3', name: 'Household 3' },
    ]);
    store.clearHousehold();

    expect(store.getSelectedName).toEqual('');
    expect(store.getSelectedId).toEqual('');
  });

  test('Select first selects first household in list', () => {
    const store = useHouseholdStore();
    store.appendHouseholds([
      { id: '1', name: 'Household 1' },
      { id: '2', name: 'Household 2' },
      { id: '3', name: 'Household 3' },
    ]);
    store.selectFirst();

    expect(store.getSelectedName).toEqual('Household 1');
    expect(store.getSelectedId).toEqual('1');
  });
});
