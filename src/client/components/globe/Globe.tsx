/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import * as React from 'react';
import { AmbientLight, Clock, DirectionalLight, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { Globe3D } from './Globe3D';
import { Power2, TweenMax } from 'gsap';
import { generateStarField } from './StarField';

const raycaster = new Raycaster();

export class Globe extends React.Component {
  private clock: Clock = new Clock();
  private globe3D: Globe3D;
  private starField: Object3D;
  private scene: Scene;
  private mount: HTMLDivElement;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private composer: EffectComposer;
  private frameId: number;
  private mouse: Vector2 = new Vector2();
  private hoverdObject: Object3D;

  public componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    // ADD SCENE
    this.scene = new Scene();

    // Add light
    const light = new AmbientLight(0xffffff, 0.5);
    this.scene.add(light);

    // another light
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    this.scene.add(directionalLight);

    // ADD CAMERA
    this.camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.z = 40;

    // ADD RENDERER
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add effects
    this.composer = new EffectComposer(this.renderer);
    const effectPass = new EffectPass(this.camera, new BloomEffect(6.0));
    effectPass.renderToScreen = true;

    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(effectPass);

    this.mount.appendChild(this.renderer.domElement);

    // Add the globe
    this.globe3D = new Globe3D();
    this.scene.add(this.globe3D.build());

    // Add the starfield
    this.starField = generateStarField(80, 70);
    this.scene.add(this.starField);

    this.resizeRendererToDisplaySize(true);
    this.startAnimation();
  }

  public componentWillUnmount() {
    this.stopAnimation();
    this.mount.removeChild(this.renderer.domElement);
  }

  public render() {
    return (
      <div
        id='mount'
        style={{ width: '100%', height: '200px' }}
        onMouseMove={e => this.onDocumentMouseMove(e)}
        onClick={e => this.onClick()}
        ref={mount => (this.mount = mount)}
      />
    );
  }

  private onClick(): void {
    const y = Math.random() * Math.PI * 2;
    const x = Math.random() * 0.2 * Math.PI * 2;
    TweenMax.to(this.globe3D.globe.rotation, 0.75, { x, y, ease: Power2.easeInOut });
    TweenMax.to(this.starField.rotation, 0.75, { x, y, ease: Power2.easeInOut });
  }

  private onDocumentMouseMove(e: React.MouseEvent): void {
    this.mouse.x = (e.nativeEvent.offsetX / this.mount.clientWidth) * 2 - 1;
    this.mouse.y = -(e.nativeEvent.offsetY / this.mount.clientHeight) * 2 + 1;
  }

  private startAnimation() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => this.animate());
    }
  }

  private stopAnimation() {
    cancelAnimationFrame(this.frameId);
  }

  private handleHover(): void {
    raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      const newIntersectedObject = intersects[0].object;
      if (this.hoverdObject !== newIntersectedObject) {
        this.globe3D.handleHoverOut(this.hoverdObject);
      }
      this.hoverdObject = intersects[0].object;
      this.globe3D.handleHover(this.hoverdObject);
    } else {
      if (this.hoverdObject) {
        this.globe3D.handleHoverOut(this.hoverdObject);
      }
    }
  }

  private resizeRendererToDisplaySize(forceResize: boolean = false) {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    if (canvas.width !== width || forceResize) {
      this.renderer.setSize(width, width, false);
      this.composer.setSize();
      canvas.removeAttribute('style');
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
    }
  }

  private animate() {
    // this.globe3D.animate();
    this.handleHover();
    this.resizeRendererToDisplaySize();

    this.composer.render(this.clock.getDelta());
    // this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(() => this.animate());
  }
}
