<?php

namespace Drupal\ox_geovariation\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\address\Plugin\Field\FieldFormatter\CountryDefaultFormatter;

/**
 * Plugin implementation of the 'country_code' formatter.
 *
 * @FieldFormatter(
 *   id = "address_country_code",
 *   label = @Translation("Two letter code"),
 *   field_types = {
 *     "address_country",
 *   },
 * )
 */
class CountryCodeFormatter extends CountryDefaultFormatter {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $countries = $this->countryRepository->getList();
    $elements = [];
    foreach ($items as $delta => $item) {
      $elements[$delta] = [
        '#plain_text' => $item->value,
        '#cache' => [
          'contexts' => [
            'languages:' . LanguageInterface::TYPE_INTERFACE,
          ],
        ],
      ];
    }

    return $elements;
  }

}
