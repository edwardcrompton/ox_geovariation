(function ($, Drupal) {

  Drupal.behaviors.ox_near_you = {
    attach: function (context, settings) {

      $('#block-oxfamnearyou').once('oxfamnearyou').each(function() {

        // Get the user's country code, and show that affiliate initially.
        var initialAffiliateCode = getInitialAffiliateCode();
        setAffiliate(initialAffiliateCode);

        // Create an array of all the available affiliates
        var affiliateArray = [];
        $('.affiliate').each(function() {
          var affiliateTitle = $(this).find('h3').text();
          var affiliateCode = $(this).attr('data-affiliate-country-code');
          affiliateArray[affiliateCode] = affiliateTitle;
        })

        // Add a select list with the affiliates as options
        var selectElementLabel = '<label for="affiliate-selector" class="inline-block pr-6">' + Drupal.t('Choose an Oxfam affiliate') + '</label>';
        var selectElement = $('<select>').prop('id', 'affiliate-selector');

        for (const affiliateCode in affiliateArray) {
          var option = $("<option>").prop('value', affiliateCode).text(affiliateArray[affiliateCode])
          if (affiliateCode === initialAffiliateCode) {
            option.prop('selected', true);
          }
          selectElement.append(option);
        }
        $('#block-oxfamnearyou .near-you .affiliate:first').before(selectElementLabel).before(selectElement);

        // Add a listener for our new select list to alter the visible fields when selected
        $('#affiliate-selector').change(function() {
          chosenAffiliateCode = $(this).val();
          setAffiliate(chosenAffiliateCode);
        });
      });
    }
  };

  /**
   * Sets the visible affiliate.
   */
  function setAffiliate(affiliateCode) {
     // Hide all the affiliates and select only the relevant one.
    $('.affiliate').hide();
    $('*[data-affiliate-country-code=' + affiliateCode + ']').show();
  }

  /**
   * Returns the relevant affiliate code for the location of the user.
   */
  function getInitialAffiliateCode() {
    var countryCode = oxGeovariation.get();

    // Check whether country code corresponds to an affiliate.
    if ($('*[data-affiliate-country-code=' + countryCode + ']').length == 0) {
      return 'OI';
    }
    return countryCode;
  }

})(jQuery, Drupal);
