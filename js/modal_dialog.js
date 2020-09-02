(function ($, Drupal) {
  Drupal.behaviors.modal_dialog = {
    attach: function (context, settings) {

      // Only run this if a modal-dialog is on the page ready to use
      // And only run it once
      $('#modal-dialog').once().each(function() {
        oxGeovariation.triggerModal(function(country) {
          modalDialogHelper.modalCallback(country)
        });
      });
    }
  };

  var modalDialogHelper = {

    modalCallback: function(country) {
      countryData = this.countrySettings[country];
      // Get the redirect session variable if it exists.
      var redirectToCountrySite = oxGeovariation.getSessionValue('ox_geovariation_stay_on_this_site');

      if (redirectToCountrySite === 'yes') {
        window.location.href = countryData.url;
      }
      else if (redirectToCountrySite === null) {
        this.showModalDialog(country);
      }
    },

    showModalDialog: function(country) {
      modalRedirect = $( "#modal-dialog" );
      // Update text in the dialog
      modalRedirect.addClass('modal-dialog--' + country);
      modalRedirect.find('.modal-dialog__title').text(countryData.title);
      modalRedirect.find('.modal-dialog__description').text(countryData.description);
      modalRedirect.find('.modal-dialog__link--positive').html(countryData.positive_text);
      modalRedirect.find('.modal-dialog__link--negative').html(countryData.negative_text);

      // Load up the modal dialog
      theDialog = modalRedirect.dialog(modalRedirect,{
        width: '90%',
        dialogClass: 'modal-dialog-dialog',
        modal: true,
      });

      // Bind the click event to the positive link.
      $('.modal-dialog__link--positive').on('click', function(event) {
        event.preventDefault();
        // Set the session variable and redirect to the correct site.
        oxGeovariation.setSessionValue('ox_geovariation_stay_on_this_site', 'yes');
        window.location.href = countryData.url;
      });

      // Bind the click event to the negative link.
      $('.modal-dialog__link--negative').on('click', function(event) {
        event.preventDefault();
        // Set the cookie so next time we don't invoke this dialog
        oxGeovariation.setSessionValue('ox_geovariation_stay_on_this_site', 'no');
        theDialog.dialog("close");
      });
    }

  }
})(jQuery, Drupal);
