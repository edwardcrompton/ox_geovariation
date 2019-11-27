(function ($, Drupal) {
  Drupal.behaviors.modal_seasonal = {
    attach: function (context, settings) {

      // Only run this if a modal-redirect is on the page ready to use
      // And only run it once
      $('#block-oxfammodalseasonal').once().each(function() {
        oxGeovariation.trigger(function(country) {
          modalSeasonalHelper.modalCallback(country)
        });
      });
    }
  };

  var modalSeasonalHelper = {
    modalCallback: function(country) {
      // Get the cookie to see if the modal has already been shown.
      var modal_seasonal_cookie = oxGeovariation.getCookieValue('oi_geovariation_modal_seasonal');

      // Check if the modal has not been shown yet AND the user is from the US.
      if (modal_seasonal_cookie === false && country === 'US') {
        modalRedirect = $('#block-oxfammodalseasonal .reveal-overlay');
        modalRedirect.show();

        // Bind the click event to the negative link.
        $('#block-oxfammodalseasonal .lightbox-close').on('click', function(event) {
          event.preventDefault();
          modalRedirect.hide();
        });

        // Set the cookie so next time we don't invoke this dialog
        $.cookie("oi_geovariation_modal_seasonal", "done", {expires: 720, path: '/'});
      }
    },
  }
})(jQuery, Drupal);
