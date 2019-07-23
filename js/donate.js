(function ($, Drupal) {
  Drupal.behaviors.donate = {
    attach: function (context, settings) {
      oxGeovariation.alterLink($('.bg-orange'), drupalSettings.affiliateDonationLinks);
    }
  }
})(jQuery, Drupal);
