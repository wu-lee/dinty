<a name="module_dinty"></a>

## dinty
<p>Dinty module</p>
<p>Javascript utilities for converting Ordnance Survey grid references
into cartesian coordinates, with support for DINTY labelled tetrad
references.</p>

**Copyright**: Nick Stokoe 2016  

* [dinty](#module_dinty)
    * [.dintyToXY(alpha)](#module_dinty+dintyToXY) ⇒ <code>Object</code>
    * [.fghjkToXY(alpha)](#module_dinty+fghjkToXY) ⇒ <code>Object</code>
    * [.osAlphaToFalseOriginCoord(grid500km, grid100km)](#module_dinty+osAlphaToFalseOriginCoord) ⇒ <code>Object</code>
    * [.tetradToFalseOriginCoord(alpha)](#module_dinty+tetradToFalseOriginCoord) ⇒ <code>Object</code>
    * [.gridrefToFalseOriginCoord(gridref)](#module_dinty+gridrefToFalseOriginCoord) ⇒ <code>Object</code>
    * [.gridrefToRelativeCoord(gridref, origin)](#module_dinty+gridrefToRelativeCoord) ⇒ <code>Object</code>

<a name="module_dinty+dintyToXY"></a>

### dinty.dintyToXY(alpha) ⇒ <code>Object</code>
<p>Convert a DINTY coordinate letter to an XY index pair.</p>
<pre class="prettyprint source"><code>EJPUZ
DINTY
CHMSX
BGLRW
AFKQV</code></pre><p>In the returned coordinates, (0,0) indicates the south-western
square, (4,4) the north-eastern, (4,0) the south-eastern and (0,4)
the north-western.</p>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (west to
east) and <code>y</code> (south to north).</p>  
**Throws**:

- <p>an Error if either parameter is not an upper case
DINTY-scheme letter.</p>


| Param | Type | Description |
| --- | --- | --- |
| alpha | <code>String</code> | <p>An upper case character A-Z (but not O).</p> |

<a name="module_dinty+fghjkToXY"></a>

### dinty.fghjkToXY(alpha) ⇒ <code>Object</code>
<p>Convert a FGHJK coordinate letter to an XY index pair.</p>
<pre class="prettyprint source"><code>ABCDE
FGHJK
LMNOP
QRSTU
VWXYZ</code></pre><p>In the returned coordinates, (0,0) indicates the south-western
square, (4,4) the north-eastern, (4,0) the south-eastern and (0,4)
the north-western.</p>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (west to
east) and <code>y</code> (south to north).</p>  
**Throws**:

- <p>an Error if either parameter is not an upper case
FGHJK-scheme letter.</p>


| Param | Type | Description |
| --- | --- | --- |
| alpha | <code>String</code> | <p>An upper case character A-Z (but not I).</p> |

<a name="module_dinty+osAlphaToFalseOriginCoord"></a>

### dinty.osAlphaToFalseOriginCoord(grid500km, grid100km) ⇒ <code>Object</code>
<p>Converts a top-level 2-letter Ordnance Survey grid ref into the
coordinate of the square's south-western corner in meters relative
to the false origin.</p>
<p>In the returned coordinates, (0,0) indicates the south-western
square, (0,240000) the north-eastern, (240000,0) the south-eastern
and (0,240000) the north-western.</p>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (west to
east) and <code>y</code> (south to north), possible values ranging from 0 to
240000 in steps of 100000.</p>  
**Throws**:

- <p>an Error if either parameter is not an upper case
FGHJK-scheme letter. However, trailing characters are ignored.</p>


| Param | Type | Description |
| --- | --- | --- |
| grid500km | <code>String</code> | <p>A FGHJK-scheme letter indicating the 500km square.</p> |
| grid100km | <code>String</code> | <p>A FGHJK-scheme letter indicating the 100km square</p> |

<a name="module_dinty+tetradToFalseOriginCoord"></a>

### dinty.tetradToFalseOriginCoord(alpha) ⇒ <code>Object</code>
<p>Converts a DINTY tetrad label into the coordinate of the square's
south-western corner in meters relative to the hectad's
south-western corner.</p>
<p>Tetrads have a fixed scale of 2km square.  In the returned
coordinates, (0,0) indicates the south-western square, (0,8000)
the north-eastern, (8000,0) the south-eastern and (0,8000) the
north-western.</p>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (west to
east) and <code>y</code> (south to north), possible values from 0 to 8000 in
steps of 2000.</p>  
**Throws**:

- <p>an Error if the parameter is not an upper case
DINTY-scheme letter. However, trailing characters are ignored.</p>


| Param | Type | Description |
| --- | --- | --- |
| alpha | <code>String</code> | <p>A DINTY-scheme letter indicating the tetrad.</p> |

<a name="module_dinty+gridrefToFalseOriginCoord"></a>

### dinty.gridrefToFalseOriginCoord(gridref) ⇒ <code>Object</code>
<p>Convert an arbitrary grid reference string into the coordinate of
the square's south-western corner relative to the false origin, and
a size, in meters.</p>
<p>The grid reference can be of the form:</p>
<ul>
<li><code>ABxy</code> - where<ul>
<li><code>A</code> and <code>B</code> are 500 and 100km FGHJK grid labels, and</li>
<li><code>x</code> and <code>y</code> are zero or more digit eastward/northward offsets respectively.</li>
</ul>
</li>
<li><code>ABnmT</code> - where<ul>
<li><code>A</code> and <code>B</code> are 500 and 100km FGHJK grid labels, and</li>
<li><code>n</code> and <code>m</code> are single digit eastward/northward offsets, respectively, and</li>
<li><code>T</code> is a DINTY tetrad label.</li>
</ul>
</li>
</ul>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (distance
east of the false origin) and <code>y</code> (distance north of it), possible
values from 0 to 250000, and an attribute <code>precision</code> indicating
the size of the square, all in meters.</p>  
**Throws**:

- <p>an Error if <code>A</code> or <code>B</code> are not an upper case FGHJK-scheme
letters, or if <code>T</code> is not an upper case DINTY-scheme letter, or if
<code>n</code> or <code>m</code> are not single digits. However, <code>x</code> and <code>y</code> may be any
length so long as they are all digits.</p>


| Param | Type | Description |
| --- | --- | --- |
| gridref | <code>String</code> | <p>A grid reference string.</p> |

<a name="module_dinty+gridrefToRelativeCoord"></a>

### dinty.gridrefToRelativeCoord(gridref, origin) ⇒ <code>Object</code>
<p>Convert an arbitrary grid reference string into the coordinate of
the square's south-western corner relative to the given origin.</p>
<p>The grid reference can as defined in [gridrefToFalseOriginCoord](gridrefToFalseOriginCoord).</p>

**Kind**: instance method of <code>[dinty](#module_dinty)</code>  
**Returns**: <code>Object</code> - <p>An object with integer attributes <code>x</code> (distance
east of <code>origin</code>) and <code>y</code> (distance north of it), and an attribute
<code>precision</code> indicating the size of the square, all in meters.</p>  
**Throws**:

- <p>an Error if <code>A</code> or <code>B</code> are not an upper case FGHJK-scheme
letters, or if <code>T</code> is not an upper case DINTY-scheme letter, or if
<code>n</code> or <code>m</code> are not single digits. However, <code>x</code> and <code>y</code> may be any
length so long as they are all digits.</p>


| Param | Type | Description |
| --- | --- | --- |
| gridref | <code>String</code> | <p>A grid reference string.</p> |
| origin | <code>Object</code> | <p>A coordinate relative to the false origin, in meters, expressed as an object with numeric <code>x</code> and <code>y</code> attributes.</p> |

