(function ($, Drupal) {

  var affiliateCTALinks = drupalSettings.ox_subscribe.affiliates;
  var languageOfPage = drupalSettings.path.currentLanguage;

  Drupal.behaviors.affiliate_toggle_blocks = {
    attach: function (context, settings) {
      $('.newsletter_form', context).each(function () {
        console.log('yo');
        // Get the current geolocation
        theVariationLink = oxGeovariation.alterLink($(this).find('.subscribe_signup > a'), affiliateCTALinks[languageOfPage]);
        // Switch the button URL accordingly
        if (typeof theVariationLink === 'object') {
          $(".subscribe_signup").show();
          $(".subscribe_form").hide();
        }
      });
    }
  }

})(jQuery, Drupal);
