/**
 * Copyright 2019 the staking-dashboard authors
 * This file is part of the staking-dashboard library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Power2, TimelineLite, TweenMax } from 'gsap';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import React from 'react';
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { DotsContainer3D } from './DotsContainer3D';
import { Globe3D } from './Globe3D';
import { generateStarField } from './StarField';
import { PoiPopup } from './poiCard/PoiPopup';

const raycaster = new Raycaster();
const CAMERA_POS = 35;
const ANIMATION_SPEED = 0.8;

const boxSizeForDev = {
  height: 100,
  width: 200,
};

interface IState {
  rotationX: number;
  rotationY: number;

  width: number;
  height: number;
}

export class Globe extends React.Component<{}, IState> {
  private clock: Clock = new Clock();
  private globe3D: Globe3D;
  private starField: Object3D;
  private dotsContainer: DotsContainer3D;
  private scene: Scene;
  private mount: HTMLDivElement;
  private popUpDivRef = React.createRef<HTMLDivElement>();
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private composer: EffectComposer;
  private frameId: number;
  private mouse: Vector2 = new Vector2();
  private hoverdObject: Object3D;

  constructor(props) {
    super(props);
    this.state = { rotationX: 0, rotationY: 0, width: 0, height: 0 };
  }

  public componentWillMount() {
    // Create new Scene object
    this.scene = new Scene();

    // Add main light
    const light = new AmbientLight(0xffffff, 0.7);
    this.scene.add(light);

    // Add secondary lights
    const leftLight = new DirectionalLight(0xffffff, 0.8);
    leftLight.position.set(-1, 0, 0);
    this.scene.add(leftLight);

    const rightLight = new DirectionalLight(0xffffff, 0.8);
    rightLight.position.set(1, 0, 0);
    this.scene.add(rightLight);

    const topLight = new DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 1, 0);
    this.scene.add(topLight);

    const bottomLight = new DirectionalLight(0xffffff, 0.8);
    bottomLight.position.set(0, -1, 0);
    this.scene.add(bottomLight);

    // ADD CAMERA
    this.camera = new PerspectiveCamera(50, 0.5, 0.1, 1000);
    this.camera.position.z = CAMERA_POS;

    // ADD RENDERER
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add effects
    this.composer = new EffectComposer(this.renderer);
    const effectPass = new EffectPass(this.camera, new BloomEffect(6));
    effectPass.renderToScreen = true;

    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(effectPass);

    // Add the globe
    this.globe3D = new Globe3D(10);
    this.scene.add(this.globe3D.build());

    // Add the dots
    this.dotsContainer = new DotsContainer3D(10);
    this.scene.add(this.dotsContainer);

    // Add the starfield
    this.starField = generateStarField(130, 200);
    this.scene.add(this.starField);
  }

  public componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    console.log(`Width: ${width} X Height: ${height}`);

    this.camera.aspect = width / height;
    this.renderer.setSize(width, height, false);

    this.mount.appendChild(this.renderer.domElement);

    this.resizeRendererToDisplaySize(true);
    this.startAnimation();

    const canvasHalfWidth = this.renderer.domElement.offsetWidth / 2;
    const canvasHalfHeight = this.renderer.domElement.offsetHeight / 2;

    // TODO : ORL : Move this to a function and apply it on resize as well.
    this.setState({
      width: canvasHalfWidth + this.renderer.domElement.offsetLeft,
      height: canvasHalfHeight + this.renderer.domElement.offsetTop,
    });
  }

  public componentWillUnmount() {
    this.stopAnimation();
    this.mount.removeChild(this.renderer.domElement);
  }

  public render() {
    // this.dotsContainer.activeDot.rotation.set(this.state.rotationX, this.state.rotationY, 0, 'YXZ');
    // this.scene.rotation.set(-this.state.rotationX, -this.state.rotationY, 0);
    return (
      <>
        <div
          id='mount'
          style={{ width: '100%', height: '200px' }}
          onMouseMove={e => this.onDocumentMouseMove(e)}
          onClick={e => this.onClick()}
          ref={mount => (this.mount = mount)}
        />
        <div
          style={{
            position: 'absolute',
            left: this.state.width,
            top: this.state.height,
            zIndex: 1,
            borderStyle: 'solid',
            borderColor: 'pink',
            borderWidth: 1,
          }}
        />

        <div style={{ position: 'absolute', left: 200, top: 900 }}>
          <label style={{ color: 'white', display: 'block' }}>X: {this.state.rotationX}</label>
          <input
            type='range'
            id='rotationX'
            value={this.state.rotationX * 100}
            min={0}
            max={Math.PI * 2 * 100}
            onChange={e => this.setState({ rotationX: parseInt(e.currentTarget.value, 10) / 100 })}
          />
          <label style={{ color: 'white', display: 'block' }}>Y: {this.state.rotationY}</label>
          <input
            type='range'
            id='rotationY'
            value={this.state.rotationY * 100}
            min={0}
            max={Math.PI * 2 * 100}
            onChange={e => this.setState({ rotationY: parseInt(e.currentTarget.value, 10) / 100 })}
          />
        </div>

        <PoiPopup
          ref={this.popUpDivRef}
          top={this.state.height}
          left={this.state.width}
          name={this.dotsContainer.activeDot.name}
        />
      </>
    );
  }

  private onClick(): void {
    // TODO : ORL :  Move this to an an outer 'current poi' store/state
    this.dotsContainer.activeDot.unblink();
    this.dotsContainer.nextActiveDot();
    this.dotsContainer.activeDot.blink();

    const timeLine = new TimelineLite();
    timeLine.timeScale(ANIMATION_SPEED);

    const singleAnimationDuration = 1;

    timeLine.add(
      TweenMax.to(this.popUpDivRef.current, singleAnimationDuration / 4, {
        scale: 0.2,
        autoAlpha: 0,
        transformOrigin: 'top left',
      }),
      0,
    );

    // Creates the zoom out - zoom in when transitioning between dots.
    timeLine.add(
      TweenMax.to(this.camera.position, singleAnimationDuration / 2, {
        z: CAMERA_POS * 1.25,
        ease: Power2.easeInOut,
        repeat: 1,
        yoyo: true,
      }),
      0,
    );

    // This tween is responsible for rotating the scene to the appropriate active dot.
    timeLine.add(
      TweenMax.to(this.scene.rotation, singleAnimationDuration, {
        x: -this.dotsContainer.activeDot.rotation.x,
        y: -this.dotsContainer.activeDot.rotation.y,
        z: 0,
        ease: Power2.easeInOut,
      }),
      0,
    );

    // Display the node data "pop up"
    timeLine.add(
      TweenMax.to(this.popUpDivRef.current, singleAnimationDuration / 4, {
        scale: 1,
        autoAlpha: 1,
      }),
    );

    // TODO : ORL : Ensure re-rendering with a better method.
    this.forceUpdate();
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
    // TODO : ORL : This does not seem to do anything, ask about it.
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
