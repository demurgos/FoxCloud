import {
    Camera, LinearFilter, WebGLRenderer,
    Mesh, Scene, WebGLRenderTarget,
    Texture, PlaneBufferGeometry,
    NearestFilter, ClampToEdgeWrapping
} from 'three';

import { HeatColorMaterial } from './HeatColorMaterial';
import { HeatIntensityMaterial } from './HeatIntensityMaterial';
import { HeatMapBufferGeometry } from './HeatMapGeometry';

export class HeatMapMesh extends Mesh {

    private needsUpdate: boolean;

    private fbScene: Scene;
    private fbRenderer: WebGLRenderTarget;
    private intensityNorm: number;

    constructor(intensityNorm?: number, gradientTexture?: Texture) {
        super();

        this.needsUpdate = true;

        this.intensityNorm = intensityNorm || 1;

        this.fbScene = new Scene();
        this.fbRenderer = new WebGLRenderTarget(0, 0, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            wrapS: ClampToEdgeWrapping,
            wrapT: ClampToEdgeWrapping,
            stencilBuffer: false,
            depthBuffer: false
        });

        this.material = new HeatColorMaterial(this.fbRenderer.texture, gradientTexture);
        this.geometry = new PlaneBufferGeometry(2, 2, 1, 1);

    }

    public clear(): void {
        this.fbScene.children.forEach((mesh: Mesh) => {
            mesh.material.dispose();
            mesh.geometry.dispose();
            this.fbScene.remove(mesh);
        });
        this.needsUpdate = true;
    }

    public setHeatMapData(data: any[]): void {
        this.clear();
        let intensityMaterial = new HeatIntensityMaterial(this.intensityNorm);
        this.fbScene.add(new Mesh(new HeatMapBufferGeometry(data), intensityMaterial));
        this.needsUpdate = true;
    }

    public update(renderer: WebGLRenderer, camera: Camera): void {        
        if (this.needsUpdate) {
            if(this.fbRenderer.width === 0) {
                this.setSize(renderer.getSize().width, renderer.getSize().height);
            }
            renderer.render(this.fbScene, camera, this.fbRenderer);
            this.needsUpdate = false;
        }
    }

    public setSize(width: number, height: number) {
        this.fbRenderer.setSize(width, height);
        this.needsUpdate = true;
    }
}