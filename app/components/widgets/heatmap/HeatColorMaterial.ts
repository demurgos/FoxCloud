import { ShaderMaterial, Texture } from 'three';

const COLOR_FUNC_DEFAULT = `vec3 getColor(float intensity) {
                vec3 blue = vec3(0.0, 0.0, 1.0);
                vec3 cyan = vec3(0.0, 1.0, 1.0);
                vec3 green = vec3(0.0, 1.0, 0.0);
                vec3 yellow = vec3(1.0, 1.0, 0.0);
                vec3 red = vec3(1.0, 0.0, 0.0);
                vec3 color = (
                    fade(-0.25, 0.25, intensity)*blue +
                    fade(0.0, 0.5, intensity)*cyan +
                    fade(0.25, 0.75, intensity)*green +
                    fade(0.5, 1.0, intensity)*yellow +
                    smoothstep(0.75, 1.0, intensity)*red);
                return color;
            }`;

const COLOR_FUNC_GRADIANT = `uniform sampler2D gradientTexture;
                vec3 getColor(float intensity){
                    return texture2D(gradientTexture, vec2(intensity, 0.0)).rgb;
                }`;

/**
 * @see https://github.com/pyalot/webgl-heatmap
 */
export class HeatColorMaterial extends ShaderMaterial {
    constructor(texture: Texture, gradientTexture?: Texture, alphaRange?: [number,number,number]) {
        super({
            vertexShader: `varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,            
            uniforms: {
                source: { 
                    value: texture
                },                 
                alphaStart: {
                    value: alphaRange ? alphaRange[0] : 0.0
                }, 
                alphaEnd: {
                    value: alphaRange ? alphaRange[1]: 1.0 
                },
                alphaMax: {
                    value: alphaRange ? alphaRange[2] : 1.0
                }
            }
        });

        let colorFunc = COLOR_FUNC_DEFAULT;

        if(gradientTexture !== undefined) {
            colorFunc = COLOR_FUNC_GRADIANT;
            this.uniforms.gradientTexture = { value: gradientTexture };
        }

        this.fragmentShader = `uniform sampler2D source;
            uniform float alphaStart, alphaEnd, alphaMax;
            varying vec2 vUv;
            vec4 alphaFun(vec3 color, float intensity) {
                float alpha = smoothstep(alphaStart, alphaEnd, intensity);                
                return vec4(color*alpha, min(alpha, alphaMax));
            }
            float fade(float low, float high, float value) {
                float mid = (low+high)*0.5;
                float range = (high-low)*0.5;
                float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);
                return smoothstep(0.0, 1.0, x); 
            }
            ${colorFunc}
            void main() {
                float intensity = smoothstep(0.0, 1.0, texture2D(source, vUv).r);
                vec3 color = getColor(intensity);
                gl_FragColor = alphaFun(color, intensity);
            }`;

        this.transparent = true;
        this.premultipliedAlpha = false;
    }

    public setOpacity(opacity: number): void {
        this.uniforms.alphaMax.value = opacity;
        this.needsUpdate = true;
    }
}
