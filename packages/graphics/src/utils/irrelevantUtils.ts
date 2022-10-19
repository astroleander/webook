/** RFDR is short for "Repeat Fragment; Donot Read; " */
export default {
  BASIC_RED_FRAGMENT_SHADER_SOURCE: /** glsl */`
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
  /**
   * @returns [ FRAGMENT_SHADER_SOURCE, U_NAME ]
   */
  CREATE_BASIC_FRAGMENT_SHADER_SOURCE: (name='u_FragColor') => [/** glsl */`
    precision mediump float;
    uniform vec4 ${name};
    void main() {
      gl_FragColor = ${name};
    }
  `, name],
  CREATE_BASIC_VERTEX_SHADER_SOURCE: (name = 'a_Position') => [/** glsl */`
    attribute vec4 ${name};
    void main() {
      gl_Position = ${name};
    }
  `, name]
}