(function ($, Drupal) {
  Drupal.behaviors.call_to_action = {
    attach: function (context, settings) {
      $('.paragraph--type--call-to-action', context).once('geo-variation').each(function () {
        var countryCode = ox_geovariation_get_country_code();
        var link = drupalSettings.affiliateCTALinks[countryCode];
        console.log(link);
      });
    }
  }
})(jQuery, Drupal);
