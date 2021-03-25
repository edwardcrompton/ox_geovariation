<?php

namespace Drupal\Tests\ox_geovariation\Kernel;

use Drupal\KernelTests\KernelTestBase;
use Drupal\ox_geovariation\GeoVariations;

/**
 * Tests for GeoVariations.
 *
 * @coversDefaultClass \Drupal\ox_geovariation\GeoVariations
 */
class GeoVariationsTest extends KernelTestBase {

  /**
   * @covers ::getAffiliateHref
   */
  public function testGetAffiliateHref() {
    $href = GeoVariations::getAffiliateHref('https://oxfam.org.uk/donate');
    $this->assertEquals('https://oxfam.org.uk/donate', $href);

    $href = GeoVariations::getAffiliateHref('internal:/en/about');
    $this->assertEquals('/en/about', $href);

    $href = GeoVariations::getAffiliateHref('base:node/1');
    $this->assertEquals('/node/1', $href);

    // @todo Add a test in here for entity:node/1
  }

}
