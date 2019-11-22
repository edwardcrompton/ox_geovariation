/**
 * @file
 *  Helper functions for getting and setting the countryCode from the session
 *  storage.
 */

var oxGeovariation = {
  storage: sessionStorage,
  itemName: 'Drupal.country-code',
  tryLimit: 100,
  tryInterval: 50,

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
  },

  /**
   * Alters a link for a specific geovariation.
   *
   * @param object linkElement
   *  jQuery link object to alter
   * @param object linkList
   *  The link properties for each geovariation keyed by country code.
   *
   * @returns boolean
   *  Whether or not the link was altered successfully.
   */
  alterLink: function(linkElement, linkList, tries = 0) {
    var countryCode = null
    countryCode = this.get();

    // We can't rely on the country code having already been written to the
    // session at this point, so if it's not there, wait until it is.
    if (countryCode === null && tries < this.tryLimit) {
      setTimeout(function() {
        oxGeovariation.alterLink(linkElement, linkList, tries + 1);
      }, this.tryInterval);
      return false;
    }
    if (linkList[countryCode] && linkElement) {
      var countryLink = linkList[countryCode];
      for (var property in countryLink) {
        if (countryLink.hasOwnProperty(property)) {
          // Content requires special treatment. Any other keys in the array
          // should just refer to an attribute of the link element.
          if (property === 'content') {
            linkElement.html(countryLink[property]);
          }
          else {
            linkElement.attr(property, countryLink[property]);
          }
        }
      }
      linkElement.addClass('geovariation');
      return linkElement;
    }
    return false;
  },

  addGeoClass: function(element, linkList, tries = 0) {
    var countryCode = null
    countryCode = this.get();

    // We can't rely on the country code having already been written to the
    // session at this point, so if it's not there, wait until it is.
    if (countryCode === null && tries < this.tryLimit) {
      setTimeout(function () {
        oxGeovariation.addGeoClass(element, linkList, tries + 1);
      }, this.tryInterval);
      return;
    }

    if (linkList[countryCode] && element) {
      element.addClass('geovariation');
    }
    else {
      console.log('Could not get country code for geovariation after '+tries+' tries at '+this.tryInterval+'ms intervals.')
    }
  }
};
