/**
 * @file
 *  Reads the user's country code that has been stored in the session storage or
 *  attempts to fetch the country code from the HTTP headers if it isn't there.
 *  The idea being that a special country code header has been added by nginx.
 */
(function () {
  var countryCode = oxGeovariation.get();

  if (!countryCode) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/geo', true);

    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          countryCode = xhr.getResponseHeader('Country-Code');
          oxGeovariation.set(countryCode);
        }
        else {
          console.error(xhr.statusText)
        }
      }
    }
    xhr.send(null);
  }
})();
