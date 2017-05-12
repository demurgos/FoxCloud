import { ShaderMaterial, VertexColors, AdditiveBlending, OneFactor, AddEquation } from 'three';

/**
 * @see https://github.com/pyalot/webgl-heatmap
 */
export class HeatIntensityMaterial extends ShaderMaterial {

    constructor() {
        super({            
            vertexShader: "attribute vec2 offset;\n" +
            "attribute float height;\n" +
            "varying vec2 off,dim;\n" +
            "varying float vIntensity;\n" +
            "void main() {\n" +
            "\tvIntensity = height;\n" +
            "\tdim = abs(offset);\n" +
            "\toff = offset;\n" +
            "\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 off, dim;\n" +
            "varying float vIntensity;\n" +
            "void main() {\n" +
            "\tfloat falloff = (1.0 - smoothstep(0.0, 1.0, length(off/dim)));\n" +
            "\tfloat intensity = falloff*vIntensity;\n" +
            "\tgl_FragColor = vec4(intensity);\n}"
        });
        this.transparent = true;
        this.blending = AdditiveBlending;
        this.blendSrc = OneFactor;
        this.blendDst = OneFactor;
        this.blendEquation = AddEquation;        
    }
}