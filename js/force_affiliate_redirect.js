(function ($, Drupal) {

  var affiliateCTALinks = drupalSettings.ox_geovariation.affiliates;
  var languageOfPage = drupalSettings.path.currentLanguage;
  var countryCode = oxGeovariation.get();

  Drupal.behaviors.force_redirect = {
    attach: function (context, settings) {

      // If the logged in user has a geo countryCode
      // AND the current page language has a list of affiliates
      if (typeof countryCode !== 'undefined' && languageOfPage in affiliateCTALinks) {
        var affiliatesForLanguage = affiliateCTALinks[languageOfPage];

        // If there is an affiliate for this specific countrycode/language
        if (countryCode in affiliatesForLanguage) {
          // Then redirect to that page automatically
          var redirectDestination = affiliatesForLanguage[countryCode].href;
          window.location.replace(redirectDestination);
        }
      }

    }
  }

})(jQuery, Drupal);
