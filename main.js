var regl = require('regl')()
var icosphere = require('icosphere')
var anormals = require('angle-normals')
var camera = require('regl-camera')(regl,{distance:4})
var mesh = icosphere(3)
var glsl = require('glslify')
var draw = regl({
	frag:glsl`
	precision highp float;
	#pragma glslify:snoise = require('glsl-noise/simplex/4d')
	varying vec3 vnorm, vpos;
	uniform float time;	
	void main (){
		gl_FragColor = vec4((vnorm + 1.0)*0.5*vec3(0,1,0) + snoise(vec4(vpos,time))*0.2,1);
	}
	`,	
	vert:glsl`
	precision highp float;
	#pragma glslify:snoise = require('glsl-noise/simplex/4d')
	attribute vec3 position,normal;
	uniform mat4 projection, view;
	varying  vec3 vnorm, vpos;
	uniform float time;
	void main(){
	vpos = position;
	vnorm = normal;
	gl_Position = projection * view * vec4(position + normal*snoise(vec4(position,time))*0.1,1);
	}
	`,
	uniforms:{
		time : regl.context('time')
	},
	attributes:{
		position:mesh.positions,
		normal:anormals(mesh.cells,mesh.positions)

	}
	,elements:mesh.cells
})
regl.frame(function(){
	regl.clear({color:[1,0,1,1],depth:true})
	camera(function(){
		draw()
	})
})