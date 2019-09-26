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

    // Get a paragraph ID so that if there is more than one geolocated paragraph
    // on the page, we can make sure we use the correct list of affiliate links
    // for each.
    $paragraphId = $paragraph->id->value;

    $affiliateLinks = static::loadCtaLinks($paragraph);
    $variables['#attached']['drupalSettings']['affiliateCTALinks_' . $paragraphId] = $affiliateLinks;
    $variables['#attached']['library'][] = 'ox_geovariation/call_to_action';

    $variables['attributes']['data-paragraph-id'] = $paragraphId;

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
   * Attaches the Donation link geo variation javascript for menu links.
   *
   * @param array $variables
   *   An array of variables from a preprocess function.
   */
  public static function initialiseSignupLinks(array &$variables) {
    $affiliate_urls = static::loadSignupLinks();
    $variables['#attached']['drupalSettings']['ox_geovariation']['affiliates'] = $affiliate_urls;
    $variables['#attached']['library'][] = 'ox_geovariation/affiliate_toggle_blocks';
    if ($variables['#form_id'] === 'subscriber_form') {
      $variables['#attached']['library'][] = 'ox_geovariation/force_affiliate_redirect';
    }
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
   * Load all the affiliate links ready to use.
   *
   * @param string $field_name
   *   The field we would like to get the url from.
   * @param string $langcode
   *   The langcode we want to filter these affiliates by.
   *
   * @return array
   *   An array of link arrays for each affiliate
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public static function loadLinks($field_name = 'field_url_donate', $langcode = NULL) {
    // This needs to be run on each page, so look in the cache first.
    $cid = static::$cacheIdNamespace . 'donation_links';
    if ($cache = \Drupal::cache()->get($cid)) {
      return $cache->data;
    }

    $query = \Drupal::entityQuery('node')
      ->condition('status', 1)
      ->condition('type', 'oxfam_affiliate');

    // If we have passed in a langcode, then we want to
    // filter the affiliates using it.
    if ($langcode) {
      $query->condition('langcode', $langcode, '=');
    }

    $nids = $query->execute();

    $affiliateLinks = [];
    foreach ($nids as $nid) {
      $node = \Drupal::entityManager()->getStorage('node')->load($nid);
      $countryCode = $node->get('field_country_code')->getString();
      $affiliateTitle = $node->get('title')->getString();
      $affiliateLinks[$countryCode] = [
        'href' => $node->get($field_name)->getString(),
        'title' => t('Donate via @title', ['@title' => $affiliateTitle]),
      ];
    }

    // Cache for next time.
    \Drupal::cache()->set($cid, $affiliateLinks);

    return $affiliateLinks;
  }

  /**
   * Gets the Signup links for each country, grouped by langcode.
   *
   * @return array
   *   An array of languages the site supports, each containing the
   *   affiliates for that language
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public static function loadSignupLinks() {
    // Get all default languages for the site.
    $languages = _get_languages('default');
    $affiliate_urls = [];
    // Loop through all languages enabled for affiliate urls.
    foreach ($languages as $langcode => $language) {
      // Create a placeholder array for this language
      // so we can fill it up with affiliate_urls.
      $affiliate_urls[$langcode] = [];
      // Loop through all Offices.
      $affiliate_urls[$langcode] = static::loadLinks('field_url_signup', $langcode);
    }

    return $affiliate_urls;
  }

  /**
   * Gets the donations link for each country code and exposes them to js.
   */
  public static function loadDonationLinks() {
    $affiliateLinks = static::loadLinks();
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

  /**
   * Adds js to alter the affiliate link block.
   *
   * @param array $variables
   *   An array of variables from a preprocess function.
   */
  public static function alterAffiliateLinkBlock(array &$variables) {
    if ($variables['elements']['#id'] === 'linktoaffiliate') {
      $variables['#attached']['library'][] = 'ox_geovariation/affiliate_link_block';
    }
  }

}
