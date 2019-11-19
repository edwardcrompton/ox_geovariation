(function ($, Drupal) {

  var affiliateSignUpLinks = drupalSettings.affiliateSignUpLinks;
  var languageOfPage = drupalSettings.path.currentLanguage;

  Drupal.behaviors.affiliate_signup_block = {
    attach: function (context, settings) {
      $('.newsletter_form', context).each(function () {
        // Get the current geolocation
        linkElement = $(this).find('.subscribe_signup > a');
        oxGeovariation.alterLink(linkElement, affiliateSignUpLinks[languageOfPage]);
        // Add a class to the form when the geolocation has been applied so that
        // we can show / hide stuff.
        oxGeovariation.addGeoClass($(this), affiliateSignUpLinks[languageOfPage]);
      });
    }
  }

})(jQuery, Drupal);
