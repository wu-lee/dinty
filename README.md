dinty.js
=======

Javascript utilities for converting DINTY and FGHJK grid references
into coordinates.

Synopsis
--------

This module is useful for interpreting Ordnance Survey grid references
which use the "DINTY" or the "FGHJK" lettering schemes to label
squares of the map known as "tetrads" and "monads".  These are
commonly used in botanical and zoological surveys to indicate the
location of a recorded sighting with some deliberately limited
precision.

    var dinty = require('dinty.js')

    // Convert a DINTY coordinate letter to an XY coordinate
    var coord = dinty.dintyToXY("A") // {x: 0, y, 0}

    // Ditto for a FGHJK coordinate
    coord = dinty.fghjkToXY("A") // {x: 0, y: 4}

    // Convert an Ordinance Survey alphabetical coordinate pair to XY 
    coord = dinty.osAlphaToFalseOriginCoord(["G","T"])
    // returns {x: 800000, y: 1600000}

    // Convert an OS grid reference into an XY coordinate with 
    // an indication of the precision
    coord = dinty.gridrefToFalseOriginCoord("TU12345678")
    // returns {x: 1912340, y: 656780, precision: 10},


DINTY
-----

The "DINTY" tetrad scheme divides a square region into 5x5 subsquares,
lettered from south to north, then west to east.  The letter O is
omitted (to avoid confusion with the number 0).

    EJPUZ
    DINTY  <- gives the scheme the name
    CHMSX
    BGLRW
    AFKQV

See:

* http://sxbrc.org.uk/biodiversity/recording/ngr.php
* http://www.kmbrc.org.uk/recording/help/gridrefhelp.php?page=1
* https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid

FGHJK
-----

The OS's letter grid system likewise divides a square region into 5x5
subsquares, but in this case lettered from east to west, then north to
south, as below.  Also, the letter I is omitted, not the letter O
(this time to avoid confusion with the number 1).  By analogy to the
DINTY scheme I call this the FGHJK scheme.  Possibly pronounced
"fighjack", with a silent "gh".

    ABCDE
    FGHJK
    LMNOP
    QRSTU
    VWXYZ

There is a 500km grid, with the "false origin" at the junction of R S
W and X. The "false origin" is a point southwest of the British
mainland, such that all locations in the mainland can be given
positive coordinates relative to it.

Within each of these 500km squares is another 5x5 grid lettered in the
same manner.

See:

* http://www.ordnancesurvey.co.uk/oswebsite/gps/information/coordinatesystemsinfo/guidetonationalgrid/page9.html

Author
------

Nick Stokoe <github dot wu-lee at noodlefactory dot co dot uk>

Last updated March 2016

