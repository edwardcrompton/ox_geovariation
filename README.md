### Oxfam Geo Variations

#### Modal dialogs

The functionality for modal dialogs in this module may be better split in to a
dedicated module in future, which has a dependency on this one. See the docs on
[creating modal dialogs](/docs/developer-notes/modal-dialogs.md)

This module handles several other 'Geo variations'. See the next section of this
file for how these work and how to extend this module.

#### Structure of this module.

This module handles variations to pages depending on the geographic location of
a user. These variations are called geo variations.

Geo variations are usually editable and are stored in the database. For example,
in the case of calls to action, there is a Call to Action paragraph which
editors can use to add different call to action links for different countries.
Countries are identified using a two letter country code, e.g. 'US' for the
United States or 'IT' for Italy.

Javascript is used to query the page response headers in order to retrieve the
two letter country code. This means that server side processing in PHP is not
aware of which country the user is in. In PHP we must create an array of _all_
the possible geo variations and load them into an array that can be accessed
with javascript. In the case of the Call to Action, this is done in
GeoVariations::initialiseCtaLinks. The array is keyed by country code and
contains 'href' and 'content' keys which contain the call to action link url and
title. This array is stored in drupalSettings.affiliateCTALinks[] so that it is
available in javascript.

The 'geo' javascript library defined by this module fetches the two letter
country code after the page has loaded and stores it in browser session storage.
This is done in geo.js which makes a asynchronous request to the path /geo. This
path returns a blank response that contains the 'Country-Code' header supplied
by nginx. geo_helpers.js provides getter and setter methods that make reading
and writing to the session storage slightly easier.

call_to_action.js loads the country code and extracts the corresponding link for
that country code from drupalSettings.affiliateCtaLinks. It then makes the
necessary changes to the call to action HTML link to display the geo appropriate
link.

#### Testing

In the local Lando environment nginx is not configured to work with the Geo IP
database. However, we can emulate a request from a particular country by using a
parameter in the URL which bypasses this functionality.

A URL query parameter 'country-code' will be used as the basis of the geo
location if available. This allows the two letter country code to be forced in
any environment, assuming it is not already set. Open a incognito browser tab
and put ?country-code=XX on the end of the URL you are requesting, where XX is
the two letter country code.

It's also possible to modify the country code stored in the session. In Chrome
/ Chromium, do this at Web developer tools > Application > Session storage >
http://oxfamint.lndo.site and search the list for `Drupal.country-code.`

Edit the value of this session variable to the two letter country code you
require (e.g. GB, US, ES) and refresh the page.

#### Extending this module.

In order to add additional geo variations, there are two main steps to extending
this module.

1. Loading the geo variations in PHP

Add a new public static method to the GeoVariations PHP class called
initialise[description] where [description] is the type of geo variation
followed by the name of the HTML element being modified, often 'Links'.

This PHP method is responsible for:
- Loading an array of geo variations from the database, keyed appropriately.
- Writing that array to drupalSettings using an appropriate property name.
- Loading a javascript file that will carry out the modifications to the page
specific to this type of geo variation -see below.

In order to make use of the existing code for altering links, the array must be
structured in the following way:

- The array must be keyed by the two letter country code in capitals.
- Each value is a sub array keyed by the properties of the link to be rewritten,
e.g:

```
'MX' =>
  'href' => 'URL of the rewritten link'
  'title' => 'Title property of the link (<a title="something")'
  'content' => 'The text to be used for the link (inside <a></a>)
'US' =>
  etc...
```

Additional properties can be added to the array but they must be handled by the
javascript (described next) that acts upon them.  This is done in the switch
statement in the alterLink function in geo_helpers.js.

The PHP method you have created must be called in an appropriate Drupal hook.
See ox_geovariation.module for examples of existing hooks that call GeoVariation
::initialise methods.

2. Modifying the page with jQuery

Add a new .js file in the js/ directory which will contain jQuery code to
actually make the geo variation to the page. modal_seasonal.js can be used as a
template for this. The file should be named appropriately.

Add a library to ox_geovariation.libraries.yml to include the new js file you
added. See call_to_action and donate libraries in that file for examples of how
this is done.

See modal_seasonal.js or for an example of the javascript that should
go in your new file.

You'll notice that modal_seasonal.js has two main code blocks: The Drupal
behaviour that attaches a function to the appropriate element in the DOM of the
page and a callback (`modalSeasonalHelper` in this case) that will be called
when the country code has been successfully fetched. (See Asynchronous
Javascript below).

If the element(s) to be modified are links, the function
oxGeovariation.alterLink() can be called instead of writing your own. This takes
two arguments: The element object to be modified and the array of properties for
each geolocation that was added to the drupalSettings in step 1 above.

#### Changes to the theme

It is likely necessary to make some changes to the theme of the field that you
are adding a geo variation for. This will be in the form of a twig template and
will be added to the oxfaminto theme in oxfamint/drupal/templates.

#### The geovariation CSS class

When the page has been updated with geo variations, it is sometimes useful to
identify altered elements with a CSS class. For example, sometimes an element
is not visible until the geo variation has applied so it is useful to add a CSS
class that makes the element shown. See affiliate_link_block.js for an example
of this.

### Asynchronous Javascript

Javascript that has to run on the DOM only _after_ the geovariation has been
made has to run asynchronously. This is because we don't know how long it will
take to fetch the country code the first time we fetch it from the HTTP headers.

See the `trigger` method in `geo_helpers.js`. This method takes a callback
function that will be run when the country code has been successfully fetched.
Until this happens, the trigger method recursively calls itself a limited number
of times. During this time other javascript processes can still run.

If the country code is not fetched successfully after the limited number of
recursive tries, a message is written to the console and the geo variation is
aborted.
