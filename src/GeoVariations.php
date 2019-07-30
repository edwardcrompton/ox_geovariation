<?php

namespace Drupal\ox_geovariation;

use Drupal\paragraphs\Entity\Paragraph;

/**
 * Class GeoVariations.
 */
class GeoVariations {

  private static $cacheIdNamespace = 'ox_geovariation:';

  /**
   * Attaches Call to Action geo variation javascript for a paragraph.
   *
   * @param array $variables
   *   Array of variables from a preprocess function.
   */
  public static function initialiseCtaLinks(array &$variables) {
    $paragraph = $variables['elements']['#paragraph'];

    $affiliateLinks = static::loadCtaLinks($paragraph);
    $variables['#attached']['drupalSettings']['affiliateCTALinks'] = $affiliateLinks;
    $variables['#attached']['library'][] = 'ox_geovariation/call_to_action';

    $defaultLink = static::defaultCtaLink($paragraph);
    $variables['default_link'] = $defaultLink;
  }

  /**
   * Attaches the Donation link geo variation javascript for menu links.
   *
   * @param array $variables
   *   An array of variables from a preprocess function.
   */
  public static function initialiseDonationLinks(array &$variables) {
    $affiliateLinks = static::loadDonationLinks();
    $variables['#attached']['drupalSettings']['affiliateDonationLinks'] = $affiliateLinks;
    $variables['#attached']['library'][] = 'ox_geovariation/donate';
  }

  /**
   * Creates a link using the default Call to Action fields.
   *
   * @param \Drupal\paragraphs\Entity\Paragraph $paragraph
   *   The paragraph object of type call_to_action.
   *
   * @return mixed
   *   The default call to action link.
   */
  public static function defaultCtaLink(Paragraph $paragraph) {
    // @Todo: This was bad. It used a deprecated function (Drupal::l) and it
    // assumed that the URI is an external one, which it isn't sometimes.
    // The underlying issue is that the CTA link field should be a _link_ field
    // not a pair of text fields.
    return '';
  }

  /**
   * Gets the donations link for each country code and exposes them to js.
   */
  public static function loadDonationLinks() {
    // This needs to be run on each page, so look in the cache first.
    $cid = static::$cacheIdNamespace . 'donation_links';
    if ($cache = \Drupal::cache()->get($cid)) {
      return $cache->data;
    }

    $query = \Drupal::entityQuery('node')
      ->condition('status', 1)
      ->condition('type', 'oxfam_affiliate');

    $nids = $query->execute();

    $affiliateLinks = [];
    foreach ($nids as $nid) {
      $node = \Drupal::entityManager()->getStorage('node')->load($nid);
      $countryCode = $node->get('field_country_code')->getString();
      $affiliateTitle = $node->get('title')->getString();
      $affiliateLinks[$countryCode] = [
        'href' => $node->get('field_url_donate')->getString(),
        'title' => t('Donate via @title', ['@title' => $affiliateTitle]),
      ];
    }

    // Cache for next time.
    \Drupal::cache()->set($cid, $affiliateLinks);

    return $affiliateLinks;
  }

  /**
   * Gets the Call to Action links for each country code and exposes them to js.
   *
   * @param \Drupal\paragraphs\Entity\Paragraph $paragraph
   *   A call to action paragraph object.
   *
   * @return array
   *   An array of links relevant to affiliates.
   */
  public static function loadCtaLinks(Paragraph $paragraph) {
    $affiliates = $paragraph->get('field_affiliate_call_to_action')->referencedEntities();

    $affiliateLinks = [];
    foreach ($affiliates as $affiliate) {
      $countryCode = $affiliate->get('field_affiliate_country_code')->value;
      $link = $affiliate->get('field_affiliate_link')->uri;
      $linkTitle = $affiliate->get('field_affiliate_link')->title;
      $affiliateLinks[$countryCode] = [
        'href' => $link,
        'content' => $linkTitle,
      ];
    }

    return $affiliateLinks;
  }

}
