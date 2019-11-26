(function ($, Drupal) {
  Drupal.behaviors.modal_redirect = {
    attach: function (context, settings) {

      // Only run this if a modal-redirect is on the page ready to use
      // And only run it once
      $('#modal-redirect').once().each(function() {
        oxGeovariation.triggerModal(function(country) {
          modalRedirectHelper.modalCallback(country)
        });
      });
    }
  };

  var modalRedirectHelper = {
    countrySettings: {
      us: {
        country: 'us',
        url: 'http://www.oxfamamerica.org?utm_medium=referral&utm_source=oxfam.org&utm_campaign=oi-lightbox',
        title: 'Looks like you\'re in the USA',
        description: 'Please confirm your location so we can give you the best experience.',
        positive_text: 'United States',
        negative_text: 'Outside the US'
      },
      fr: {
        country: 'fr',
        url: 'https://www.oxfamfrance.org?utm_medium=referral&utm_source=oxfam.org&utm_campaign=oi-lightbox',
        title: 'Vous vous connectez depuis la france ?',
        description: 'Pour améliorer votre visite, choisissez une des options suivantes :',
        positive_text: 'Je voudrais aller sur le site<br>d’<strong>Oxfam France</strong>',
        negative_text: 'Je voudrais rester sur le site<br> d\'<strong>Oxfam International'
      },
      es: {
        country: 'es',
        url: 'http://trackings.oxfamintermon.org/click.php?campanya=POPU-OXFAM&id_bp=ANONIMO&data_enviament=20161207&id_tracking=1612-PopUpOxfam&desti=http://www.oxfamintermon.org',
        title: '¿nos visitas desde españa?',
        description: 'Para mejorar tu visita escoge una de las siguientes opciones:',
        positive_text: 'Quiero ir a<br><strong>Oxfam Intermón<br>(España)</strong>',
        negative_text: 'Quiero quedarme en<br><strong>Oxfam<br>Internacional</strong>'
      },
      mx: {
        country: 'mx',
        url: 'https://www.oxfammexico.org/?utm_source=popupinternational',
        title: '¿Nos visitas desde México?',
        description: 'Para mejorar tu visita elige una de las siguientes opciones:',
        positive_text: 'Quiero quedarme en<br>Oxfam Internacional',
        negative_text: 'Quiero ir a<br>Oxfam México'
      }
    },

    modalCallback: function(country) {
      countryData = this.countrySettings[country];
      // Get the redirect cookie if it exists.
      var redirect_cookie = this.getCookieValue('oi_1234567_new_country_detect');

      // If the redirect cookie has been set and has the value 'no' then issue
      // a redirect. The value 'no' indicates the user does NOT want to stay on
      // the international site.
      if (redirect_cookie == 'no') {
        window.location.href = countryData.url;
      }

      // Check if the redirect cookie has not been set.
      if (redirect_cookie === false) {
        modalRedirect = $( "#modal-redirect" );
        // Update text in the dialog
        modalRedirect.addClass('modal-redirect--' + country);
        modalRedirect.find('.modal-redirect__title').text(countryData.title);
        modalRedirect.find('.modal-redirect__description').text(countryData.description);
        modalRedirect.find('.modal-redirect__link--positive').html(countryData.positive_text);
        modalRedirect.find('.modal-redirect__link--negative').html(countryData.negative_text);

        // Load up the modal dialog
        theDialog = modalRedirect.dialog(modalRedirect,{
          width: '90%',
          dialogClass: 'modal-redirect-dialog',
          modal: true,
        });
        modalRedirect.show({title: 'Subscribe To Newsletter'});

        // Bind the click event to the positive link.
        $('.modal-redirect__link--positive').on('click', function(event) {
          event.preventDefault();
          // Set the cookie and redirect to the correct site.
          $.cookie("oi_1234567_new_country_detect", "no", {expires: 720, path: '/'});
          window.location.href = countryData.url;
        });

        // Bind the click event to the negative link.
        $('.modal-redirect__link--negative').on('click', function(event) {
          event.preventDefault();
          // Set the cookie so next time we don't invoke this dialog
          $.cookie("oi_1234567_new_country_detect", "yes", {expires: 720, path: '/'});
          theDialog.dialog("close");
        });
      }
    },

    /**
     * Returns the cookie value if found otherwise false.
     *
     * @param cookie_name
     *   The cookie to search for.
     *
     * @return bool|{*}
     *   Returns false if not found or the cookie object.
     */
    getCookieValue: function(cookie_name) {
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
  }
})(jQuery, Drupal);


