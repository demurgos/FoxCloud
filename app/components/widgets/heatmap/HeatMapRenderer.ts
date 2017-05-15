
import {
    Clock, Scene, PerspectiveCamera, OrthographicCamera,
    WebGLRenderer, Mesh, MeshBasicMaterial,
    TextureLoader, Texture, PlaneBufferGeometry
} from 'three';

import { HeatMapMesh } from './HeatMapMesh';

export class HeatMapRenderer {
    
    private width: number;
    private height: number;

    private clock: Clock;

    private heatmapCamera: PerspectiveCamera;
    private heatmaps: HeatMapMesh[] = [];

    private background: MeshBasicMaterial;

    private camera: OrthographicCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;

    constructor(private container: any, private params: any) {

        this.container = container;
        this.params = params;
        this.params.fov = 70;
        this.width = this.height = 1;

        this.commonInit();
    }

    private commonInit(): void {

        this.clock = new Clock();        

        this.heatmapCamera
            = new PerspectiveCamera(this.params.fov, this.getWidth() / this.getHeight(), 0.1, 2000);         
        this.heatmapCamera
            .position.set(0, 0, 100);        

        this.renderer = new WebGLRenderer({
            alpha: true
        });
        this.appendChild(this.renderer.domElement);
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.background = new MeshBasicMaterial(0xffffff);        

        let backgroundPlane = new Mesh(
            new PlaneBufferGeometry(2, 2, 1, 1),
            this.background);
        backgroundPlane.position.set(0, 0, -0.5);

        this.scene.add(backgroundPlane);        
    }

    private appendChild(elt: any): void {
        this.getContainer().appendChild(elt);
    }

    public setBackground(texture: Texture): void {
        this.background.map = texture;
    }

    public onSurfaceChanged(): boolean {
        if (this.getWidth() !== this.getContainerWidth() || this.getHeight() !== this.getContainerHeight()) {
            this.updateSizeFromContainer();
            return true;
        }
        return false;
    }

    public removeAllHeatMap(): void {
        this.heatmaps.forEach((heatmap: HeatMapMesh) => {
            heatmap.clear();
            this.scene.remove(heatmap);
        });
        this.heatmaps = [];
    }

    public addHeatMap(data: any[], intensityNorm?: number, gradientTexture?: Texture): void {
        let heatmap = new HeatMapMesh(intensityNorm, gradientTexture);
        heatmap.setHeatMapData(data);
        this.heatmaps.push(heatmap);
        this.scene.add(heatmap);        
    }

    public onDrawFrame(): void {
        this.heatmaps.forEach((heatmap: HeatMapMesh) => heatmap.update(this.renderer, this.heatmapCamera));              
        this.renderer.render(this.scene, this.camera);
    }

    private updateSizeFromContainer(): void {
        this.width = this.getContainerWidth();
        this.height = this.getContainerHeight();
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.heatmaps.forEach((heatmap: HeatMapMesh) => heatmap.setSize(this.getWidth(), this.getHeight()));             
        this.heatmapCamera
            .aspect = this.getWidth() / this.getHeight();
        this.heatmapCamera
            .updateProjectionMatrix();
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
