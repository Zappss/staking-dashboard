/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Power2, TweenMax } from 'gsap';
import { BackSide, FrontSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, SphereGeometry, TextureLoader } from 'three';

export class Globe3D {
  private globe: Object3D;
  private sphereGeometry: SphereGeometry;
  private sphereMaterial: any;
  private sphereMaterialBack: any;
  private bigSphereMaterial: any;

  constructor() {
    const textureLoader = new TextureLoader();
    const sphereTexture = textureLoader.load('/assets/map4-01.png');
    this.sphereGeometry = new SphereGeometry(2, 32, 32);
    this.sphereMaterial = new MeshLambertMaterial({
      color: 0xffffff,
      map: sphereTexture,
      transparent: true,
      side: FrontSide,
    });
    this.sphereMaterialBack = new MeshLambertMaterial({
      color: 0xffffff,
      map: sphereTexture,
      transparent: true,
      opacity: 0.4,
      side: BackSide,
    });
    this.bigSphereMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.04,
      transparent: true,
      side: FrontSide,
    });
    // this.sphereMaterial = createFresnelShaderMaterial();
    // this.sphereMaterialBack = createFresnelShaderMaterial();
  }

  public build(): Object3D {
    this.globe = this.createGlobe();
    return this.globe;
  }

  public handleHover(object: Object3D): void {}

  public handleHoverOut(object: Object3D): void {}

  public animate(): any {
    this.globe.rotation.y += 0.003;
  }

  public moveToNextPoint(): void {
    TweenMax.to(this.globe.rotation, 0.75, { y: Math.random() * Math.PI * 2, x: Math.random() * 0.2 * Math.PI * 2, ease: Power2.easeInOut });
  }

  private createGlobe(): Object3D {
    const sphereMesh = new Mesh(this.sphereGeometry, this.sphereMaterial);
    const sphereMeshBack = new Mesh(this.sphereGeometry, this.sphereMaterialBack);
    // const bigSphereMesh = new Mesh(this.sphereGeometry, this.bigSphereMaterial);

    sphereMesh.renderOrder = 2;
    // bigSphereMesh.scale.set(1.3, 1.3, 1.3);

    const globe = new Object3D();
    globe.add(sphereMeshBack);
    globe.add(sphereMesh);
    // globe.add(bigSphereMesh);
    return globe;
  }
}
