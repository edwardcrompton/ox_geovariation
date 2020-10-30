(function ($, Drupal) {
  Drupal.behaviors.modal_dialog = {
    attach: function (context, settings) {

      // Run this once for all the modal dialogs in the region.
      $('.region--modals').once().each(function() {
        oxGeovariation.trigger(function(country) {
          modalDialogHelper.modalCallback(country)
        });
      });
    }
  };

  var modalDialogHelper = {
    modalCallback: function(country) {
      countryCode = country.toLowerCase();
      dialogSelector = '.modal-dialog--' + countryCode;

      // Do nothing if there is no modal dialog for the user's country.
      if ($(dialogSelector).length === 0) {
        return;
      }

      // If the selection was already set, don't show the dialog.
      selection = oxGeovariation.getPreviousDialogSelection(countryCode);
      if (selection) {
        if (selection === 'leave') {
          window.location.href = drupalSettings.ox_geovariations_modal[countryCode].url
        }
        return;
      }

      modalDialog = $(dialogSelector);

      // Display the modal dialog
      theDialog = modalDialog.dialog(modalDialog, {
        width: '90%',
        dialogClass: dialogSelector,
        modal: true,
      });

      // Bind the click event to the positive link.
      $('.modal-dialog__link--positive').on('click', function(event) {
        oxGeovariation.rememberSelectionIfSpecified(countryCode, 'leave');
      });

      // Bind the click event to the negative link.
      $('.modal-dialog__link--negative').on('click', function(event) {
        oxGeovariation.rememberSelectionIfSpecified(countryCode, 'stay');
        event.preventDefault();
        theDialog.dialog("close");
      });
    }
  }
})(jQuery, Drupal);