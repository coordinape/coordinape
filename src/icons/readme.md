`/icons/brands|custom|feather/` include raw svgs that are converted to components by running `yarn update-icons`

Those components are then placed in `/icons/__generated`

All icons should be referenced in Figma Design Library, and utility icons can be added from Feather: https://feathericons.com/ 

Feather icon export settings:

* Size: 24px
* Stroke: 2px
* Color: currentColor

NOTE: Some icons, especially multi-color icons, will benefit from the prop: `nostroke`.  In an ideal world, all of our icons would use either fill OR stroke, but we're not there yet.  