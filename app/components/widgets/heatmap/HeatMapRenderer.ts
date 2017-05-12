
import {
    Clock, Scene, PerspectiveCamera, OrthographicCamera,
    WebGLRenderer, WebGLRenderTarget, Mesh, MeshBasicMaterial,
    TextureLoader, PlaneBufferGeometry,
    LinearFilter
} from 'three';

import { HeatMapBufferGeometry } from './HeatMapGeometry';
import { HeatIntensityMaterial } from './HeatIntensityMaterial';
import { HeatColorMaterial } from './HeatColorMaterial';

export class HeatMapRenderer {

    private container: any;
    private params: any;
    private width: number;
    private height: number;
    
    private clock: Clock;

    private fbCamera: PerspectiveCamera;
    private fbScene: Scene;
    private fbRenderer: WebGLRenderTarget;

    private camera: OrthographicCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;

    constructor(container: any, params: any) {

        this.container = container;
        this.params = params;
        this.params.fov = 70;
        this.width = this.height = 1;
        
        this.commonInit();
    }

    private commonInit(): void {

        this.clock = new Clock();

        this.fbCamera = new PerspectiveCamera(this.params.fov, this.getWidth() / this.getHeight(), 0.1, 2000);
        this.fbScene = new Scene();
        this.fbRenderer = new WebGLRenderTarget(0, 0, {
            minFilter: LinearFilter,
            stencilBuffer: false,
            depthBuffer: false
        });
        this.fbCamera.position.set(0, 0, 100);

        let data = [];

        for (var i = 0; i < 500; ++i) {
            data.push([1000 * Math.random() - 500,
            200 * Math.random() - 100,
            100 * Math.random(),
            Math.random()]);
        }

        let intensityMaterial = new HeatIntensityMaterial();

        let colorMaterial = new HeatColorMaterial(this.fbRenderer.texture);

        //var defaultMaterial = new MeshBasicMaterial(0xffffff);
        //defaultMaterial.map = this.fbRenderer.texture;

        this.fbScene.add(new Mesh(new HeatMapBufferGeometry(data), intensityMaterial));

        this.renderer = new WebGLRenderer({
            alpha: true
        });
        this.appendChild(this.renderer.domElement);
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        var backMaterial = new MeshBasicMaterial(0xffffff);
        backMaterial.map = new TextureLoader().load('assets/img/uv.png');

        var background = new Mesh(
            new PlaneBufferGeometry(2, 2, 1, 1),
            backMaterial);

        background.position.set(0, 0, -0.5);

        var heatmap = new Mesh(
            new PlaneBufferGeometry(2, 2, 1, 1),
            colorMaterial);

        this.scene.add(background);
        this.scene.add(heatmap);
    }

    private appendChild(elt: any): void {
        this.getContainer().appendChild(elt);
    }

    public onSurfaceChanged(): boolean {
        if (this.getWidth() !== this.getContainerWidth() || this.getHeight() !== this.getContainerHeight()) {
            this.updateSizeFromContainer();
            return true;
        }
        return false;
    }

    public onDrawFrame(): void {
        //this.fbCamera.position.z = 50 + Math.sin(this.clock.getElapsedTime()) * 40;
        this.renderer.render(this.fbScene, this.fbCamera, this.fbRenderer);
        this.renderer.render(this.scene, this.camera);
    }

    private updateSizeFromContainer(): void {
        this.width = this.getContainerWidth();
        this.height = this.getContainerHeight();
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.fbRenderer.setSize(this.getWidth(), this.getHeight());
        this.fbCamera.aspect = this.getWidth() / this.getHeight();
        this.fbCamera.updateProjectionMatrix();
    }

    private getContainer(): any {
        return this.container;
    }

    private getContainerWidth(): number {
        return this.getContainer().offsetWidth;
    }

    private getContainerHeight(): number {
        return this.getContainer().offsetHeight;
    }

    private getWidth(): number {
        return this.width;
    }

    private getHeight(): number {
        return this.height; 
    }

}
