## Forked to Support Brave in the force directed graph

Dependency of react-force-graph-2d

We could have this installed from exrhizo's repo every time, but this is a very
simple lib, so just including it here to keep it in one place.

e.g. [How to use an npm node module that has been forked](https://blaipratdesaba.com/how-to-use-an-npm-node-module-that-has-been-forked-b7dd522fdd08)

https://github.com/exrhizo/canvas-color-tracker

# canvas-color-tracker

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

A utility to track objects on a canvas by unique px color.

When using HTML5 canvas to render elements, we don't have the convenience of readily available _mouseover_ events per object, which makes interaction difficult.
`canvas-color-tracker` provides a system for keeping track of objects in your canvas by indexing them by a unique color, which can be retrieved by determining the _1px_ color that is directly under the mouse pointer.

This is generally done using a spare/shadow canvas which is not attached to the DOM, but is synchronyzed in terms of object positions with the main canvas. On this shadow canvas we render the objects filled with artificial unique colors that are keys to the object's data, so that by attaching _mousemove_ events to the whole canvas we can determine which objects are being hovered on.

`canvas-color-tracker` is just the registry part of this process, which generates unique color keys per object and supports addition and retrieval of objects. It also includes a mechanism for validating the color keys using checksum encoding. This is necessary because of pixel antialiasing/smoothing on the boundary of canvas objects, leading into new color mutations which invalidate the object color key lookup.

Check out the canvas examples:

- [100 objects](https://vasturiano.github.io/canvas-color-tracker/example/canvas-small.html) [[source](https://github.com/vasturiano/canvas-color-tracker/blob/master/example/canvas-small.html)]
- [10k objects](https://vasturiano.github.io/canvas-color-tracker/example/canvas-medium.html) [[source](https://github.com/vasturiano/canvas-color-tracker/blob/master/example/canvas-medium.html)]
- [1M objects](https://vasturiano.github.io/canvas-color-tracker/example/canvas-huge-1M.html)!! [[source](https://github.com/vasturiano/canvas-color-tracker/blob/master/example/canvas-huge-1M.html)] (please wait until render finishes)

## Quick start

```
import ColorTracker from 'canvas-color-tracker';
```

or

```
const ColorTracker = require('canvas-color-tracker');
```

or even

```
<script src="//unpkg.com/canvas-color-tracker"></script>
```

then

```
const myTracker = new ColorTracker();

const myObject = { ... };
const myObjectColor = myTracker.register(myObject);

(...)

const hoverColor = context.getImageData(x, y, 1, 1).data;
const hoverObject = myTracker.lookup(hoverColor);
```

## API reference

### Instantiation

new <b>ColorTracker</b>()

Creates a new object registry with a capacity of 2^24 objects.

Probability of collisions at canvas drawn edges increases to certainty when the registry reaches capacity. This is due to browser anti-aliasing blending colors. The probability
is something like N / 2^24 of an edge pixel colliding, where N is the size of the registry.

### Methods

<b>register</b>(<i>object</i>)

Adds an object to the registry, and returns a unique color (hex string) that can be used to retrieve the object in the future. Object can be of any type, even primitive values. The color returned encodes the checksum, and will be checked for validity at retrieval time. In case the registry is full and has reached its limit of objects, a value of `null` is returned, indicating that the object was not stored.

<b>lookup</b>(<i>string</i> or <i>[r, g, b]</i>)

Retrieve an object from the registry by its unique color key. The color should be passed either as a plain string such as `#23a69c`, or an array of 3 octet numbers indicating the color's _r_, _g_, _b_ encoding. This array is the same format as returned by the canvas context `getImageData` method. If the color passes the checksum verification and has a registered object in the registry, it is returned. Otherwise the method returns `null`.

## Giving Back

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url) If this project has helped you and you'd like to contribute back, you can always [buy me a ☕](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)!

[npm-img]: https://img.shields.io/npm/v/canvas-color-tracker.svg
[npm-url]: https://npmjs.org/package/canvas-color-tracker
[build-size-img]: https://img.shields.io/bundlephobia/minzip/canvas-color-tracker.svg
[build-size-url]: https://bundlephobia.com/result?p=canvas-color-tracker
[dependencies-img]: https://img.shields.io/david/vasturiano/canvas-color-tracker.svg
[dependencies-url]: https://david-dm.org/vasturiano/canvas-color-tracker
