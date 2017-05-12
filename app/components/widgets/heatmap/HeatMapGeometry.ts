import {
    Geometry, BufferGeometry, Float32BufferAttribute,
    Int32BufferAttribute
} from 'three';


export class HeatMapGeometry extends Geometry {

    constructor(data: any[]) {
        super();

        this.type = "HeatMapGeometry";

        this.fromBufferGeometry(new HeatMapBufferGeometry(data));
        this.mergeVertices();
    }
}

export class HeatMapBufferGeometry extends BufferGeometry {

    constructor(data: any[]) {
        super();

        let vertices = [];
        let normals = [];
        let uvs = [];
        let heights = [];
        let colors = [];
        let offsets = [];        

        // used for uv normalisation
        var maxX = 1;
        var maxY = 1;

        // run through dataset    
        for (let i = 0; i < data.length; ++i) {
            let pt = data[i]; // [ x, y, size, height ]
            if (pt[0] > maxX) {
                maxX = pt[0];
            }
            if (pt[1] > maxY) {
                maxY = pt[1];
            }
            let s = pt[2] / 2;
            vertices.push(pt[0] - s, pt[1] - s, 0); offsets.push(-s, -s);
            vertices.push(pt[0] + s, pt[1] - s, 0); offsets.push(+s, -s);
            vertices.push(pt[0] - s, pt[1] + s, 0); offsets.push(-s, +s);
            vertices.push(pt[0] - s, pt[1] + s, 0); offsets.push(-s, +s);
            vertices.push(pt[0] + s, pt[1] - s, 0); offsets.push(+s, -s);
            vertices.push(pt[0] + s, pt[1] + s, 0); offsets.push(+s, +s);
            for (let j = 0; j < 6; ++j) {
                normals.push(0, 0, 1);
                uvs.push(pt[0], pt[1]);
                heights.push(pt[3]);
                colors.push(pt[3], pt[3], pt[3]);
            }
        }

        // normalize uv
        for (let i = 0; i < uvs.length; i += 2) {
            uvs[i] /= maxX;
            uvs[i + 1] /= maxY;
        }
        
        this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.addAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
        this.addAttribute('color', new Float32BufferAttribute(colors, 3));
        this.addAttribute('offset', new Float32BufferAttribute(offsets, 2));
        this.addAttribute('height', new Float32BufferAttribute(heights, 1));
    }
}
