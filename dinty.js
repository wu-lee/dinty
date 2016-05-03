
/** Dinty module
 *
 * Javascript utilities for converting Ordnance Survey grid references
 * into cartesian coordinates, with support for DINTY labelled tetrad
 * references.
 *
 * @module dinty
 *
 * @copyright Nick Stokoe 2016 
 */


var gridref_rx = /^([a-z])([a-z])(\d*)([a-z])?$/i;

/** Make a look-up function from alphabetical labels to column and row indexes.
 *
 * The assumption is this is for a 5 by 5 grid, indexed by a pair of
 * integers `(I, J)`. The labelling starts with the character given by
 * `offset` for `(0, 0)` and continues, incrementing `I` first and then
 * `J`, using 26 characters, but omitting the character given by
 * `omitted`.
 *
 * The returned function will take a character in that range, and return
 * an array with the two indexes, `[i, j]`.
 *
 * The returned function will throw an Error if the character is out
 * of range or equal to the character set by `omitted`.
 *
 * @param {String} offset The first character of this indicates the
 * first character of the sequence
 *
 * @param {String} omitted The first character of this indicates a
 * character to omit from the sequence.
 *
 * @returns {Function} A look-up function as described.
 * @private
 */
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
	return [i, j];
    };
}

/** Maps Ordnance Survey grid-ref lettering to an index pair.
 *
 * Note that the indexes returned need to be mapped to get the sense
 * used by the OS grid-ref. [i, j] -> [j, 4-i].
 *
 * Generated using {@link makeAlphaToIJ}.
 * @private
 */
var fghjkToIJ = makeAlphaToIJ("A", "I");

/** Maps DINTY grid-ref lettering to an index pair 
 *
 * Generated using {@link makeAlphaToIJ}.
 * @private
 */
var dintyToIJ = makeAlphaToIJ("A", "O");

/** Convert a DINTY coordinate letter to an XY index pair.
 *
 *     EJPUZ
 *     DINTY
 *     CHMSX
 *     BGLRW
 *     AFKQV
 *
 * In the returned coordinates, (0,0) indicates the south-western
 * square, (4,4) the north-eastern, (4,0) the south-eastern and (0,4)
 * the north-western.
 *
 * @param {String} alpha An upper case character A-Z (but not O).
 *
 * @returns {Object} An object with integer attributes `x` (west to
 * east) and `y` (south to north).
 *
 * @throws an Error if either parameter is not an upper case
 * DINTY-scheme letter.
 *
 * @instance
 */
function dintyToXY(alpha) {
    var ij = dintyToIJ(alpha);
    return {
	x: ij[0],
	y: ij[1]
    };
}

/** Convert a FGHJK coordinate letter to an XY index pair.
 *
 *     ABCDE
 *     FGHJK
 *     LMNOP
 *     QRSTU
 *     VWXYZ
 *
 * In the returned coordinates, (0,0) indicates the south-western
 * square, (4,4) the north-eastern, (4,0) the south-eastern and (0,4)
 * the north-western.
 *
 * @param {String} alpha An upper case character A-Z (but not I).
 *
 * @returns {Object} An object with integer attributes `x` (west to
 * east) and `y` (south to north).
 *
 * @throws an Error if either parameter is not an upper case
 * FGHJK-scheme letter.
 *
 * @instance
 */
function fghjkToXY(alpha) {
    var ij = fghjkToIJ(alpha);
    return {
	x: ij[1],
	y: 4-ij[0]
    };
}

/** Converts a top-level 2-letter Ordnance Survey grid ref into the
 * coordinate of the square's south-western corner in meters relative
 * to the false origin.
 *
 * In the returned coordinates, (0,0) indicates the south-western
 * square, (0,240000) the north-eastern, (240000,0) the south-eastern
 * and (0,240000) the north-western.
 *
 * @param {String} grid500km A FGHJK-scheme letter indicating the 500km
 * square.
 *
 * @param {String} grid100km A FGHJK-scheme letter indicating the
 * 100km square
 *
 * @returns {Object} An object with integer attributes `x` (west to
 * east) and `y` (south to north), possible values ranging from 0 to
 * 240000 in steps of 100000.
 *
 * @throws an Error if either parameter is not an upper case
 * FGHJK-scheme letter. However, trailing characters are ignored.
 *
 * @instance
 */
function osAlphaToFalseOriginCoord(grid500km, grid100km) {
    var coord500km = fghjkToXY(grid500km);
    var coord100km = fghjkToXY(grid100km);

    return {
	x: 100000 * (5 * coord500km.x + coord100km.x),
	y: 100000 * (5 * coord500km.y + coord100km.y)
    };
}

/** Converts a DINTY tetrad label into the coordinate of the square's
 * south-western corner in meters relative to the hectad's
 * south-western corner.
 *
 * Tetrads have a fixed scale of 2km square.  In the returned
 * coordinates, (0,0) indicates the south-western square, (0,8000)
 * the north-eastern, (8000,0) the south-eastern and (0,8000) the
 * north-western.
 *
 * @param {String} alpha A DINTY-scheme letter indicating the
 * tetrad.
 *
 * @returns {Object} An object with integer attributes `x` (west to
 * east) and `y` (south to north), possible values from 0 to 8000 in
 * steps of 2000.
 *
 * @throws an Error if the parameter is not an upper case
 * DINTY-scheme letter. However, trailing characters are ignored.
 *
 * @instance
 */
function tetradToFalseOriginCoord(alpha) {
    var offset = dintyToXY(alpha);
    return {
	x: offset.x * 2000,
	y: offset.y * 2000
    };
}

/** Convert an arbitrary grid reference string into the coordinate of
 * the square's south-western corner relative to the false origin, and
 * a size, in meters.
 *
 * The grid reference can be of the form:
 *
 * * `ABxy` - where
 *   - `A` and `B` are 500 and 100km FGHJK grid labels, and
 *   - `x` and `y` are zero or more digit eastward/northward offsets respectively.
 * * `ABnmT` - where
 *   - `A` and `B` are 500 and 100km FGHJK grid labels, and
 *   - `n` and `m` are single digit eastward/northward offsets, respectively, and
 *   - `T` is a DINTY tetrad label.
 *
 * @param {String} gridref A grid reference string.
 *
 * @returns {Object} An object with integer attributes `x` (distance
 * east of the false origin) and `y` (distance north of it), possible
 * values from 0 to 250000, and an attribute `precision` indicating
 * the size of the square, all in meters.
 *
 * @throws an Error if `A` or `B` are not an upper case FGHJK-scheme
 * letters, or if `T` is not an upper case DINTY-scheme letter, or if
 * `n` or `m` are not single digits. However, `x` and `y` may be any
 * length so long as they are all digits.
 *
 * @instance
 */
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
			    "with wrong numeric precision ("+eastnothings.length+" digit reference): "+gridref);

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


/** Convert an arbitrary grid reference string into the coordinate of
 * the square's south-western corner relative to the given origin.
 *
 * The grid reference can as defined in {@link gridrefToFalseOriginCoord}.
 *
 * @param {String} gridref A grid reference string.
 *
 * @param {Object} origin A coordinate relative to the false origin,
 * in meters, expressed as an object with numeric `x` and `y`
 * attributes.
 *
 * @returns {Object} An object with integer attributes `x` (distance
 * east of `origin`) and `y` (distance north of it), and an attribute
 * `precision` indicating the size of the square, all in meters.
 *
 * @throws an Error if `A` or `B` are not an upper case FGHJK-scheme
 * letters, or if `T` is not an upper case DINTY-scheme letter, or if
 * `n` or `m` are not single digits. However, `x` and `y` may be any
 * length so long as they are all digits.
 *
 * @instance
 */
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

