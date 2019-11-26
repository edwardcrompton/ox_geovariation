<?php

namespace Drupal\ox_geovariation\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides the 'OxModalSeasonal' Block.
 *
 * Displays a popup according to Oxfam US seasonal promotions.
 *
 * @Block(
 *   id = "ox_modal_seasonal",
 *   admin_label = @Translation("Oxfam Modal Seasonal"),
 *   category = @Translation("Oxfam"),
 * )
 */
class OxModalSeasonal extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'ox_modal_seasonal',
      '#attached' => [
        'library' => [
          'ox_geovariation/modal_redirect',
          'core/drupal.dialog',
        ],
      ],
    ];
  }
}
