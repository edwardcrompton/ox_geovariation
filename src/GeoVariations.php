<?php
/**
 * @file
 *  Contains class GeoVariations.
 */

namespace Drupal\ox_geovariation;

use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Class GeoVariations
 */
class GeoVariations {

  /**
   * Attaches Call to Action geo variation javascript for a paragraph.
   *
   * @param array $variables
   *  Array of variables from a preprocess function.
   */
  public static function initialiseCTALinks(array &$variables) {
    $paragraph = $variables['elements']['#paragraph'];

    $affiliateLinks = GeoVariations::loadCTALinks($paragraph);
    $variables['#attached']['drupalSettings']['affiliateCTALinks'] = $affiliateLinks;
    $variables['#attached']['library'][] = 'ox_geovariation/call_to_action';

    $defaultLink = GeoVariations::defaultCTALink($paragraph);
    $variables['default_link'] = $defaultLink;
  }

  /**
   * Creates a link using the default Call to Action fields.
   *
   * @param \Drupal\paragraphs\Entity\Paragraph $paragraph
   *  The paragraph object of type call_to_action.
   *
   * @return type
   */
  public static function defaultCTALink(\Drupal\paragraphs\Entity\Paragraph $paragraph) {
    $text = t($paragraph->get('field_title')->value);
    $url = Url::fromUri($paragraph->get('field_url')->value);

    return \Drupal::l($text, $url);
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
        'url' => $link,
        'title' => $affiliateTitle,
      );
    }

    return $affiliateLinks;
  }
}
