const width = window.innerWidth;
const height = window.innerHeight;
const margin = 10;

async function main(){

  let model = await initModel({constants, url});
  let svg = initSvg('#plot', model, constants)
  .initControl()
  // .initButton()
  .initRecon();
  let img = newImg([0,0], svg.model);
  svg.draw(img);
  window.svg = svg;
}



function initSvg(svgId, model, constants){

  let svg = d3.select('svg' + svgId)
  .attr('width', width)
  .attr('height', height);

  svg.constants = constants;
  svg.initControl = initControl;
  svg.initRecon = initRecon;
  svg.draw = draw;
  // svg.setDigit = setDigit;
  svg.model = model;
  svg.drawWithParameter = drawWithParameter;
  // svg.dmeanstd = model.dmeanstd;
  // svg.drawDigit = drawDigit;
  // svg.reset = reset;
  // svg.initButton = initButton;
  return svg;
}



//========= methods attached to svg ==========


function initButton(){
  let svg = this;
  // let resetButton = d3.select(svg.node().parentNode)
  // .insert('div', ':first-child')
  // .append('i')
  // .attr('id', 'smallmultiple-clearBrushButton')
  // .on('mouseover', function() {
  //   d3.select(this).style('opacity', 1);
  // })
  // .on('mouseout', function() {
  //   d3.select(this).style('opacity', 0.7);
  // })
  // .attr('class', 'fas fa-sync-alt')
  // .on('click', ()=>{
  //   svg.reset();
  // })
  return svg;
}

function reset(){
  // let svg = this;
  // svg.initControl();
}


function initControl(){
  let svg = this;
  let constants = svg.constants;

  svg.controlSx = d3.scaleLinear()
  .domain(constants.xrange)
  .range([margin, width/2-margin]);
  
  svg.controlSy = d3.scaleLinear()
  .domain(constants.yrange)
  .range([height-margin, margin]);

  svg.markerSc = d3.scaleOrdinal()
  .domain(d3.range(9))
  .range(d3.schemeCategory10);

  svg.markers = svg.selectAll('.marker')
  .data(umap.embeddings.slice(0,10000))
  .enter()
  .append('circle')
  .attr('class', 'marker');
  svg.markers = svg.selectAll('.marker')
  .attr('cx', d=>svg.controlSx(d[0]))
  .attr('cy', d=>svg.controlSy(d[1]))
  .attr('r', 2)
  .attr('fill', (d,i)=>svg.markerSc(umap.labels[i]));

  svg.ax = d3.axisBottom(svg.controlSx);
  svg.append('g')
  .attr("transform", `translate(0,${svg.controlSy(0)})`)
  .call(svg.ax);
  svg.ay = d3.axisLeft(svg.controlSy);
  svg.append('g')
  .attr("transform", `translate(${svg.controlSx(0)}, 0)`)
  .call(svg.ay);

  svg.controlRect = svg.selectAll('.control')
  .data([constants])
  .enter()
  .append('rect')
  .attr('class', 'control');

  svg.controlRect = svg.selectAll('.control')
  .attr('x', svg.controlSx(constants.xrange[0]))
  .attr('y', svg.controlSy(constants.yrange[1]))
  .attr('width', svg.controlSx(constants.xrange[1])
    -svg.controlSx(constants.xrange[0]))
  .attr('height', svg.controlSy(constants.yrange[0])
    -svg.controlSy(constants.yrange[1]))
  .attr('fill', 'white')
  .attr('opacity', 0)
  .on('mousemove', ()=>{
    let x = d3.event.clientX;
    let y = d3.event.clientY;

    svg.drawWithParameter([
      svg.controlSx.invert(x),
      svg.controlSy.invert(y)]);
  });





  return svg;
}




function initRecon(){
  let svg = this;
  reconSize = Math.min(width/2, height/1.2);
  reconSize = Math.min(reconSize, 300);
  sxRecon = d3.scaleLinear()
  .domain([0,28])
  .range([width/2 + (width/2-reconSize)/2, 
    width/2 + (width/2-reconSize)/2 + reconSize]);
  
  syRecon = d3.scaleLinear()
  .domain([0,28])
  .range([0+(height-reconSize)/2,
    0+(height-reconSize)/2+reconSize]);
  
  scRecon = d3.interpolateViridis;

  imgRect = svg.selectAll('.imgRect')
  .data(d3.range(784))
  .enter()
  .append('rect')
  .attr('class', 'imgRect')
  .attr('x', (d,i)=>sxRecon(i%28))
  .attr('y', (d,i)=>syRecon(Math.floor(i/28)))
  .attr('width', sxRecon(1)-sxRecon(0)+1)
  .attr('height', syRecon(1)-syRecon(0)+1); 

  svg.sxRecon = sxRecon;
  svg.syRecon = syRecon;
  svg.scRecon = scRecon;
  svg.imgRect = imgRect;
  svg.reconSize = reconSize;
  return svg;
}

function draw(img){
  let svg = this;
  svg.imgRect
  .data(img)
  .attr('fill', d=>svg.scRecon(d));
}

function drawWithParameter(param){
  let svg = this;
  let img = newImg(param, svg.model);
  svg.draw(img);
}



//========= utils ==========


async function initModel(config){
  let constants = config.constants;
  let url = config.url;
  let model = await tf.loadLayersModel(url);
  model.constants = constants;
  return model;
}


function newImg(parameters, model){
  if(parameters===undefined){
    parameters = tf.randomUniform([1,2]);
  }else{
    parameters = tf.tensor2d(parameters, [1,2]);
  }
  parameters = parameters.reshape([1,2]);
  let reconstructed = model.predict(parameters).dataSync();
  reconstructed = Array.from(reconstructed);
  return reconstructed;
}


masks = [];
function digitMask(digit){
  if (masks[digit] === undefined){
    let m = tf.tidy(()=>{
      const one = tf.ones([1,16]);
      const zero = tf.zeros([1,16]);
      const mask = Array(10).fill(0).map((_,j)=>{
        if(digit == j){
          return one;
        }else{
          return zero;
        }
      });
      const digitMask = tf.concat(mask);
      return digitMask;
    });
    masks[digit] = m;
  }
  return masks[digit]
}






document.addEventListener('DOMContentLoaded', main);












