'use strict';
var QUnit;
if (typeof QUnit == 'undefined') // if your tests also run in the browser...
     QUnit = require('qunit-cli');

var dinty = require('dinty.js');



function testCases(config) {
    var cases = config.cases;
    var func = config.function;
    var that = config.object;

    test(config.title, function() {
	
        cases.forEach(function(caseData, ix) {
	    var input = caseData[0];

	    if (!(input instanceof Array))
		input = [input];

            var expected = caseData[1];
	    var msg = caseData[2];
	    
	    if (expected instanceof RegExp) {
		msg || (msg = config.title+": given '"+input+"' fails with error matching "+expected);
		throws(function() {
		    func.apply(that, input)
		}, expected, msg);
	    }
	    else {
		msg || (msg = config.title+": given '"+input+"' returns '"+expected+"'");
		var output = func.apply(that, input);
		deepEqual( output, expected, msg );
	    }
	});
    });
}


testCases({
    title: "dintyToXY",
    function: dinty.dintyToXY,
    cases: [
	["A", {x: 0, y: 0}],
	["E", {x: 0, y: 4}],
	["I", {x: 1, y: 3}],
	["M", {x: 2, y: 2}],
	["R", {x: 3, y: 1}],
	["V", {x: 4, y: 0}],
	["Z", {x: 4, y: 4}],
	
	["O", /invalid grid reference letter 'O'/],
	["a", /invalid grid reference letter 'a'/],
	["z", /invalid grid reference letter 'z'/],
	["0", /invalid grid reference letter '0'/],
	[" ", /invalid grid reference letter ' '/],
	["[", /invalid grid reference letter '\['/]
   ]
});

testCases({
    title: "fghjkToXY",
    function: dinty.fghjkToXY,
    cases: [
	["V", {x: 0, y: 0}],
	["A", {x: 0, y: 4}],
	["G", {x: 1, y: 3}],
	["N", {x: 2, y: 2}],
	["T", {x: 3, y: 1}],
	["Z", {x: 4, y: 0}],
	["O", {x: 3, y: 2}],
	["E", {x: 4, y: 4}],
	
	["I", /invalid grid reference letter 'I'/],
	["a", /invalid grid reference letter 'a'/],
	["z", /invalid grid reference letter 'z'/],
	["0", /invalid grid reference letter '0'/],
	[" ", /invalid grid reference letter ' '/],
	["[", /invalid grid reference letter '\['/]
   ]
});


testCases({
    title: "osAlphaToFalseOriginCoord",
    function: dinty.osAlphaToFalseOriginCoord,
    cases: [
	[["A","A"], {x: 0, y: 4*500*1000 + 4*100*1000}],
	[["Z","Z"], {x: 4*500*1000 + 4*100*1000, y: 0}],
	[["G","T"], {x: 1*500*1000 + 3*100*1000, y: 3*500*1000 + 1*100*1000}],
	[["V","V"], {x: 0, y: 0}],
	[["N","N"], {x: 2*500*1000 + 2*100*1000, y: 2*500*1000 + 2*100*1000}],
	[["E","E"], {x: 4*500*1000 + 4*100*1000, y: 4*500*1000 + 4*100*1000}],

	[["I","O"], /invalid grid reference letter 'I'/],
	[["O","I"], /invalid grid reference letter 'I'/],
	[["o","o"], /invalid grid reference letter 'o'/],
   ]
});


testCases({
    title: "gridrefToFalseOriginCoord",
    function: dinty.gridrefToFalseOriginCoord,
    cases: [
	["VV00", {x: 0, y: 0, precision: 10000}],
	["VV0000", {x: 0, y: 0, precision: 1000}],
	["VV000000", {x: 0, y: 0, precision: 100}],
	["VV00000000", {x: 0, y: 0, precision: 10}],
	["VV0000000000", {x: 0, y: 0, precision: 1}],
	["VV000000000000", {x: 0, y: 0, precision: 0.1}],
	["EE", {x: 4*500*1000 + 4*100*1000, y: 4*500*1000 + 4*100*1000, precision: 100000}],
	["EE00", {x: 4*500*1000 + 4*100*1000, y: 4*500*1000 + 4*100*1000, precision: 10000}],
	["VV42", {x: 4*10000, y: 2*10000, precision: 10000}],
	["AB12", {x: 0*500*1000 + 1*100*1000 + 1*10000, y: 4*500*1000 + 4*100*1000 + 2*10000, precision: 10000}],
	["GH1234", {x: 1*500*1000 + 2*100*1000 + 12*1000, y: 3*500*1000 + 3*100*1000 + 34*1000, precision: 1000}],
	["NO123456", {x: 2*500*1000 + 3*100*1000 + 123*100, y: 2*500*1000 + 2*100*1000 + 456*100, precision: 100}],
	["TU12345678", {x: 3*500*1000 + 4*100*1000 + 1234*10, y: 1*500*1000 + 1*100*1000 + 5678*10, precision: 10}],
	["ZV1234567890", {x: 4*500*1000 + 0*100*1000 + 12345*1, y: 0*500*1000 + 0*100*1000 + 67890*1, precision: 1}],

	["E", /malformed grid reference: E/],
	["E6", /malformed grid reference: E6/],
	["II", /invalid grid reference letter 'I'/],
	["AAA", /malformed grid reference contains tetrad suffix with wrong numeric precision \(0/],
	["VV0", /malformed grid reference contains uneven numeric component with 1 digit/],
	["VV000", /malformed grid reference contains uneven numeric component with 3 digits/],
	["VV00000", /malformed grid reference contains uneven numeric component with 5 digits/],
	["VV0000000", /malformed grid reference contains uneven numeric component with 7 digits/],
	["VV000000000", /malformed grid reference contains uneven numeric component with 9 digits/],

	// tetrad suffixes 258.9 324.9
	["SJ38J", {x: 2*500*1000 + 3*100*1000 + 3*10000 + 2000, y: 1*500*1000 + 3*100*1000 + 8*10000 + 8000 , precision: 2000}],
	["SJ3288", {x: 2*500*1000 + 3*100*1000 + 3*10000 + 2000, y: 1*500*1000 + 3*100*1000 + 8*10000 + 8000 , precision: 1000}],
	["VV00A", {x: 0, y: 0, precision: 2000}],
	["VV00Z", {x: 2000*4, y: 2000*4, precision: 2000}],
	["VV11I", {x: 10000 + 2000*1, y: 10000 + 2000*3, precision: 2000}],
	["GH12G", {x: 1*500*1000 + 2*100*1000 + 1*10000 + 2000, y: 3*500*1000 + 3*100*1000 + 2*10000 + 2000, precision: 2000}],
	["VV00O", /invalid grid reference letter 'O'/],
	["AA1234A", /malformed grid reference contains tetrad suffix with wrong numeric precision \(4/],
   ]
});

// FIXME "invalid grid reference letter" might be inappropriate in the case of tetrads

testCases({
    title: "xyToDinty",
    function: dinty.xyToDinty,
    cases: [
	[[0,0], "A"],
	[[1,1], "A"],
	[[0,9], "E"],
	[[9,0], "V"],
	[[9,9], "Z"],
	[[3,6], "I"],
	[["0","0"], "A"],
	[[" 0","9 "], "E"],
	[["9.0","0.0"], "V"],
	[["9e0","+9"], "Z"],
	[["3 "," 0006.00000 "], "I"],
	[[10,6], /coordinates must be positive but not exceed 9/],
	[[6,10], /coordinates must be positive but not exceed 9/],
	[[-1,1], /coordinates must be positive but not exceed 9/],
	[[1,-1], /coordinates must be positive but not exceed 9/],
	[["3 3",1], /coordinates must be positive but not exceed 9/],
	[["3 3"," 5^5"], /coordinates must be positive but not exceed 9/],
    ],    
});

testCases({
    title: "xyToFghjk",
    function: dinty.xyToFghjk,
    cases: [
	[[0,0], "V"],
	[[1,1], "V"],
	[[0,9], "A"],
	[[9,0], "Z"],
	[[9,9], "E"],
	[[3,6], "G"],
	[["0","0"], "V"],
	[[" 0","9 "], "A"],
	[["9.0","0.0"], "Z"],
	[["9e0","+9"], "E"],
	[["3 "," 0006.00000 "], "G"],
	[[10,6], /coordinates must be positive but not exceed 9/],
	[[6,10], /coordinates must be positive but not exceed 9/],
	[[-1,1], /coordinates must be positive but not exceed 9/],
	[[1,-1], /coordinates must be positive but not exceed 9/],
	[["3 3",1], /coordinates must be positive but not exceed 9/],
	[["3 3"," 5^5"], /coordinates must be positive but not exceed 9/],
    ],    
});

testCases({
    title: "gridrefToTetrad",
    function: dinty.gridrefToTetrad,
    cases: [
	["SJ3828", "SJ32Z"],
	["SJ3829", "SJ32Z"],
	["SJ3928", "SJ32Z"],
	["SJ3929", "SJ32Z"],
	["SJ391299", "SJ32Z"],
	["SJ39232987", "SJ32Z"],
	["SJ3945629765", "SJ32Z"],
        ["VV0000", "VV00A"],
        ["VV0909", "VV00Z"],
	["SJ32Z", "SJ32Z"],
	["SJ32O", /invalid grid ref, tetrads cannot have an 'O' suffix:/],
        ["VV", /grid ref is too coarse to be a tetrad:/],
        ["VV0", /grid ref is too coarse to be a tetrad:/],
        ["VV00", /grid ref is too coarse to be a tetrad:/],
        ["VV000", /invalid grid ref, unbalanced digits:/],
        ["VVV00", /invalid grid ref:/],
        ["VV000O", /invalid grid ref, tetrads can only have 2 digits:/],
        ["V0000", /invalid grid ref:/],
    ],    
});

