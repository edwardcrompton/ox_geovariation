/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */

var oxGeovariation = {
  storage: sessionStorage,
  itemName: 'Drupal.country-code',

  get: function() {
    return this.storage.getItem(this.itemName);
  },

  set: function(countryCode) {
    return this.storage.setItem(this.itemName, countryCode);
  },

  ipFromURL: function() {
    var reg = new RegExp('[?&]' + 'testip' + '=([^&#]*)', 'i');
    var string = reg.exec(window.location.href);
    return string ? string[1] : undefined;
  }
};
