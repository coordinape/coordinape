import { styled } from '../../stitches.config';

export const Divider = styled('hr', {
  // Reset
  boxSizing: 'border-box',

  border: 'none',
  height: 1,
  my: '$xs',
  mx: 0,
  alignSelf: 'stretch',
  flexShrink: 0,
  backgroundColor: '$lightBorder',
  //   height: "px",
  //   margin: "3px 0",
  //   align-self: "stretch",
  //   flex-shrink: 0,
  //   backgroundColor: "",
});

export default Divider;
