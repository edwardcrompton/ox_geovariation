(function ($, Drupal) {

  // Note: This was largely copied from the D7 site during migration
  // Some tidying up was done, but could do with some more (such as move the
  // urls to an editable area, and js settings)

  Drupal.behaviors.modal_redirect = {
    attach: function (context, settings) {

      // Only run this if a modal-redirect is on the page ready to use
      // And only run it once
      $('#modal-redirect').once().each(function() {

        var countriesToRedirect = ['ES', 'MX', 'US', 'FR'];
        var countrycode = oxGeovariation.get();
        var lang = drupalSettings.path.currentLanguage;

        // Only redirect for certain countrycodes
        if (countriesToRedirect.includes(countrycode)) {

          // Open the appropriate modal
          if (countrycode === 'US' && lang === 'en') {
            trigger_redirect_dialog('us', 'http://www.oxfamamerica.org?utm_medium=referral&utm_source=oxfam.org&utm_campaign=oi-lightbox');
          }
          else if (countrycode === 'FR' && lang === 'fr') {
            trigger_redirect_dialog('fr', 'https://www.oxfamfrance.org?utm_medium=referral&utm_source=oxfam.org&utm_campaign=oi-lightbox');
          }
          else if (countrycode === 'ES' && lang === 'es') {
            trigger_redirect_dialog('es', 'http://trackings.oxfamintermon.org/click.php?campanya=POPU-OXFAM&id_bp=ANONIMO&data_enviament=20161207&id_tracking=1612-PopUpOxfam&desti=http://www.oxfamintermon.org');
          }
          else if (countrycode === 'MX' && lang === 'es') {
            trigger_redirect_dialog('mx', 'https://www.oxfammexico.org/?utm_source=popupinternational');
          }

        }

      });

    }
  }

  function trigger_redirect_dialog(country, url) {
    // Get the redirect cookie if it exists.
    var redirect_cookie = get_cookie_value('oi_1234567_new_country_detect');

    // If the redirect cookie has been set and has the value 'no' then issue
    // a redirect. The value 'no' indicates the user does NOT want to stay on
    // the international site.
    if (redirect_cookie == 'no') {
      window.location.href = url;
    }

    // Check if the redirect cookie has not been set.
    if (redirect_cookie === false) {
      $( "#modal-redirect" ).dialog();

      // User closes the dialog.
      $("#modal-redirect").on('dialogclose', function(event) {
        // Set the cookie so next time we don't invoke this dialog
        $.cookie("oi_1234567_new_country_detect", "yes", {expires: 720, path: '/'});
      });

      // Bind the click event to the positive link.
      $('#oi-front-redirect-link-yes').on('click', function(event) {
        event.preventDefault();
        // Set the cookie and redirect to the correct site.
        $.cookie("oi_1234567_new_country_detect", "no", {expires: 720, path: '/'});
        window.location.href = url;
      });
    }
  }

  /**
   * Returns the cookie value if found otherwise false.
   *
   * @param cookie_name
   *   The cookie to search for.
   *
   * @return bool|{*}
   *   Returns false if not found or the cookie object.
   */
  function get_cookie_value(cookie_name) {
    if ($.cookie(cookie_name) === null || $.cookie(cookie_name) === ""
        || $.cookie(cookie_name) === "null" || $.cookie(cookie_name) === undefined) {
      //no cookie
      return false;
    }
    else {
      // we have cookie, so return cookie value
      return $.cookie(cookie_name);
    }

  }

})(jQuery, Drupal);
