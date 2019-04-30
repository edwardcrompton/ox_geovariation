### Oxfam Geo Variations

#### Structure of this module.

This module handles variations to pages depending on the geographic location of
a user. These variations are called geo variations.

Geo variations are usually editable and are stored in the database. For example,
in the case of calls to action, there is a Call to Action paragraph which
editors can use to add different call to action links for different countries.
Countries are identified using a two letter country code, e.g. 'US' for the
United States or 'IT' for Italy.

Javascript is used to query the page response headers in order to retreive the
two letter country code. This means that server side processing in PHP is not
aware of which country the user is in. In PHP we must create an array of _all_
the possible geo variations and load them into an array that can be accessed
with javascript. In the case of the Call to Action, this is done in
GeoVariations::initialiseCTALinks. The array is keyed by country code and
contains 'url' and 'title' keys with contain the call to action link url and
title. This array is stored in drupalSettings.affiliateCTALinks[] so that it is
available in javascript.

The 'geo' javascript library defined by this module fetches the two letter
country code after the page has loaded and stores it in browser session storage.
This is done in geo.js which makes a asynchronous request to the path /geo. This
path returns a blank response that contains the 'Country-Code' header supplied
by nginx. geo_helpers.js provides getter and setter methods that make reading
and writing to the session storage slightly easier.

call_to_action.js loads the country code and extracts the corresponding link for
that country code from drupalSettings.affiliateCTALinks. It then makes the
necessary changes to the call to action HTML link to display the geo appropriate
link.

#### Testing

In Lando, nginx is set up to use a URL query parameter 'testip' as the basis of
the geo location if available. This allows the two letter country code to be
forced in our local environments. Just put ?testip=xx.xx.xx.xx on the end of the
URL you are requesting.

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

2. Modifying the page with jQuery

Add a new .js file in the js/ directory which will contain jQuery code to
actually make the geo variation to the page. call_to_action.js can be used as a
template for this. The file should be named appropriately. It will be loaded on
the page using the PHP method above.

#### Changes to the theme

It is likely necessary to make some changes to the theme of the field that you
are adding a geo variation for. This will be in the form of a twig template and
will be added to the oxfaminto theme in oxfamint/drupal/templates.
