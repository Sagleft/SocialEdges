$(document).ready(function(){
	function getUsers() {
		$.ajax({
			url : "/api/getUsers",
			type : 'GET',
			cache : false,
			dataType : 'json',
			processData : false,
			contentType : false,
			success     : function(data, textStatus, jqXHR){
				var response = jqXHR.responseText;
				if(!IsJsonString(response)) {
					console.log("main query: json error");
				} else {
					initUsers(response);
				}
			}
		});
	}

	function getUsersPlaceholder() {
		initUsersPlaceholder();
	}

	var scene = new THREE.Scene();
	var selectedObject = null;
	var group = new THREE.Group();

	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 7;
	//var controls = new THREE.OrbitControls( camera );

	var rendererWebGL = new THREE.WebGLRenderer({
		alpha: true // remove canvas' bg color
	});
	rendererWebGL.setSize( window.innerWidth, window.innerHeight );

	var renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;

	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );
	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var spherical_positions = [];

	//var spritesParentObj = css3DPointGroup(0, 0, 0);
	//scene.add(spritesParentObj);

	var last_selected_point = null;
	var sprites_arr = [];
	var sprites_arrIndexed = [];
	//getUsers();
	getUsersPlaceholder();
	//var scale_min = 1;
	//var scale_max = 1.2;

	function initUsersPlaceholder() {
		var data_arr = [];
		var users_data = [];

		var points = 50;
		var index_from = 0;
		var index_to = points-1;
		var radius = 2.2 * points / 60 + 2.5;

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin('anonymous');
		var FAI_max = 0;

		//находим максимум FAI
		FAI_max = 5;

		//instantiate user points
		for(var i = index_from; i<=index_to; i++) {
			//var testTexture = loader.load('https://www.gravatar.com/avatar/'+users_data[i].hash+'?s=256&d=robohash&r=g');

			var FAI = Math.random() * 5;
			//var FAI_scale = Math.sqrt(FAI + 1) / 2;
			var FAI_scale = Math.sqrt(FAI + 1) / 2;
			var FAI_opacity = FAI / FAI_max;
			if(FAI_opacity > 0.5) {
				FAI_opacity = 1;
			}
			var scale_fix = 0.0058;
			FAI_scale = FAI_scale * scale_fix;

			//var sprite = new THREE.Sprite( material );
			var cube_position_arr = [
				Math.random() * 14 * radius - 7 * radius,
				Math.random() * 14 * radius - 7 * radius,
				Math.random() * 14 * radius - 7 * radius
			];
			spherical_positions[i] = getUserPoint(i, points, radius);
			//sprite.position.set(cube_position_arr[0], cube_position_arr[1], cube_position_arr[2]);

			var sprite = css3DAvatar('', cube_position_arr[0], cube_position_arr[1], cube_position_arr[2], FAI_opacity, i);
			sprite.scale.set(FAI_scale, FAI_scale, FAI_scale);
			sprite.lookAt(camera.position);

			//console.log(i);
			//console.log(sprite);
			sprites_arr[i] = sprite;
			sprites_arrIndexed[i] = sprite;

			var pointDataObject = {
				index: i,
				uid: i,
				nick: 'Anonymous',
				hash: 'placeholderhash',
				is_selected: false,
				scale_min: FAI_scale,
				scale_max: FAI_scale*1.2
			};
			sprite.userData = pointDataObject;
			//sprite.parent = spritesParentObj;
			group.add( sprite );
			//scene.add( sprite );
		}
		scene.add( group );
		transition();
	}

	function initUsers(json) {
		var data_arr = JSON.parse(json);
		var users_data = data_arr.data;
		//TODO: разбирать вывод ошибок (data_arr.error) и статуса (data_arr.status)

		var points = users_data.length;
		var index_from = 0;
		var index_to = points-1;
		var radius = 2.2 * points / 60 + 2.5;

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin('anonymous');
		var FAI_max = 0;

		//находим максимум FAI
		for(var i = index_from; i<=index_to; i++) {
			if(FAI_max < users_data[i].FAI) {
				FAI_max = users_data[i].FAI;
			}
		}

		//instantiate user points
		for(var i = index_from; i<=index_to; i++) {
			//var testTexture = loader.load('https://www.gravatar.com/avatar/'+users_data[i].hash+'?s=256&d=robohash&r=g');

			var FAI = users_data[i].FAI + 0;
			//var FAI_scale = Math.sqrt(FAI + 1) / 2;
			var FAI_scale = Math.sqrt(FAI + 1) / 2;
			var FAI_opacity = users_data[i].FAI / FAI_max;
			if(FAI_opacity > 0.5) {
				FAI_opacity = 1;
			}
			var scale_fix = 0.0058;
			FAI_scale = FAI_scale * scale_fix;

			//var material = new THREE.SpriteMaterial({
			//	map: testTexture,
			//	opacity: FAI_opacity
			//});

			//var sprite = new THREE.Sprite( material );
			var cube_position_arr = [
				Math.random() * 14 * radius - 7 * radius,
				Math.random() * 14 * radius - 7 * radius,
				Math.random() * 14 * radius - 7 * radius
			];
			spherical_positions[i] = getUserPoint(i, points, radius);
			//sprite.position.set(cube_position_arr[0], cube_position_arr[1], cube_position_arr[2]);

			var sprite = css3DAvatar(users_data[i].hash, cube_position_arr[0], cube_position_arr[1], cube_position_arr[2], FAI_opacity, i);
			sprite.scale.set(FAI_scale, FAI_scale, FAI_scale);
			sprite.lookAt(camera.position);

			sprites_arr[users_data[i].id] = sprite;
			sprites_arrIndexed[i] = sprite;

			var pointDataObject = {
				index: i,
				uid: users_data[i].id,
				nick: users_data[i].nick_name,
				hash: users_data[i].hash,
				is_selected: false,
				scale_min: FAI_scale,
				scale_max: FAI_scale*1.2
			};
			sprite.userData = pointDataObject;
			scene.add( sprite );
		}

		var need_edges = false;
		if(need_edges) {
			$.ajax({
				url : "/api/getEdges",
				type : 'GET',
				cache : false,
				dataType : 'json',
				processData : false,
				contentType : false,
				success     : function(data, textStatus, jqXHR){
					var response = jqXHR.responseText;
					if(!IsJsonString(response)) {
						console.log("edges query: json error");
					} else {
						initEdges(response);
					}
				}
			});
		} else {
			hideLoader();
		}
		transition();
	}

	function initEdges(json) {
		var data_arr = JSON.parse(json);
		var edges_data = data_arr.data;
		//var colors = [
		//	new THREE.Color( 0x29b6f6 ), new THREE.Color( 0xf5f5f5 )
		//];
		var matLine = new THREE.LineBasicMaterial( { color: 0x42A5F5, linewidth: 7 } );

		for(var i = 0; i<edges_data.length; i++) {
			var edge = edges_data[i];
			var sprite_from = sprites_arr[edge.uid_from];
			var sprite_to = sprites_arr[edge.uid_to];

			geometry = new THREE.Geometry();
			geometry.vertices.push(sprite_from.position);
			geometry.vertices.push(sprite_to.position);

			line = new THREE.Line(geometry, matLine);
			scene.add( line );
		}

		hideLoader();
	}

	//console.log(testTexture);

	var animationRotateAngularSpeed = Math.PI / 180;
	function animate() {
		requestAnimationFrame( animate );
		//controls.update();

		TWEEN.update();
		sprites_arr.forEach(function(item, i, arr) {
			item.lookAt(camera.position);
		});
		//group.rotateY(Math.PI / 180);

		rendererWebGL.render( scene, camera );
		renderer.render( scene, camera );
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		rendererWebGL.setSize( window.innerWidth, window.innerHeight );
	}

	function setFromCamera(raycaster, coords, origin){
		raycaster.ray.origin.copy( camera.position );
		raycaster.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( camera.position ).normalize();
	}

	window.addEventListener( 'resize', onWindowResize, false );
	//window.addEventListener( "mousemove", onDocumentMouseMove, false );
	//document.addEventListener('mousedown', onMouseDown, false);

	//renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setSize(window.innerWidth, window.innerHeight);
	//document.body.appendChild( rendererWebGL.domElement );
	$("#WebGL_output").append(renderer.domElement);
	$("#WebGL_output").append(rendererWebGL.domElement);

	//controls.update();
	animate();

	//var current = 0;
	function transition() {
		//var offset = current * sprites_arr.length * 3;
		var duration = 2000;
		for ( var i = 0; i < sprites_arrIndexed.length; i ++) {
			var object = sprites_arrIndexed[ i ];
			//анимация на каждый аватар - полет к точкам на сфере
			new TWEEN.Tween( object.position )
				.to( {
					x: spherical_positions[ i ][0],
					y: spherical_positions[ i ][1],
					z: spherical_positions[ i ][2]
				}, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}
		//console.log(group.rotation);
		//анимация на вращение группы аватаров
		new TWEEN.Tween( group.rotation )
			.to( {
				x: group.rotation.x,
				y: group.rotation.y + Math.PI,
				z: group.rotation.z
			}, duration * 1.5 )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
		new TWEEN.Tween( this )
			.to( {}, duration * 3 )
			.onComplete( transition )
			.start();
		//current = ( current + 1 ) % 4;
	}
});
