(function ($, Drupal) {

  Drupal.behaviors.ox_near_you = {
    attach: function (context, settings) {

      $('#block-oxfamnearyou').once('oxfamnearyou').each(function() {
        // Get the users country code, and show that country
        var usersCountryCode = 'MX';
        switchAffiliate(usersCountryCode);

        // Create a list of all the available affiliates
        var affiliateList = [];
        $('.affiliate').each(function() {
          var affiliateTitle = $(this).find('h3').text();
          var affiliateCode = $(this).attr('data-affiliate-country-code');
          affiliateList[affiliateCode] = affiliateTitle;
        })

        // Add a select list with the affiliates as options
        selectElement = '<label for="affiliate-selector" class="inline-block pr-6">Choose an Oxfam affiliate</label><select id="affiliate-selector">';
        for (affiliateCode in affiliateList) {
          selectElement = selectElement + '<option value="' + affiliateCode + '">' + affiliateList[affiliateCode] + '</option>';
        }
        selectElement = selectElement + '</select>';
        $('#block-oxfamnearyou .near-you .affiliate:first').before(selectElement);

        // Add a listener for our new select list to alter the visible fields when selected
        $('#affiliate-selector').change(function() {
          chosenAffiliateCode = $(this).val();
          switchAffiliate(chosenAffiliateCode);
        })
      })
    }
  }

  function switchAffiliate(affiliateCode) {
    // Hide all the affiliates
    $('.affiliate').hide();
    $('*[data-affiliate-country-code=' + affiliateCode + ']').show();
  }

})(jQuery, Drupal);
