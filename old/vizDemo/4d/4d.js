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

var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');
var scaleX = d3.scaleLinear().domain([-1.3,1.3]).range([50,width-50]);
var scaleY = d3.scaleLinear().domain([-1.3,1.3]).range([height-50,50]);


var r = orth([[1,1,0.2,0],[0,1,1,1]]);


var points = d3.select('svg')
			.selectAll('circle')
			.data(data).enter()
			.append('circle')
			.attr('cx', function(d){ return scaleX( mult(r,d)[0] );  })
			.attr('cy', function(d){ return scaleY( mult(r,d)[1] );  })
			.attr('fill', function(d){
				if(d[0]==0.5 && d[1]==0.5 && d[2]==0.5 && d[3]==0.5
				|| d[0]==-0.5 && d[1]==-0.5 && d[2]==-0.5 && d[3]==-0.5)
					return 'red';
				else
					return 'white';
			})
			.attr('r',0)

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
var rot = norm(rand);
rot = rotation(rot);

var t = d3.transition()
    .ease(d3.easeLinear);
    
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
