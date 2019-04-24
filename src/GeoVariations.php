<?php
/**
 * @file
 *  Contains class GeoVariations.
 */

namespace Drupal\ox_geovariation;

/**
 * Class GeoVariations
 */
class GeoVariations {

  /**
   * Attaches Call to Action links to the js settings for a paragraph.
   *
   * @param array $variables
   *  Array of variables from a preprocess function.
   */
  public static function attachCTALinks(array &$variables) {
    $affiliateLinks = GeoVariations::loadCTALinks($variables['elements']['#paragraph']);
    $variables['#attached']['drupalSettings']['affiliateCTALinks'] = $affiliateLinks;
  }
  
  /**
   * Gets the donations link for each country code and exposes them to js.
   */
  public function loadDonationLinks(\Drupal\paragraphs\Entity\Paragraph $paragraph) {
    
  }

  /**
   * Gets the Call to Action links for each country code and exposes them to js.
   *
   * @param $paragraph
   *  A call to action paragraph object.
   *
   * @return
   *  An array of links relevant to affiliates.
   */
  public static function loadCTALinks(\Drupal\paragraphs\Entity\Paragraph $paragraph) {
    $affiliates = $paragraph->get('field_affiliate_call_to_action')->referencedEntities();

    $affiliateLinks = [];
    foreach ($affiliates as $affiliate) {
      $countryCode = $affiliate->get('field_affiliate_country_code')->value;
      $link = $affiliate->get('field_affiliate_url')->value;
      $affiliateTitle = $affiliate->get('field_affiliate_title')->value;
      $affiliateLinks[$countryCode] = array(
        $link,
        $affiliateTitle,
      );
    }

    return $affiliateLinks;
  }
}
