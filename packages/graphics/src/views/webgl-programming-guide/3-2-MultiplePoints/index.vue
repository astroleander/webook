<template>
  <div ref='hud'></div>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import { getWebGLContext, initCanvas, initShaders } from "../../../utils/canvasUtils";
import { initOptions } from "../../../utils/hudUtils";

export default defineComponent({
  props: {
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement|null>(null);
    const hud = ref<HTMLDivElement|null>(null);
    const context = reactive<{gl: WebGLRenderingContext|null, program: WebGLProgram|null, mode: number, points: Float32Array}>({
      gl: null,
      program: null,
      mode: 0, // gl.POINTS
      points: new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]),
    })
    /** [ 👇 right in normal case ] destruction will lose the reactivity, but gl do not need this, we refresh flush by own hands*/
    // let { gl, program, mode, points, } = toRefs(context);
    let { gl, program, mode, points, } = context;

    /** Vertex Shader */
    const VERTEX_SHADER_SOURCE = /** glsl */`
      attribute vec4 a_Position;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
      }
    `

    /** Fragment Shader */
    const FRAGMENT_SHADER_SOURCE = /** glsl */`
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    /** create buffer -> bind buffer -> fill buffer -> assign position to program -> transfer position to protram */
    const initVertexBuffers = (gl, program, points, n) => {
      const vertices = new Float32Array(points);

      const vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) { throw new Error('failed to create the vertex buffer object'); }

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // 获取 attribute 变量的存储位置
      const a_Position = gl.getAttribLocation(program, 'a_Position');
      // if { ... }
      
      // 将顶点位置传输给 attribute 变量
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_Position);
      
      return n;
    }

    const drawPoints = (drawArray: [number, number, number], arrays) => {
      if (!gl) return;
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const nval = initVertexBuffers(gl, program, arrays, points.length/2);
      drawArray ? gl.drawArrays(...drawArray) : gl.drawArrays(gl.TRIANGLES, 0, nval);
      return;
    }

    type ButtonFuncMap = Array<[(canvas?: HTMLCanvasElement) => void, string?]>;
    const operators_mode: ButtonFuncMap = [
      [()=> { gl && (mode = gl.POINTS); drawPoints([mode, 0, points.length/2], points); }, 'POINTS' ],
      [()=> { gl && (mode = gl.LINES); drawPoints([mode, 0, points.length/2], points); }, 'LINES' ],
      [()=> { gl && (mode = gl.LINE_LOOP); drawPoints([mode, 0, points.length/2], points); }, 'LINE_LOOP' ],
      [()=> { gl && (mode = gl.TRIANGLES); drawPoints([mode, 0, points.length/2], points); }, 'TRIANGLES' ],
      [()=> { gl && (mode = gl.TRIANGLE_FAN); drawPoints([mode, 0, points.length/2], points); }, 'TRIANGLE_FAN' ],
      [()=> { gl && (mode = gl.TRIANGLE_STRIP); drawPoints([mode, 0, points.length/2], points); }, 'TRIANGLE_STRIP' ],
    ]
    const operators_points: ButtonFuncMap = [
      [ () => { points = new Float32Array([ 0.0, 0.5,  -0.5, -0.5,  0.5, -0.5]); gl && drawPoints([mode, 0, points.length/2], points)}, 'Basic 3'],
      [ () => { points = new Float32Array([-0.5, 0.5,   0.5,  0.5,  0.5, -0.5, -0.5, -0.5]); gl && drawPoints([mode, 0, points.length/2], points)}, '4 clockwise'],
      [ () => { points = new Float32Array([-0.5, 0.5,  -0.5, -0.5,  0.5, -0.5,  0.5,  0.5]); gl && drawPoints([mode, 0, points.length/2], points)}, '4 counterclockwise'],
      [ () => { points = new Float32Array([-0.5, 0.5,   0.5, -0.5, -0.5, -0.5,  0.5,  0.5]); gl && drawPoints([mode, 0, points.length/2], points)}, '4 cross'],
      [ () => { points = new Float32Array([-0.3, 0.3,   0.0,  0.5,  0.3,  0.3,  0.3, -0.3, 0, -0.5, -0.3, -0.3]); gl && drawPoints([mode, 0, points.length/2], points)}, '6 clockwise'],
      [ () => { points = new Float32Array([-0.3, 0.3,  -0.3, -0.3,  0, -0.5, 0.3, -0.3, 0.3, 0.3, 0,  0.5,  ]); gl && drawPoints([mode, 0, points.length/2], points)}, '6 counterclockwise'],
    ]

    onMounted(() => {
      if (!canvas.value) return { canvas };

      initCanvas(canvas.value);
      gl = getWebGLContext(canvas.value);
      program = initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

      drawPoints([mode, 0, points.length/2], points);
      hud.value && initOptions(hud.value, operators_mode, 'mode');
      hud.value && initOptions(hud.value, operators_points, 'points');
    })

    return { hud, canvas, ...toRefs(context), }
  },
});
</script>

<style>
</style>
