/**
 * @file
 *  Checks that the user's country code that has been stored in the session
 *  storage and, if not, attempts to fetch the country code from the HTTP
 *  headers in order to write it to session storage. The idea being that a
 *  special country code header has been added by nginx.
 */
(function () {
  var countryCode = oxGeovariation.get();
  var headerName = 'X-Country-Code';

  if (!countryCode) {
    var url = '/geo';
    var ip = oxGeovariation.ipFromURL();

    if (ip) {
      url += '?testip=' + ip;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          countryCode = xhr.getResponseHeader(headerName);
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
