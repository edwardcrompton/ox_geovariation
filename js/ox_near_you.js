(function ($, Drupal) {

  Drupal.behaviors.ox_near_you = {
    attach: function (context, settings) {

      $('#block-oxfamnearyou').once('oxfamnearyou').each(function() {
        // Get the users country code, and show that country
        var usersCountryCode = oxGeovariation.get();
        switchAffiliate(usersCountryCode);

        // Create a list of all the available affiliates
        var affiliateList = [];
        $('.affiliate').each(function() {
          var affiliateTitle = $(this).find('h3').text();
          var affiliateCode = $(this).attr('data-affiliate-country-code');
          affiliateList[affiliateCode] = affiliateTitle;
        })

        // Add a select list with the affiliates as options
        var selectElementLabel = '<label for="affiliate-selector" class="inline-block pr-6">' + Drupal.t('Choose an Oxfam affiliate') + '</label>';

        var option;
        var selectElement = $('<select>').prop('id', 'affiliate-selector');

        for (const affiliateCode in affiliateList) {
          option = $("<option>").prop('value', affiliateCode).text(affiliateList[affiliateCode])
          selectElement.append(option);
        }
        selectElement.val(usersCountryCode);
        $('#block-oxfamnearyou .near-you .affiliate:first').before(selectElementLabel).before(selectElement);

        // Add a listener for our new select list to alter the visible fields when selected
        $('#affiliate-selector').change(function() {
          chosenAffiliateCode = $(this).val();
          switchAffiliate(chosenAffiliateCode);
        })
      })
    }
  }

  function switchAffiliate(affiliateCode) {
    // Check whether affiliate is a valid one (if not, default to 'OI')
    if ($('*[data-affiliate-country-code=' + affiliateCode + ']').length == 0) {
      affiliateCode = 'OI';
    }
    // Hide all the affiliates
    $('.affiliate').hide();
    $('*[data-affiliate-country-code=' + affiliateCode + ']').show();
  }

})(jQuery, Drupal);
