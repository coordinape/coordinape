import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import { styled } from '../../stitches.config';

const StyledCollapsible = styled(CollapsiblePrimitive.Root, {});
const StyledTrigger = styled(CollapsiblePrimitive.Trigger, {});

export const Collapsible = StyledCollapsible;
export const CollapsibleTrigger = StyledTrigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
