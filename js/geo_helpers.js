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
   * Fetches the two letter country code from a url parameter if set.
   *
   * @returns {undefined|string}
   */
  countryCodeFromUrl: function() {
    var reg = new RegExp('[?&]' + 'country-code' + '=([^&#]*)', 'i');
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
  },

  /**
   * Trigger function to invoke a callback when the country code is retrieved.
   *
   * @todo: With the correct callback functions, I think this trigger method can
   * replace addGeoClass and alterLink above.
   */
  trigger: function (callback, tries = 0) {
    var countryCode = null;
    countryCode = this.get();

    // We can't rely on the country code having already been written to the
    // session at this point, so if it's not there, wait until it is.
    if (countryCode === null && tries < this.tryLimit) {
      setTimeout(function () {
        oxGeovariation.trigger(callback, tries + 1);
      }, this.tryInterval);
      return;
    }

    if (countryCode === null) {
      console.log('Could not get country code for geovariation after '+tries+' tries at '+this.tryInterval+'ms intervals.')
    }
    else {
      callback(countryCode);
    }
  },

  /**
   * Returns the cookie value if found otherwise false.
   *
   * @param cookie_name
   *   The cookie to search for.
   *
   * @return bool|{*}
   *   Returns false if not found or the cookie object.
   */
  getCookieValue: function(cookie_name) {
    if (jQuery.cookie(cookie_name) === null || jQuery.cookie(cookie_name) === ""
        || jQuery.cookie(cookie_name) === "null" || jQuery.cookie(cookie_name) === undefined) {
      //no cookie
      return false;
    }
    else {
      // we have cookie, so return cookie value
      return jQuery.cookie(cookie_name);
    }
  },

  /**
   * Returns a session storage value if found, otherwise false.
   *
   * @param sessionVariableName
   *  The variable to look for.
   *
   * @return bool|{*}
   *  Returns the session variable or false if not found.
   */
  getSessionValue: function(sessionVariableName) {
    return sessionStorage.getItem(sessionVariableName);
  },

  /**
   * Sets a session storage value.
   *
   * @param string sessionVariableName
   *  The name of the variable to set.
   * @param sessionVariableValue
   *  The value to set.
   */
  setSessionValue: function(sessionVariableName, sessionVariableValue) {
    sessionStorage.setItem(sessionVariableName, sessionVariableValue);
  },

  /**
   * Stores the user selection for a modal dialog in the session if the option
   * to do so is set.
   *
   * @param string country
   *   The two letter country code of the modal in question.
   * @param string selection
   *   'leave' or 'stay' depending the user's selection.
   */
  rememberSelectionIfSpecified: function(country, selection) {
    if (drupalSettings.ox_geovariations_modal[country]['remember']) {
      oxGeovariation.setSessionValue('ox_geovariations_modal_remember_selection__' + country, selection);
    }
  },

  /**
   * Gets the previous option the user selected from the dialog, if set.
   *
   * @param string country
   *   The two letter country code of the modal in question.
   *
   * @return string
   *   leave|stay depending on the user's previous selection.
   */
  getPreviousDialogSelection: function(country) {
    return oxGeovariation.getSessionValue('ox_geovariations_modal_remember_selection__' + country);
  }
};
