(function ($, Drupal) {
  Drupal.behaviors.donate = {
    attach: function (context, settings) {
      oxGeovariation.alterLink($('.primary-menu ul:first li:last a'), drupalSettings.affiliateDonationLinks);
    }
  }
})(jQuery, Drupal);
