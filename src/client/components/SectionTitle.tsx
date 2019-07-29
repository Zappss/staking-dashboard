/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as React from 'react';
import { HelpIcon } from './HelpIcon';
import { Typography } from './Typography';
import styled from 'styled-components';

const Root = styled.div`
  text-transform: uppercase;
  color: #ededed;
  height: 20px;
  padding-left: 2px;
  padding-right: 2px;
  display: flex;
`;

const Title = styled(Typography)`
  padding-right: 4px;
  align-self: flex-end;
`;

export interface IProps {
  title: string;
  helpText?: string;
}

export const SectionTitle: React.FunctionComponent<IProps> = ({ title, helpText }) => {
  return (
    <Root>
      <Title variant='small'>{title}</Title>
      {helpText && <HelpIcon helpText={helpText} />}
    </Root>
  );
};