/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */

var oxGeovariation = {
  storage: sessionStorage,
  itemName: 'country-code',

  get() {
    return storage.getItem(itemName);
  },

  set(countryCode) {
    return storage.setItem(itemName, countryCode);
  }
};
