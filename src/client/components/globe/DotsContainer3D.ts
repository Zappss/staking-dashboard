/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Object3D } from 'three';
import { Dot3D } from './Dot3D';

const staticDots = [
  {
    // Israel
    name: 'Israel',
    xRotation: 5.68,
    yRotation: 1.75,
  },
  {
    // Japan
    name: 'JP',
    xRotation: 5.59,
    yRotation: 3.58,
  },
  {
    // Bulgaria
    name: 'BG',
    xRotation: 5.47,
    yRotation: 1.57,
  },
  {
    // Canada
    name: 'CA',
    xRotation: 5.35,
    yRotation: 5.84,
  },
  {
    // Hoing Kong
    name: 'HK',
    xRotation: 5.86,
    yRotation: 3.26,
  },
  {
    // Thailand
    name: 'Th',
    xRotation: 6.05,
    yRotation: 3,
  },
  {
    // USA (CA)
    name: 'US-CA',
    xRotation: 5.64,
    yRotation: 5.39,
  },
  {
    // Cayman Islands
    name: 'Cayman Islands',
    xRotation: 5.93,
    yRotation: 5.99,
  },
  {
    // Korea
    name: 'Korea',
    xRotation: 5.6,
    yRotation: 3.38,
  },
  {
    // Macau
    name: 'Macau',
    xRotation: 5.88,
    yRotation: 3.2,
  },
  {
    // UK
    name: 'UK',
    xRotation: 5.3,
    yRotation: 1.12,
  },
  {
    // Cyprus
    name: 'CYP',
    xRotation: 5.65,
    yRotation: 1.71,
  },
  {
    // Singapore
    name: 'SG',
    xRotation: 6.27,
    yRotation: 3.06,
  },
  {
    // Russia
    name: 'RUS',
    xRotation: 5.17,
    yRotation: 2.67,
  },
  {
    // USA (NY)
    name: 'NY',
    xRotation: 5.55,
    yRotation: 6.24,
  },
  {
    // Slovak Republic
    name: 'SlV',
    xRotation: 5.39,
    yRotation: 1.46,
  },
  {
    // New Zealand
    name: 'NZ',
    xRotation: 0.86,
    yRotation: 4.05,
  },
  {
    // Scotland
    name: 'Scotland',
    xRotation: 5.22,
    yRotation: 1.09,
  },
];
export class DotsContainer3D extends Object3D {
  private activeDotIdx: number = 0;
  private dotsList: Dot3D[] = [];

  constructor(globeRadius: number) {
    super();
    staticDots.forEach(dot => this.addDot(globeRadius, dot.xRotation, dot.yRotation, dot.name));
  }

  public get activeDot(): Dot3D {
    return this.dotsList[this.activeDotIdx];
  }

  public nextActiveDot(): void {
    this.activeDotIdx = (this.activeDotIdx + 1) % this.dotsList.length;
  }

  private addDot(globeRadius: number, xRotation: number, yRotation: number, name: string): void {
    const dot = new Dot3D(globeRadius, 0.15, xRotation, yRotation, name);
    this.add(dot);
    this.dotsList.push(dot);
  }
}
