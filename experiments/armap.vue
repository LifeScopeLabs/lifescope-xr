<template>
	<!-- start the body of demo page -->
	<section class="bcontainer" style='margin : 0px; overflow: hidden;'>
		<!-- add some info at the top of the page -->
		<div style='position: fixed; top: 10px; width:100%; text-align: center; z-index: 1;'>
			<div id="arjsDebugUIContainer"></div>
		</div>

		<!-- Define demo 3d scene and enabled ar.js -->
		<a-scene embedded arjs='trackingMethod: best;'>

			<a-assets>
				<img id="marker-red" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/pins/map-marker-red.png">
				<img id="marker-blue" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/pins/map-marker-blue.png">
				<img id="marker-green" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/pins/map-marker-green.png">
				<img id="marker-yellow" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/pins/map-marker-yellow.png">
				<img id="marker-sky-blue" crossorigin="anonymous" src="https://rawgit.com/LifeScopeLabs/lifescope-xr/master/static/pins/map-marker-sky-blue.png">
			</a-assets>

			<a-entity light="type: ambient; color: #333"></a-entity>
			<a-entity light="color: #888; intensity: 0.5; castShadow: true" position="-20 20 0"></a-entity>
			<a-entity light="color: #888; intensity: 1.5; castShadow: true" position="+20 2 0"></a-entity>

			<!-- Create a anchor to attach demo augmented reality -->
			<a-anchor hit-testing-enabled='true'>

				<!-- Add demo augmented reality here -->
				
				<!-- Demo Map -->
				<a-mapbox-terrain latitude='34.023552' longitude='-118.286189' zoom-level='10'></a-mapbox-terrain>

				<!-- Demo Markers -->
				<a-image width="0.2" height="0.2" src="#marker-red" material="transparent: true;" rotation="0 0 0" position="0 0.15 0"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-red" material="transparent: true;" rotation="0 0 0" position="0.5 0.15 0"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-red" material="transparent: true;" rotation="0 0 0" position="0 0.15 0.5"></a-image>
				
				<a-image width="0.2" height="0.2" src="#marker-blue" material="transparent: true;" rotation="0 0 0" position="1.09 0.15 0.54"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-blue" material="transparent: true;" rotation="0 0 0" position="1.59 0.15 0.514"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-blue" material="transparent: true;" rotation="0 0 0" position="0.39 0.15 0.354"></a-image>
				
				<a-image width="0.2" height="0.2" src="#marker-green" material="transparent: true;" rotation="0 0 0" position="1.9 0.15 1.04"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-green" material="transparent: true;" rotation="0 0 0" position="1.59 0.15 0.914"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-green" material="transparent: true;" rotation="0 0 0" position="0.39 0.15 1.354"></a-image>
				
				<a-image width="0.2" height="0.2" src="#marker-yellow" material="transparent: true;" rotation="0 0 0" position="0.2 0.15 0.4"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-yellow" material="transparent: true;" rotation="0 0 0" position="0.19 0.15 0.914"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-yellow" material="transparent: true;" rotation="0 0 0" position="-0.39 0.15 0.354"></a-image>
				
				<a-image width="0.2" height="0.2" src="#marker-sky-blue" material="transparent: true;" rotation="0 0 0" position="-0.12 0.15 1.4"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-sky-blue" material="transparent: true;" rotation="0 0 0" position="-0.129 0.15 0.74"></a-image>
				<a-image width="0.2" height="0.2" src="#marker-sky-blue" material="transparent: true;" rotation="0 0 0" position="-0.439 0.15 0.65"></a-image>
				
				<!-- Lines -->
				<a-entity line="start: 0.390, 0.05, 1.354; end: -0.120 0.05 1.400; color: white"
						line__2="start: -0.120 0.05 1.400; end: 0.190 0.05 0.914; color: white"
						line__3="start: 0.190 0.05 0.914; end: -0.129 0.05 0.740; color: white"
						line__4="start: -0.129 0.05 0.740; end: -0.439 0.05 0.650; color: white"
						line__5="start: -0.439 0.05 0.650; end: -0.390 0.05 0.354; color: white"
						line__6="start: -0.390 0.05 0.354; end: 0.000 0.05 0.500; color: white"
						line__7="start: -0.0 0.05 0.50; end: 0.200 0.05 0.400; color: white"
						line__8="start: 0.200 0.05 0.400; end: 0.000 0.05 0.010; color: white"
						line__9="start: 0.000 0.05 0.010; end: 0.390 0.05 0.354; color: white"
						line__10="start: 0.390 0.05 0.354; end: 0.500 0.05 0.030; color: white"
						line__11="start: 0.500 0.05 0.030; end: 1.090 0.05 0.54; color: white"
						line__12="start: 1.090 0.05 0.54; end: 1.590 0.05 0.514; color: white"
						line__13="start: 1.590 0.05 0.514; end: 1.590 0.05 0.914; color: white"
						line__14="start: 1.590 0.05 0.914; end: 1.900 0.05 1.0400; color: white">
				</a-entity>

			</a-anchor>

			<!-- Define a static camera -->
			<a-camera-static/>

		</a-scene>
	</section>
</template>