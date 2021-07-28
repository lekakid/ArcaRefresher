import React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

export default function ConfigGroup(props) {
  const { name, children } = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>{name}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
