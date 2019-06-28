export default class GradientShader extends THREE.ShaderMaterial {
    constructor(colorA=0xFFFFFF, colorB=0x000000) {
        var uniforms = THREE.UniformsUtils.merge( [

			// THREE.UniformsLib[ "fog" ],
            THREE.UniformsLib[ "lights" ],
            { colorB: {type: 'vec3', value: new THREE.Color(colorA)},
                colorA: {type: 'vec3', value: new THREE.Color(colorB)}
            }
        ]);
        
        var vertexShader = `
            varying vec3 vUv; 

            void main() {
              vUv = position; 
        
              vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * modelViewPosition;
            }`;
        var fragmentShader = `
            uniform vec3 colorA; 
            uniform vec3 colorB; 
            varying vec3 vUv;
      
            void main() {
              gl_FragColor = vec4(mix(colorA, colorB, vUv.y), 1.0);
            }`;
        super({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader

        })
    }
}