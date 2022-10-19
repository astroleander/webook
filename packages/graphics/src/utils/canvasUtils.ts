type InitShaders = (gl: WebGLRenderingContext, vertex_shader_source: string, fragment_shader_source: string) => WebGLProgram;
type CreateProgram = (gl: WebGLRenderingContext, vertex_shader_source: string, fragment_shader_source: string) => WebGLProgram;
/**
 * WebGL Programming Guide - CPT.9 - P332 (CN-ZH version)
 * Create a program object and make current
 * @param gl GL context
 * @param vertex_shader a vertex shader program (GLSL in string) 
 * @param fragment_shader a fragment shader program (GLSL in string)
 * @return true, if the program object was created and successfully made current
 */
export const initShaders: InitShaders = (gl, vertex_shader_source, fragment_shader_source) => {
  /** 1-1 create Shader object */
  /** 1-2 set source code of the Shader object */
  /** 1-3 compile the source code */
  /** 2-1 create program object */
  /** 2-2 attach shader object to the program object*/
  const program = createProgram(gl, vertex_shader_source, fragment_shader_source);

  /** 3-1 link the program */
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`shader & program failed to link.` + gl.getProgramInfoLog(program))
  }
  /** 3-2 use the program */
  gl.useProgram(program)
  return program;
}

/**
 * Create a linked program object with two shaders
 * @param gl 
 * @param vertex_shader_source 
 * @param fragment_shader_source 
 * @returns program attached to the program
 */
const createProgram: CreateProgram = (gl: WebGLRenderingContext, vertex_shader_source: string, fragment_shader_source: string) => {
  /** 1-1 to 1-3 */
  const vertex_shader = loadShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
  const fragment_shader = loadShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

  /** 2-1 create program object */
  const program = gl.createProgram();
  if (!program) { throw new Error(`createProgram failed.`) };

  /** 2-2 attach shader object to the program object*/
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);

  return program;
}

/**
 * Create compiled shader object with assigned type and source
 * @param gl 
 * @param type shader type, CONTRAINT, 
 * @param source GLSL source to make shader object
 * @returns shader object
 */
const loadShader = (gl: WebGLRenderingContext, type: any, source: string) => {
  /** 1-1 create Shader object */
  const shader = gl.createShader(type);
  if (!shader) { throw new Error(`${type} shader failed to create.`); };

  /** 1-2 set source code of the Shader object */
  gl.shaderSource(shader, source);

  /** 1-3 compile the source code */
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`${type} shader failed to compile` + gl.getShaderInfoLog(shader))
  }

  return shader;
}

/**
 * Get webGL context from HTMLCanvasElement 
 * @param {HTMLCanvasElement} canvas HTMLCanvasElement
 * @returns {WebGLRenderingContext} context
 */
export const getWebGLContext:(x:HTMLCanvasElement) => WebGLRenderingContext = (canvas) => {
  const context = canvas.getContext('webgl');
  if (!context) { throw new Error('No available WebGL context could be found.') }
  return context;
}

/**
 * Set canvas attributes 
 * @param {HTMLCanvasElement} canvas HTMLCanvasElement
 */
export const initCanvas: (x: HTMLCanvasElement) => void = (canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return;
}
