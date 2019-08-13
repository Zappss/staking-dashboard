/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as React from 'react';
import styled from 'styled-components';
import { theme } from '../base/Theme';
import { Typography } from '../base/Typography';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DigitBox = styled.span`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  align-items: center;
`;

const SeperatorBox = styled(DigitBox)`
  padding-left: ${theme.sizes.SIZE_SMALL_5};
  padding-right: ${theme.sizes.SIZE_SMALL_5};
`;

interface IProps {
  hours: number;
  minutes: number;
  seconds: number;
}

const toTwoDigits = (num: number): string => num > 10 ? num.toString() : '0' + num.toString();

export const DigitalClock: React.FunctionComponent<IProps> = ({ hours, minutes, seconds }) => {
  return (
    <Root>
      <DigitBox>
        <Typography variant='x-large'>{toTwoDigits(hours)}</Typography>
        <Typography variant='xxx-small' dark>
          Hours
        </Typography>
      </DigitBox>
      <SeperatorBox>
        <Typography variant='x-large'>:</Typography>
        <Typography variant='xxx-small' dark>
          &nbsp;
        </Typography>
      </SeperatorBox>
      <DigitBox>
        <Typography variant='x-large'>{toTwoDigits(minutes)}</Typography>
        <Typography variant='xxx-small' dark>
          Minutes
        </Typography>
      </DigitBox>
      <SeperatorBox>
        <Typography variant='x-large'>:</Typography>
        <Typography variant='xxx-small' dark>
          &nbsp;
        </Typography>
      </SeperatorBox>
      <DigitBox>
        <Typography variant='x-large'>{toTwoDigits(seconds)}</Typography>
        <Typography variant='xxx-small' dark>
          Seconds
        </Typography>
      </DigitBox>
    </Root>
  );
};
