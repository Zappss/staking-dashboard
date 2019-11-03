/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Object3D } from 'three';
import { Dot3D } from './Dot3D';
import { IPoi } from '../../../shared/IPoi';

export class DotsContainer3D extends Object3D {
  private activeDotIdx: number = 0;
  private dotsList: Dot3D[] = [];
  private dotsMap: Map<string, Dot3D> = new Map<string, Dot3D>();
  private activeDotId: string = null;

  constructor(pois: IPoi[], globeRadius: number) {
    super();
    pois.forEach(dot => this.addDot(globeRadius, dot.xRotation, dot.yRotation, dot.name, dot.id));
  }

  // TODO : O.L : FUTURE : Remove this when moving to mobx based flow
  public nextActiveDot(): void {
    this.activeDotIdx = (this.activeDotIdx + 1) % this.dotsList.length;
  }

  public setActiveDotById(poiId: string) {
    // Ensure dot with given id exists
    if (this.dotsMap.has(poiId)) {
      // Deactivates current dot
      if (this.activeDotId) {
        this.dotsMap.get(this.activeDotId).unblink();
      }

      // Activate the requested dot
      this.dotsMap.get(poiId).blink();

      // Sets the current active dot id
      this.activeDotId = poiId;
    }
  }

  private addDot(globeRadius: number, xRotation: number, yRotation: number, name: string, id: string): void {
    const dot = new Dot3D(globeRadius, 0.15, xRotation, yRotation, name);
    this.add(dot);
    this.dotsList.push(dot);

    this.dotsMap.set(id, dot);
  }
}
