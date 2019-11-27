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
    switch ($variables['#form_id']) {
      case 'subscriber_form':
        $affiliate_urls = static::loadSignupLinks();
        $variables['#attached']['drupalSettings']['affiliateSignUpLinks'] = $affiliate_urls;
        $variables['#attached']['library'][] = 'ox_geovariation/force_affiliate_redirect';
        break;

      case 'subscribe_mini_form':
        $affiliate_urls = static::loadSignupLinks();
        $variables['#attached']['drupalSettings']['affiliateSignUpLinks'] = $affiliate_urls;
        $variables['#attached']['library'][] = 'ox_geovariation/affiliate_signup_block';
        break;

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
   * @param string $titlePrefix
   *   The prefix for all the link titles.
   *
   * @return array
   *   An array of link arrays for each affiliate
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public static function loadLinks($field_name = 'field_url_donate', $langcode = NULL, $titlePrefix = 'Donate via') {
    // This needs to be run on each page, so look in the cache first.
    $cid = static::$cacheIdNamespace . 'donation_links' . $field_name . $langcode;
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
        'title' => t('@prefix @title', ['@title' => $affiliateTitle, '@prefix' => $titlePrefix]),
      ];
    }

    // Cache for next time.
    \Drupal::cache()->set($cid, $affiliateLinks);

    return $affiliateLinks;
  }

  /**
   * Loads all of the affiliates for the site.
   *
   * @return array
   *   An array of affiliates
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public static function loadAffiliates() {
    $affiliates = [];

    $query = \Drupal::entityQuery('node')
      ->condition('status', 1)
      ->condition('type', 'oxfam_affiliate');
    $nids = $query->execute();

    foreach ($nids as $nid) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);

      if (!empty($node)) {
        $countryCode = $node->get('field_country_code')->getString();

        $affiliate = [
          'country_code' => $countryCode,
          'title' => $node->get('title')->getString(),
          'url' => $node->get('field_url_site')->getString(),
        ];

        $executives = $node->get('field_executives')->getValue();
        foreach ($executives as $executive_ids) {
          $executive = Paragraph::load($executive_ids['target_id']);
          $title = $executive->get('field_title')->getString();
          $affiliate[$title] = $executive->get('field_name')->getString();
        }

        $address_ids = $node->get('field_address')->getValue();
        $addresses = [];
        foreach ($address_ids as $address_id) {
          $address_id = $address_id['target_id'];
          $address_entity = Paragraph::load($address_id);
          $addresses[$address_id]['phone'] = $address_entity->get('field_phone')->getString();
          $addresses[$address_id]['fax'] = $address_entity->get('field_fax')->getString();
          $addresses[$address_id]['email'] = $address_entity->get('field_email')->getString();
          $addresses[$address_id]['address'] = $address_entity->field_address->view();
        }
        $affiliate['addresses'] = $addresses;

        $affiliates[$countryCode] = $affiliate;
      }
    }

    return $affiliates;
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
      $affiliate_urls[$langcode] = static::loadLinks('field_url_signup', $langcode, 'Sign up via');
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

  /**
   * Adds js to control the modal seasonal block.
   *
   * @param array $variables
   *   An array of variables from a preprocess function.
   */
  public static function alterModalSeasonal(array &$variables) {
    if ($variables['elements']['#id'] === 'oxfammodalseasonal') {
      $variables['#attached']['library'][] = 'ox_geovariation/modal_seasonal';
    }
  }

}
