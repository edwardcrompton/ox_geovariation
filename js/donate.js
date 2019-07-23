(function ($, Drupal) {
  Drupal.behaviors.donate = {
    attach: function (context, settings) {
      oxGeovariation.alterLink($('a.bg-orange'), drupalSettings.affiliateDonationLinks);
    }
  }
})(jQuery, Drupal);
