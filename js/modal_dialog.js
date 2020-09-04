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
      dialogSelector = '.modal-dialog--' + country.toLowerCase();

      // Do nothing if there is no modal dialog for the user's country.
      if ($(dialogSelector).length === 0) {
        return;
      }

      modalRedirect = $(dialogSelector);
      modalRedirect.show();
    }
  }
})(jQuery, Drupal);