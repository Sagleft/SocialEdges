function hideLoader() {
	$("#page_loader").hide();
}

function getUserPoint(index, r_count, r_radius) {
	var k = index + 0.5;
	var theta = Math.acos(1 - 2 * k / r_count);
	var phi = Math.PI * (1 + Math.sqrt(5)) * k;
	var x = r_radius * Math.cos(phi) * Math.sin(theta);
	var y = r_radius * Math.sin(phi) * Math.sin(theta);
	var z = r_radius * Math.cos(theta);

	return [x, y, z];
}

function css3DPointGroup(x, y, z) {
	var img = document.createElement( 'img' );
	img.className = 'pointsGroup';
	img.src = '/img/circle.png';

	var pointsGroup = new THREE.CSS3DObject( img );
	pointsGroup.position.set( x, y, z );

	return pointsGroup;
}

function css3DAvatar(hash, x, y, z, opacity, uid) {
	var img = document.createElement( 'img' );
	img.className = 'pointAvatar';
	img.id = uid;
	//img.src = 'https://www.gravatar.com/avatar/'+hash+'?s=256&d=robohash&r=g';
	img.src = '/img/avatar.png';
	img.style.opacity = opacity;

	var avatar = new THREE.CSS3DObject( img );
	avatar.position.set( x, y, z );

	return avatar;

	//var object = new THREE.CSS3DObject( img );
	//object.position.set( x, y, z );
	//return object;
}

function getuserPoint_Tetrodex(index, r_count, r_radius) {
	var theta = (11/12) * r_count - 1.8;
	var z = r_radius * (2 * index - r_count - 1) / (r_count - 1);
	var psi;
	if(Math.abs(z) >= r_radius*(1 - 0.9)) {
		psi = Math.abs(z) / r_radius;
	} else {
		psi = 0;
	}
	var omicron;
	if(psi == 0) {
		omicron = 0;
	} else {
		omicron = Math.sqrt(psi);
	}

	var phi = 2 * Math.PI * index * theta / r_count;

	var k = Math.sin(-1 * Math.PI * (z - r_radius) / (2 * r_radius)) + omicron;
	var x = k * Math.cos(phi) * r_radius + psi * Math.sin(phi) * z + omicron*psi;
	var y = k * Math.sin(phi) * r_radius + psi * Math.cos(phi) * z + omicron*psi;

	return [x, y, z];
}

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
