// SvgIcon makes svg paths compatible with MaterialUi
// https://material-ui.com/api/svg-icon/
//
// SvgIcon expects the view window to be 24x24 or set viewBox="0 0 W H"
//
// In Figma,
// Select the item > Auto layout > Change padding so frame group is square
// then copy as svg and remove fill
//
// Using the following isn't compatible with MaterialUi's colors:
// import { ReactComponent as MediumSVG } from 'assets/svgs/social/medium.svg';

export * from './DocsIcon';
export * from './TwitterIcon';
export * from './MediumIcon';
