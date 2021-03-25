<?php

namespace Drupal\Tests\ox_geovariation\Kernel;

/**
 * Mock affiliate Call to Action paragraph class.
 */
class MockAffiliateCtaParagraph {

  /**
   * Constructor for the mock object.
   */
  public function __construct($uri) {
    $this->mockLinkField = new MockLinkField();
    $this->mockLinkField->uri = $uri;
  }

  /**
   * Mock get method.
   *
   * @param mixed $fieldName
   *   The field name to return from the paragraph.
   *
   * @return \stdObject|\Drupal\Tests\ox_geovariation\Kernel\LinkField
   *   The field object from the paragraph.
   */
  public function get($fieldName) {
    switch ($fieldName) {
      case 'field_affiliate_link':
        return $this->mockLinkField;

      default:
        return new \stdObject();
    }
  }

}

/**
 * Mock link field class.
 */
class MockLinkField {
  /**
   * Mock uri from the paragraph field.
   *
   * @var string
   */
  public $uri;

}
