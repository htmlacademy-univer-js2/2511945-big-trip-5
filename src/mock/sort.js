export const SORT_TYPES = {
    DAY: 'sort-day',
    TIME: 'sort-time',
    PRICE: 'sort-price'
  };

export const generateSortItems = () => ([
  { type: SORT_TYPES.DAY, name: 'Day', isDisabled: false, isChecked: true },
  { type: 'sort-event', name: 'Event', isDisabled: true },
  { type: SORT_TYPES.TIME, name: 'Time', isDisabled: false },
  { type: SORT_TYPES.PRICE, name: 'Price', isDisabled: false },
  { type: 'sort-offer', name: 'Offers', isDisabled: true }
]);
