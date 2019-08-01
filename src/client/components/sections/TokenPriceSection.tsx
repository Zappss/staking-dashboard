/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as React from 'react';
import { Typography } from '../base/Typography';
import { Section } from './Section';

export interface IProps {
  className?: string;
}

export const TokenPriceSection: React.FunctionComponent<IProps> = ({ className }) => {
  return (
    <Section title='Token Price' className={className} noBottomBorder={true}>
      <Typography variant='huge'>$0.0242</Typography>
    </Section>
  );
};
