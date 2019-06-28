export default class CelShader extends THREE.ShaderMaterial {
    constructor(color=0xFFFFFF, props={}) {

        var opacity = props.opacity != undefined ? props.opacity : 1.0;
        var diffuse = props.diffuse != undefined ? props.diffuse : 0xeeeeee;
        var specular = props.specular != undefined ? props.specular : 0x111111;
        var uniforms = THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "fog" ],
            THREE.UniformsLib[ "lights" ],

            {
                "uBaseColor": { value: new THREE.Color( color ) },
                "diffuse": { value: new THREE.Color( diffuse ) },
                "specular": { value: new THREE.Color( specular ) },
                "opacity": { value: opacity },
            }
        ]);
        

        var vertexShader = [
            THREE.ShaderChunk[ "common" ],
            // THREE.ShaderChunk[ "fog_pars_vertex" ],
			"varying vec3 vNormal;",
			"varying vec3 vViewPosition;",

            "void main() {",

                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

                "vViewPosition = -mvPosition.xyz;",

                "vNormal = normalize( normalMatrix * normal );",

                "gl_Position = projectionMatrix * mvPosition;",

            "}",
        ].join('\n');

        var fragmentShader = [

            THREE.ShaderChunk[ "common" ],
            THREE.ShaderChunk[ "bsdfs" ],
            // THREE.ShaderChunk[ "fog_pars_vertex" ],
            THREE.ShaderChunk[ "lights_pars_begin" ],
			"varying vec3 vNormal;",
            "uniform vec3 testlight;",
            "uniform vec3 uBaseColor;",

            "uniform float opacity;",
            "uniform vec3 diffuse;",

            "varying vec3 vViewPosition;",

            "float diffuseFactor(vec3 normal, vec3 light_direction) {",
                "float df = dot(normalize(normal), normalize(light_direction));",
            
                "if (gl_FrontFacing) {",
                    "df = -df;",
                "}",
            
                "return max(0.0, df);",
            "}",

            "float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {",
 				"if ( decayExponent > 0.0 ) {",
 					"return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );",
 				"}",
 				"return 1.0;",
 			"}",


			"void main() {",
                "vec3 outgoingLight = vec3( 0.0 );",

                "vec3 totalDiffuseLight = vec3( 0.0 );",
                "float totalDF = 0.0;",

                // Point Lights
                "#if NUM_POINT_LIGHTS > 0",

					"for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

						"vec3 lVector = pointLights[ i ].position + vViewPosition.xyz;",

						"float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

                        "lVector = normalize( lVector );",
                        
                        "float df = diffuseFactor(vNormal, lVector);",

                        "totalDF += df;",


						"totalDiffuseLight += pointLights[ i ].color * ( df * attenuation );",

					"}",

				"#endif",

                // Directional Lights
                "#if NUM_DIR_LIGHTS > 0",

                    "for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

                        "vec3 dirVector = directionalLights[ 0 ].direction;",

                        "float df = diffuseFactor(vNormal, dirVector);",

                        "totalDF += df;",

                        "totalDiffuseLight += directionalLights[ i ].color * df;",
					"}",

                "#endif",

                // Hemisphere Lights
				"#if NUM_HEMI_LIGHTS > 0",

                "for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

                    "vec3 lVector = hemisphereLights[ i ].direction;",

                    "float dotProduct = dot( vNormal, lVector );",
                    "float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

                    "totalDiffuseLight += mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight );",

                "}",

            "#endif",

                 "float nSteps = 6.0;",
                 "float step = sqrt(totalDF) * nSteps;",
                 "step = (floor(step) + smoothstep(0.48, 0.52, fract(step))) / nSteps;", 
                 "float surface_color = step * step;",

                "vec3 colorVec = vec3(surface_color * uBaseColor.r, surface_color * uBaseColor.g, surface_color * uBaseColor.b );",

                "outgoingLight += colorVec.rgb * ( totalDiffuseLight + ambientLightColor * diffuse );",

                "gl_FragColor = vec4(outgoingLight, opacity);",

            "}",

        ].join('\n');


        super({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            lights: true
        })
    }
}

// Attributions
// @mohrtw
// modified from: https://github.com/jagracar/webgl-shader-examples/blob/master/WebContent/toon-example.html @author Javier Gracia Carpio
// and https://github.com/mrdoob/three.js/blob/master/examples/js/shaders/SkinShader.js @author alteredq / http://alteredqualia.com/