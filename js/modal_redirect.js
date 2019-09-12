(function ($, Drupal) {

  Drupal.behaviors.modal_redirect = {
    attach: function (context, settings) {

      var countriesToRedirect = ['ES', 'MX', 'US', 'FR'];
      var countrycode = oxGeovariation.get();

      // Only redirect for certain countrycodes
      if (countriesToRedirect.includes(countrycode)) {
        console.log('redirect');
      }

    }
  }

})(jQuery, Drupal);
