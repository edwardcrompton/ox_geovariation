(function ($, Drupal) {
  console.log('bogies');
  Drupal.behaviors.call_to_action = {
    attach: function (context, settings) {
      console.log(drupalSettings.affiliateCTALinks);
    }
  }
})(jQuery, Drupal);
