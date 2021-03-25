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
    $affiliateParagraph = new MockAffiliateCtaParagraph('https://oxfam.org.uk/donate');
    $href = GeoVariations::getAffiliateHref($affiliateParagraph);
    $this->assertEquals('https://oxfam.org.uk/donate', $href);

    $affiliateParagraph = new MockAffiliateCtaParagraph('internal:/en/about');
    $href = GeoVariations::getAffiliateHref($affiliateParagraph);
    $this->assertEquals('/en/about', $href);

    $affiliateParagraph = new MockAffiliateCtaParagraph('base:node/1');
    $href = GeoVariations::getAffiliateHref($affiliateParagraph);
    $this->assertEquals('/node/1', $href);

    // @todo Add a test in here for entity:node/1
  }

}
