(function ($, Drupal) {
  Drupal.behaviors.call_to_action = {
    attach: function (context, settings) {
      $('.paragraph--type--call-to-action', context).once('geo-variation').each(function () {
        paragraphId = $(this).attr('data-paragraph-id');
        linkElement = $('a', this);

        oxGeovariation.alterLink(linkElement, drupalSettings['affiliateCTALinks_' + paragraphId]);
      });
    }
  }
})(jQuery, Drupal);
