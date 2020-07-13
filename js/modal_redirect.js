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

    redirectToCountrySiteFlagName: 'ox_geovariation_stay_on_this_site',

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
      // Get the redirect session variable if it exists.
      var redirectToCountrySite = this.getSessionValue(redirectToCountrySiteFlagName);

      if (redirectToCountrySite === true) {
        window.location.href = countryData.url;
      }
      else if (redirectToCountrySite === null) {
        this.showModalDialog();
      }
    },

    showModalDialog: function() {
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
        // Set the session variable and redirect to the correct site.
        sessionStorage.setItem(redirectToCountrySiteFlagName, true);
        window.location.href = countryData.url;
      });

      // Bind the click event to the negative link.
      $('.modal-redirect__link--negative').on('click', function(event) {
        event.preventDefault();
        // Set the cookie so next time we don't invoke this dialog
        sessionStorage.setItem(redirectToCountrySiteFlagName, false);
        theDialog.dialog("close");
      });
    }

  }
})(jQuery, Drupal);
