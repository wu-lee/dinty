
/* dinty.js
   Authored by Nick Stokoe (c) 2016 */

var gridref_rx = /^([a-z])([a-z])(\d*)([a-z])?$/i;

function makeAlphaToIJ(offset, omitted) {

    var baseOrd = offset.charCodeAt(0);
    var omitOrd = omitted.charCodeAt(0);

    return function(alpha) {
	var ord = alpha.charCodeAt(0);
	var index = ord - baseOrd;
	if (index < 0 || index > 25 || ord == omitOrd)
	    throw new Error("invalid grid reference letter '"+alpha+"'");
	
	if (ord > omitOrd)
	    index -= 1;

	var i = Math.floor(index / 5);
	var j = index - i*5;
	return [i, j]
    };
}

// Accepts an *upper* case letter representing an OS grid letter.
// Returns an object containing row and a column attribute, each an
// integer in the range 0 .. 4
var fghjkToIJ = makeAlphaToIJ("A", "I");
var dintyToIJ = makeAlphaToIJ("A", "O");

function dintyToXY(alpha) {
    var ij = dintyToIJ(alpha);
    return {
	x: ij[0],
	y: ij[1]
    };
}

function fghjkToXY(alpha) {
    var ij = fghjkToIJ(alpha);
    return {
	x: ij[1],
	y: 4-ij[0]
    };
}

// Resulting coordinates are in units of meters.
function osAlphaToFalseOriginCoord(grid500km, grid100km) {
    var coord500km = fghjkToXY(grid500km);
    var coord100km = fghjkToXY(grid100km);

    return {
	x: 100000 * (5 * coord500km.x + coord100km.x),
	y: 100000 * (5 * coord500km.y + coord100km.y)
    };
}

// Tetrads have a fixed scale of 2km square.  Resulting coord is an
// offset in meters from the hectad bottom-left corner.
function tetradToFalseOriginCoord(alpha) {
    var offset = dintyToXY(alpha);
    return {
	x: offset.x * 2000,
	y: offset.y * 2000
    };
}

function gridrefToFalseOriginCoord(gridref) {
    var match = gridref_rx.exec(gridref);
    if (!match) 
	throw new Error("malformed grid reference: "+gridref);

    var grid5k = match[1];
    var grid1k = match[2]
    var eastnothings = match[3];
    var tetradId = match[4];
    var tetradCoord = { x: 0, y: 0 }; // default

    if (eastnothings.length & 1)
	throw new Error("malformed grid reference contains uneven numeric component "+
			"with "+eastnothings.length+" digits");

    var numDigits = eastnothings.length >> 1; // integer divide by 2
    var scale = Math.pow(10, 5 - numDigits); // in meters - i.e. 5 digits has a 1 meter precision


    var eastings = eastnothings.slice(0, numDigits)*scale;
    var northings = eastnothings.slice(numDigits)*scale;
    
    var coord = osAlphaToFalseOriginCoord(grid5k, grid1k);

    if (tetradId) {
	// If a tetrad id is suffixed, we must have a 2 digit grid reference
	if (eastnothings.length != 2)
	    throw new Error("malformed grid reference contains tetrad suffix "+
			    "with wrong numeric precision ("+eastnothings.length+" digit reference)");

	// convert the tetrad component
	tetradCoord = tetradToFalseOriginCoord(tetradId);

	// set the scale
	scale = 2000;
    }

    return {
	x: coord.x + eastings + tetradCoord.x,
	y: coord.y + northings + tetradCoord.y,
	precision: scale
    };
}


function gridrefToRelativeCoord(gridref, origin) {
    var coord = gridrefToFalseOriginCoord(gridref);

    coord.x -= origin.x;
    coord.y -= origin.y;

    return coord;
}


module.exports = {
    gridrefToRelativeCoord: gridrefToRelativeCoord,
    gridrefToFalseOriginCoord: gridrefToFalseOriginCoord,
    tetradToFalseOriginCoord: tetradToFalseOriginCoord,
    osAlphaToFalseOriginCoord: osAlphaToFalseOriginCoord,
    fghjkToXY: fghjkToXY,
    dintyToXY: dintyToXY,
};

