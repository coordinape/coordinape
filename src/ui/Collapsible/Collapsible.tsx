import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import { styled } from '../../stitches.config';

const StyledCollapsible = styled(CollapsiblePrimitive.Root, {});

export const Collapsible = StyledCollapsible;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
