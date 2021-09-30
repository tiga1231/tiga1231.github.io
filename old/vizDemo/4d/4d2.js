'use strict';

var data = d3.range(16).map(function(d){
	var w = Math.floor(d/8) % 2 - 0.5;
	var x = Math.floor(d/4) % 2 - 0.5;
	var y = Math.floor(d/2) % 2 - 0.5;
	var z = Math.floor(d/1) % 2 - 0.5;
	return [w,x,y,z];
});

var edgeData = [];
for (var i=0; i<data.length; i++){
	for(var j=0; j<data.length; j++){
		if (hamming(data[i],data[j]) == 1){
			edgeData.push([data[i],data[j]])
		}
	}
}

var n = 4;
data = [];
for (var i=0; i<=n; i++)
for (var j=0; j<=n; j++)
for (var k=0; k<=n; k++)
for (var l=0; l<=n; l++)
data.push(randData(i/n-0.5,j/n-0.5,k/n-0.5,l/n-0.5,1/n/5))

function randData(i,j,k,l,r){
	var res = [i+Math.random()*r,
	j+Math.random()*r,
	k+Math.random()*r,
	l+Math.random()*r];
	
	return res;

}


var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');
var scaleX = d3.scaleLinear().domain([-1.3,1.3]).range([50,width-50]);
var scaleY = d3.scaleLinear().domain([-1.3,1.3]).range([height-50,50]);
var scaleC = d3.scaleLinear().domain([-0.5,0,0.5]).range(['blue','white','red']);

var r = orth([[1,1,0.2,0],[0,2,1,1]]);


var points = d3.select('svg')
			.selectAll('circle')
			.data(data).enter()
			.append('circle')
			.attr('cx', function(d){ return scaleX( mult(r,d)[0] );  })
			.attr('cy', function(d){ return scaleY( mult(r,d)[1] );  })
			.attr('fill', function(d){
				return scaleC(d[0]);
			})
			.attr('r',2)
			.style('opacity',0.8)

var lines = d3.select('svg')
.selectAll('line')
.data(edgeData)
.enter()
.append('line')
.attr('x1', function(d){ return scaleX( mult(r,d[0])[0] );  })
.attr('y1', function(d){ return scaleY( mult(r,d[0])[1] );  })
.attr('x2', function(d){ return scaleX( mult(r,d[1])[0] );  })
.attr('y2', function(d){ return scaleY( mult(r,d[1])[1] );  })
.attr('stroke','gray')



var rand = randv(4);
rand[0] += 5;

rand = [5.132196526514945, 0.07454122730919766, 0.7892473661834196, 0.5097271364343692];


var rot = norm(rand);
rot = rotation(rot);

    
for(var i=0; i<100; i++){
	r[0] = mult(rot,r[0]);
	r[1] = mult(rot,r[1]);
	var delay = 300;
	
	
	points.transition()
	.delay(i*delay)
	.duration(delay)
	.ease(d3.easeLinear)
	.attr('cx', function(d){return scaleX( mult(r,d)[0] );  })
	.attr('cy', function(d){return scaleY( mult(r,d)[1] );  })
	
	
	lines.transition()
	.delay(i*delay)
	.duration(delay)
	.ease(d3.easeLinear)
	.attr('x1', function(d){ return scaleX( mult(r,d[0])[0] );  })
	.attr('y1', function(d){ return scaleY( mult(r,d[0])[1] );  })
	.attr('x2', function(d){ return scaleX( mult(r,d[1])[0] );  })
	.attr('y2', function(d){ return scaleY( mult(r,d[1])[1] );  })

}



function randv(len){
	var res = [];
	for(var i=0; i<len; i++){
		res[i] = Math.random();
	}
	return res;
}
