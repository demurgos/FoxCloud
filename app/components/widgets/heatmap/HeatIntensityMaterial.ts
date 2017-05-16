import { ShaderMaterial, VertexColors, 
         CustomBlending, AdditiveBlending, OneFactor, 
         AddEquation, MinEquation, MaxEquation } from 'three';

/**
 * @see https://github.com/pyalot/webgl-heatmap
 */
export class HeatIntensityMaterial extends ShaderMaterial {

    constructor(intensityNorm?: number) {
        super({            
            vertexShader: "attribute vec2 offset;\n" +
            "attribute float height;\n" +
            "uniform float intensityNorm;\n" +
            "varying vec2 off,dim;\n" +
            "varying float vIntensity;\n" +
            "void main() {\n" +
            "\tvIntensity = height / intensityNorm;\n" +
            "\tdim = abs(offset);\n" +
            "\toff = offset;\n" +
            "\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "varying vec2 off, dim;\n" +
            "varying float vIntensity;\n" +
            "void main() {\n" +
            "\tfloat falloff = (1.0 - smoothstep(0.0, 1.0, length(off/dim)));\n" +
            "\tfloat intensity = falloff*vIntensity;\n" +
            "\tgl_FragColor = vec4(intensity);\n}",
            uniforms: { intensityNorm: { value: intensityNorm || 1.0 } }
        });
        this.transparent = true;
        this.blending = CustomBlending;
        this.blendSrc = OneFactor;
        this.blendDst = OneFactor;
        this.blendEquation = AddEquation;        
    }
}