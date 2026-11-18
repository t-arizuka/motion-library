/**
 * Motion Library / Light Rays Study 001
 * Original standalone WebGL1 renderer. Static visual quality gate only.
 * No third-party shader source, image texture, animation loop or Bloom.
 */
(() => {
  'use strict';
  const canvas = document.getElementById('rays-canvas');
  const stage = document.getElementById('rays-stage');
  const status = document.getElementById('render-status');
  const diagnostics = document.getElementById('render-diagnostics');
  if (!canvas || !stage) return;

  let gl, program, buffer, resizeObserver;
  let animationFrame = 0;
  let state = 'loading';
  let lost = false;
  let disposed = false;
  const dprCap = 1.5;
  const limit = 1800;

  const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=(a_position+1.0)*.5;gl_Position=vec4(a_position,0.0,1.0);}
`;

  function fail(message) {
    state = 'error';
    document.documentElement.dataset.lightRaysReady = 'error';
    status.textContent = 'WebGL描画エラー：' + String(message);
    status.classList.remove('ready');
    status.classList.add('error');
    canvas.hidden = true;
    console.error('[Light Rays Study 001]', message);
  }
  function shader(type, source) {
    const sh = gl.createShader(type);
    if (!sh) throw new Error('WebGLシェーダーを作成できません');
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh) || 'GLSLコンパイルに失敗';
      gl.deleteShader(sh);
      throw new Error(log);
    }
    return sh;
  }
  function createPipeline(fragmentSource) {
    const vs = shader(gl.VERTEX_SHADER, vertexSource);
    const fs = shader(gl.FRAGMENT_SHADER, fragmentSource);
    const p = gl.createProgram();
    if (!p) throw new Error('WebGLプログラムを作成できません');
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p) || 'GLSLリンクに失敗';
      gl.deleteProgram(p);
      throw new Error(log);
    }
    program = p;
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program,'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  }

  function redraw() {
    animationFrame=0;
    if (disposed || lost || !gl || !program) return;
    const rect=stage.getBoundingClientRect();
    if (rect.width<1 || rect.height<1) return;
    const ratio=Math.min(window.devicePixelRatio||1,dprCap);
    const scale=Math.min(ratio,limit/Math.max(rect.width,rect.height));
    const w=Math.max(1,Math.round(rect.width*scale));
    const h=Math.max(1,Math.round(rect.height*scale));
    if(canvas.width!==w || canvas.height!==h){canvas.width=w;canvas.height=h;}
    gl.viewport(0,0,w,h);
    gl.useProgram(program);
    gl.uniform2f(gl.getUniformLocation(program,'u_resolution'),w,h);
    gl.drawArrays(gl.TRIANGLES,0,3);
    const error=gl.getError();
    if(error!==gl.NO_ERROR){fail('GPU描画エラー '+error);return;}
    canvas.hidden = false;
    state='ready';
    status.textContent='WebGL静止フレーム描画済み';
    status.classList.remove('error');
    status.classList.add('ready');
    diagnostics.textContent=w+' × '+h+' · 静止1フレーム · WebGL';
    document.documentElement.dataset.lightRaysReady='true';
  }
  function queueRedraw(){
    if(animationFrame || disposed || lost)return;
    animationFrame=requestAnimationFrame(redraw);
  }
  async function initialize(){
    try{
      const response=await fetch('./light-rays.frag',{cache:'no-store'});
      if(!response.ok)throw new Error('GLSLファイルを読み込めません ('+response.status+')');
      const fragment=await response.text();
      if(disposed)return;
      gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
      if(!gl)throw new Error('このブラウザではWebGLが利用できません');
      createPipeline(fragment);
      resizeObserver=new ResizeObserver(queueRedraw);
      resizeObserver.observe(stage);
      window.addEventListener('resize',queueRedraw,{passive:true});
      queueRedraw();
    }catch(err){if(!disposed)fail(err?.message||String(err));}
  }
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();lost=true;
    document.documentElement.dataset.lightRaysReady='error';
    status.classList.add('error');status.textContent='WebGL接続が失われました';
  });
  canvas.addEventListener('webglcontextrestored',()=>{window.location.reload();});
  window.addEventListener('pagehide',()=>{
    disposed=true;
    if(animationFrame)cancelAnimationFrame(animationFrame);
    if(resizeObserver)resizeObserver.disconnect();
    window.removeEventListener('resize',queueRedraw);
    if(gl){if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);}
  },{once:true});
  window.motionLightRaysStudy={get status(){return state;},get canvas(){return canvas;},redraw:queueRedraw,approved:false};
  initialize();
})();
