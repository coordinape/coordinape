`/icons/brands|custom|feather/` include raw svgs that are converted to components by running `yarn update-icons`

Those components are then placed in `/icons/__generated`

Icons should be referenced in Figma Design Library, and utility icons can be added from Feather: https://feathericons.com/

Simply add the new needed Feather svg to the `feather/` and run `yarn update-icons`

Custom icons from our Figma can be added to `brands/` or `custom/`