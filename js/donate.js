(function ($, Drupal) {
  Drupal.behaviors.donate = {
    attach: function (context, settings) {
      oxGeovariation.alterLink($('.primary-menu li:last a'), drupalSettings.affiliateDonationLinks);
    }
  }
})(jQuery, Drupal);
