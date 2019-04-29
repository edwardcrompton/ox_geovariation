(function ($, Drupal) {
  Drupal.behaviors.call_to_action = {
    attach: function (context, settings) {
      $('.paragraph--type--call-to-action', context).once('geo-variation').each(function () {
        var countryCode = oxGeovariation.get();
        var link = drupalSettings.affiliateCTALinks[countryCode]['url'];
        var title = drupalSettings.affiliateCTALinks[countryCode]['title'];
        $('a', this).attr('href', link);
        $('a', this).html(title);
      });
    }
  }
})(jQuery, Drupal);
