/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */

var oxGeovariation = {
  storage: sessionStorage,
  itemName: 'country-code',

  get: function() {
    return this.storage.getItem('Drupal.' + this.itemName);
  },

  set: function(countryCode) {
    return this.storage.setItem('Drupal.' + this.itemName, countryCode);
  },

  ipFromURL: function() {
    var reg = new RegExp('[?&]' + 'testip' + '=([^&#]*)', 'i');
    var string = reg.exec(window.location.href);
    return string ? string[1] : undefined;
  }
};
