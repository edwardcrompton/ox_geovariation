/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */

var oxGeovariation = {
  storage: sessionStorage,
  itemName: 'country-code',

  get: function() {
    return this.storage.getItem(this.itemName);
  },

  set: function(countryCode) {
    return this.storage.setItem(this.itemName, countryCode);
  }
};
