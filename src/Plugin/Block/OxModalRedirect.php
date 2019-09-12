<?php

namespace Drupal\ox_geovariation\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides the 'OxModalRedirect' Block.
 *
 * This block will initially sit on the homepage, and will show a modal popup
 * if the user fits certain conditions.
 *
 * @Block(
 *   id = "ox_modal_redirect",
 *   admin_label = @Translation("Oxfam Modal Redirect"),
 *   category = @Translation("Oxfam"),
 * )
 */
class OxModalRedirect extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    return [
      '#theme' => 'ox_modal_redirect',
      '#title' => 'Oxfam International',
      '#lang' => 'en',
      '#text1' => 'text1',
      '#text2' => 'text2',
      '#text3' => 'text3',
      '#front_class' => 'front',
    ];

  }

}
