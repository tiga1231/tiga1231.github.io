function orth(m){
	var res = [norm(m[0]),];
	for(var i=1; i<m.length; i++){
		res[i] = minus(m[i], proj(m[i-1], m[i]));
		res[i] = norm(res[i]);
	}
	return res;
}


function add(v1,v2){
	return v1.map(function(d,i){
		return d+v2[i];
	});
}


function minus(v1,v2){
	return v1.map(function(d,i){
		return d-v2[i];
	});
}


function dot(v1,v2){
	return v1.reduce(function(a,b,i){
		return a + b * v2[i];
	},0);
}


function scalar(v,a){
	return v.map(function(d){
		return d * a;
	});
}


function proj(u,v){
	var s = dot(u,v) / dot(u,u);
	return scalar(u,s);
}


function mult(m, p){
	var res = [];
	for (var i=0; i<m.length; i++){
		res[i] = m[i].reduce(function(a,b,i){return a+b*p[i]}, 0);
	}
	return res;
}


function norm(v){
	var res = [];
	var n = Math.sqrt(d3.sum(v.map(function(d){return d*d})));
	for(var i=0;i<v.length;i++){
		res[i] = v[i]/n;
	}
	return res;
}

function rotation(v){
	var a = v[0];
	var b = v[1];
	var c = v[2];
	var d = v[3];
	return [[a, -b, -c, -d],
			[b,  a, -d,  c],
			[c,  d,  a, -b],
			[d, -c,  b,  a]];
}

function hamming(v1,v2){
	return v1.reduce(function(a,b,i){
		return a + Math.abs(b - v2[i]);
	},0);
}

function len(v){
	return Math.sqrt(dot(v,v));
}
