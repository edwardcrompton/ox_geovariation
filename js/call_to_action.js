(function ($, Drupal) {
  Drupal.behaviors.call_to_action = {
    attach: function (context, settings) {
      $('.paragraph--type--call-to-action', context).once('geo-variation').each(function () {
        oxGeovariation.alterLink(this, drupalSettings.affiliateCTALinks);
      });
    }
  }
})(jQuery, Drupal);
