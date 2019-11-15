/**
 * There are two parts to the geovariation for the affiliate block:
 * - call_to_action.js handles the geovariation of the CTA link inside the block
 * - This file adds a class to the block if the CTA link has been altered, to
 * allow it to be shown. It's hidden by default.
 */
(function ($, Drupal) {
  Drupal.behaviors.affiliate_link_block = {
    attach: function (context, settings) {
      $('#block-linktoaffiliate', context).once('geo-variation-linktoaffiliate').each(function() {
        // Get the paragraph id of the CTA link in the block.
        var paragraphId = $('.paragraph--type--call-to-action', this).attr('data-paragraph-id');
        // Set a class on the element if it has already been changed for
        // geolocation.
        oxGeovariation.addGeoClass($(this), drupalSettings['affiliateCTALinks_' + paragraphId]);
      });
    }
  }
})(jQuery, Drupal);

