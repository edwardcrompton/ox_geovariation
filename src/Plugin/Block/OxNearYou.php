<?php

namespace Drupal\ox_geovariation\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ox_geovariation\GeoVariations;

/**
 * Provides the 'OxNearYou' Block.
 *
 * This block selects a local Oxfam office, whilst also allowing a user to
 * choose which country office they want the contact details for.  This was
 * built for the /contact-us page.
 *
 * @Block(
 *   id = "ox_near_you",
 *   admin_label = @Translation("Oxfam Near You"),
 *   category = @Translation("Oxfam"),
 * )
 */
class OxNearYou extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    $affiliates = GeoVariations::loadAffiliates();

    return [
      '#theme' => 'ox_near_you',
      '#nearyoutitle' => 'Oxfam near you',
      '#affiliates' => $affiliates,
      '#attached' => [
        'library' => [
          'ox_geovariation/near_you',
        ],
      ],
    ];

  }

}
