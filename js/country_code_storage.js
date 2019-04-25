/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */
var storage = sessionStorage;
var itemName = 'country-code';

function ox_geovariation_get_country_code() {
  return storage.getItem(itemName);
}

function ox_geovariation_set_country_code(countryCode) {
  return storage.setItem(itemName, countryCode);
}

