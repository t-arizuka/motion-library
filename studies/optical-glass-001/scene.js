/**
 * Motion Library — Optical Glass Study 001
 * A REAL, static Three.js WebGL scene (not a generated picture).
 * Glass form: authored thick parametric ribbon geometry with a physical
 * transmission material, PMREM studio reflection environment, and no Bloom.
 *
 * Study only. Not a WordPress renderer and not a product-quality approval.
 * Three.js: MIT License, © Three.js Authors.
 */
(async function bootOpticalGlass() {
  'use strict';

  var root = document.getElementById('glass-canvas');
  var status = document.getElementById('webgl-status');
  var perf = document.getElementById('diagnostic-count');
  var activeRenderer = null;
  var disposed = false;
  var onResize = null;
  var framebufferError = null;

  function reportError(reason) {
    if (!status) return;
    status.textContent = 'WebGL表示を確認できません: ' + String(reason || '描画環境を確認してください');
    status.classList.add('error');
    document.documentElement.dataset.glassReady = 'error';
    console.error('[Motion Library / Optical Glass 001]', reason);
  }
  if (!root) return;

  try {
    // Pinned build; do not load a moving "latest" dependency.
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js');
    if (disposed) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-9.4, 9.4, 5.3, -5.3, .1, 90);
    camera.position.set(0, .22, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: false, antialias: true, depth: true, stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    activeRenderer = renderer;
    renderer.setClearColor(0x0c1826, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.20;
    renderer.transmissionResolutionScale = .82;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    root.appendChild(renderer.domElement);

    // Invisible studio environment for real specular reflection in the glass.
    // This is authored illumination, NOT a screen-space glow overlay.
    function createStudioEnvironment() {
      const w = 1024, h = 512;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const base = ctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, '#101a2b');
      base.addColorStop(.36, '#1a3448');
      base.addColorStop(.7, '#182836');
      base.addColorStop(1, '#050912');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      const panels = [
        {x:.07, y:.32, w:.095, h:.50, color:'231,241,255', peak:.83},
        {x:.25, y:.18, w:.035, h:.65, color:'255,250,230', peak:.82},
        {x:.42, y:.24, w:.14, h:.34, color:'175,216,255', peak:.74},
        {x:.65, y:.34, w:.025, h:.54, color:'255,238,213', peak:.95},
        {x:.80, y:.18, w:.11, h:.59, color:'218,239,253', peak:.77},
        {x:.96, y:.22, w:.028, h:.61, color:'173,220,255', peak:.86}
      ];
      for (const p of panels) {
        const px = p.x*w, py=p.y*h, rw=p.w*w, rh=p.h*h;
        const g = ctx.createLinearGradient(px-rw/2, 0, px+rw/2, 0);
        g.addColorStop(0, 'rgba('+p.color+',0)');
        g.addColorStop(.25,'rgba('+p.color+','+(p.peak*.25)+')');
        g.addColorStop(.48,'rgba('+p.color+','+p.peak+')');
        g.addColorStop(.52,'rgba('+p.color+','+p.peak+')');
        g.addColorStop(.76,'rgba('+p.color+','+(p.peak*.25)+')');
        g.addColorStop(1, 'rgba('+p.color+',0)');
        ctx.fillStyle=g;
        ctx.fillRect(px-rw/2,py,rw,rh);
      }
      // A warm lower fill card only exists in the reflection environment.
      const wash=ctx.createRadialGradient(w*.58,h*.72,3,w*.58,h*.72,w*.22);
      wash.addColorStop(0,'rgba(255,206,155,.54)');
      wash.addColorStop(1,'rgba(255,206,155,0)');
      ctx.fillStyle=wash;ctx.fillRect(0,0,w,h);
      const t=new THREE.CanvasTexture(canvas);
      t.mapping=THREE.EquirectangularReflectionMapping;
      t.colorSpace=THREE.SRGBColorSpace;
      t.needsUpdate=true;
      const pmrem=new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const baked=pmrem.fromEquirectangular(t);
      scene.environment=baked.texture;
      scene.environmentIntensity=1.8;
      t.dispose();
      pmrem.dispose();
      return baked;
    }
    const studioTarget=createStudioEnvironment();

    // Full-viewport *real scene* background. Broad low-contrast illumination,
    // restrained caustic-like hints near the sculpture's base, no Bloom.
    const background = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 29),
      new THREE.ShaderMaterial({
        depthWrite:false,depthTest:false,toneMapped:false,
        vertexShader:[
          'varying vec2 vUv;',
          'void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'
        ].join('\n'),
        fragmentShader:[
          'varying vec2 vUv;',
          'float blob(vec2 p,vec2 c,vec2 size){vec2 d=(p-c)/size;return exp(-dot(d,d));}',
          'void main(){',
          ' vec2 p=vUv;',
          ' vec3 deep=vec3(.026,.057,.101);',
          ' vec3 upper=vec3(.038,.077,.120);',
          ' vec3 lower=vec3(.067,.118,.153);',
          ' vec3 col=mix(deep,upper,smoothstep(.2,1.0,p.y));',
          ' col=mix(col,lower,.26*(1.0-smoothstep(.07,.55,p.y)));',
          ' col+=vec3(.055,.090,.111)*blob(p,vec2(.71,.33),vec2(.35,.48));',
          ' col+=vec3(.017,.043,.058)*blob(p,vec2(.45,.24),vec2(.35,.21));',
          ' float halo=blob(p,vec2(.73,.13),vec2(.29,.055));',
          ' col+=vec3(.028,.065,.088)*halo;',
          ' col*=.96-.035*length(p-vec2(.62,.5));',
          ' gl_FragColor=vec4(col,1.);',
          '}'
        ].join('\n')
      })
    );
    background.position.z=-10;
    background.renderOrder=-10;
    scene.add(background);

    // Custom 3-D volumetric ribbon: front/back/sides and end caps. The geometry
    // is NOT a transparent plane or a 2D sine-wave shader.
    function makeRibbonGeometry(controlPoints, opts) {
      const samples=opts.segments||186;
      const across=opts.across||24;
      const curve=new THREE.CatmullRomCurve3(
        controlPoints.map(p=>new THREE.Vector3(p[0],p[1],p[2])),
        false,'centripetal',.5
      );
      const verts=[],uvs=[],faces=[];
      const edgePaths=[[],[]];
      const crossAxis=new THREE.Vector3();
      const n=new THREE.Vector3();
      const center=new THREE.Vector3();
      const tangent=new THREE.Vector3();
      const side=new THREE.Vector3();
      const up=new THREE.Vector3(0,0,1);
      const tmp=new THREE.Vector3();
      const faceSize=(samples+1)*(across+1);

      function positionAt(u,v,sign) {
        const t=curve.getPointAt(u);
        tangent.copy(curve.getTangentAt(u)).normalize();
        crossAxis.crossVectors(tangent,up).normalize();
        if(crossAxis.lengthSq()<.001)crossAxis.set(1,0,0);
        n.crossVectors(tangent,crossAxis).normalize();
        const twist=opts.twistStart+(opts.twistEnd-opts.twistStart)*u+
          opts.twistWave*Math.sin(Math.PI*u*2+opts.phase);
        const ca=Math.cos(twist),sa=Math.sin(twist);
        side.copy(crossAxis).multiplyScalar(ca).addScaledVector(n,sa).normalize();
        n.crossVectors(tangent,side).normalize();
        const width=opts.width*(.80+.20*Math.sin(Math.PI*u));
        const bend=opts.bend*Math.sin(u*Math.PI*1.28+opts.phase)*Math.cos(v*Math.PI*.57);
        center.copy(t);
        center.addScaledVector(side,v*width*.5);
        center.addScaledVector(n,bend+sign*opts.thickness*.5);
        return center.clone();
      }
      for(let face=0;face<2;face++) {
        const sign=face===0?1:-1;
        for(let i=0;i<=samples;i++){
          const u=i/samples;
          for(let j=0;j<=across;j++){
            const v=j/across*2-1;
            const p=positionAt(u,v,sign);
            verts.push(p.x,p.y,p.z);
            uvs.push(u,j/across);
            if(face===0&&(j===0||j===across)){
              edgePaths[j===0?0:1].push(p.clone());
            }
          }
        }
      }
      function index(f,i,j){return f*faceSize+i*(across+1)+j;}
      for(let i=0;i<samples;i++){
        for(let j=0;j<across;j++){
          const a=index(0,i,j),b=index(0,i+1,j),c=index(0,i,j+1),d=index(0,i+1,j+1);
          faces.push(a,b,c,b,d,c);
          const e=index(1,i,j),f=index(1,i+1,j),g=index(1,i,j+1),h=index(1,i+1,j+1);
          faces.push(e,g,f,f,g,h);
        }
        // Glazing edge walls, bevel-like sides from the actual volume.
        for(const j of [0,across]){
          const a=index(0,i,j),b=index(0,i+1,j),c=index(1,i,j),d=index(1,i+1,j);
          if(j===0)faces.push(a,c,b,b,c,d);
          else faces.push(a,b,c,b,d,c);
        }
      }
      for(let j=0;j<across;j++){
        const a=index(0,0,j),b=index(0,0,j+1),c=index(1,0,j),d=index(1,0,j+1);
        faces.push(a,b,c,b,d,c);
        const e=index(0,samples,j),f=index(0,samples,j+1),g=index(1,samples,j),h=index(1,samples,j+1);
        faces.push(e,g,f,f,g,h);
      }
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
      geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
      geometry.setIndex(faces);
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      return {geometry,edgePaths};
    }

    const artwork=new THREE.Group();
    scene.add(artwork);

    const ribbonSpecs=[
      // Main loop: architecturally broad, softly folded but with hard optical edges.
      {
        points:[[8.8,4.9,-1.65],[6.4,3.5,-.9],[3.5,2.4,.25],[2.55,.55,.8],
                [4.65,-.75,1.20],[8.4,-1.7,.6],[10.4,-3.9,-.5]],
        width:2.42,thickness:.115,twistStart:-.75,twistEnd:1.08,twistWave:.22,phase:1.0,bend:.17,
        tint:0xd4ecf8,attenuation:0x6cb8d4,alpha:.93,edgeColor:0xb9dcf0,edgeOpacity:.29
      },
      // Vertical upper fin catches a narrow studio softbox.
      {
        points:[[10.2,5.8,-1.95],[7.7,4.5,-.65],[6.2,2.35,-.2],[6.05,.40,.48],
                [7.25,-1.70,.32],[9.85,-3.55,-1.0]],
        width:2.25,thickness:.085,twistStart:.95,twistEnd:-1.16,twistWave:.15,phase:2.9,bend:.13,
        tint:0xc5deed,attenuation:0x83bad1,alpha:.87,edgeColor:0xd1efff,edgeOpacity:.28
      },
      // Tightly rolled interior crossing; more compressed for visual tension.
      {
        points:[[3.8,-5.3,1.0],[5.1,-3.9,.75],[6.55,-1.7,1.25],[5.25,.8,1.55],
                [6.9,3.2,-.25],[9.5,5.55,-1.05]],
        width:1.28,thickness:.072,twistStart:-1.25,twistEnd:.8,twistWave:.23,phase:3.5,bend:.11,
        tint:0xe8f6ff,attenuation:0x89bfd5,alpha:.90,edgeColor:0xffe5c9,edgeOpacity:.22
      }
    ];
    const materials=[];
    ribbonSpecs.forEach((spec,idx)=>{
      const result=makeRibbonGeometry(spec.points,spec);
      const mat=new THREE.MeshPhysicalMaterial({
        color:spec.tint,
        transmission:spec.alpha,
        opacity:1,
        transparent:false,
        ior:1.48,
        thickness:idx===0?.67:.54,
        attenuationColor:new THREE.Color(spec.attenuation),
        attenuationDistance:3.4,
        roughness:idx===1?.083:.052,
        metalness:0,
        clearcoat:.76,
        clearcoatRoughness:.065,
        envMapIntensity:1.8,
        side:THREE.DoubleSide,
        depthWrite:true
      });
      materials.push(mat);
      const mesh=new THREE.Mesh(result.geometry,mat);
      mesh.renderOrder=idx+1;
      artwork.add(mesh);

      // Delicate physical edge catches; not neon or bloom.
      for(let edge=0;edge<2;edge++){
        const fine=new THREE.CatmullRomCurve3(result.edgePaths[edge],false,'centripetal',.5);
        const rim=new THREE.Mesh(
          new THREE.TubeGeometry(fine,148,idx===2?.008:.010,4,false),
          new THREE.MeshBasicMaterial({
            color:spec.edgeColor,transparent:true,opacity:spec.edgeOpacity,
            depthWrite:false,toneMapped:false
          })
        );
        rim.renderOrder=idx+7;
        artwork.add(rim);
      }
    });

    // Small soft studio strips make the physical refraction readable on navy.
    const lights=[
      [0xd9f3ff,6.5,5.0,8.0,4.5],
      [0xb4dfff,3.3,10.2,1.9,2.5],
      [0xffd7b4,2.4,2.8,-4.5,6.0],
      [0x7eaacb,2.0,1.5,5.0,-3.0]
    ];
    lights.forEach(([color,power,x,y,z])=>{
      const light=new THREE.PointLight(color,power,0,2);
      light.position.set(x,y,z);
      scene.add(light);
    });
    scene.add(new THREE.AmbientLight(0x6685a1,.13));

    let ready=false;
    let paintCount=0;
    function redraw(){
      if(disposed)return;
      const w=root.clientWidth||1280;
      const h=root.clientHeight||720;
      const aspect=w/h;
      // Keep artwork right-heavy and provide genuine negative space for text.
      let halfHeight=5.4;
      if(aspect<1.05)halfHeight=6.6;
      camera.left=-halfHeight*aspect;
      camera.right=halfHeight*aspect;
      camera.top=halfHeight;
      camera.bottom=-halfHeight;
      camera.updateProjectionMatrix();
      artwork.position.x=aspect<1.05?-3.5:aspect<1.4?-1.3:.25;
      artwork.position.y=aspect<1.05?-.55:0;
      background.scale.set(1,1,1);
      renderer.setSize(w,h,false);
      renderer.render(scene,camera);
      paintCount++;
      ready=true;
      document.documentElement.dataset.glassReady='true';
      if(status){
        status.textContent='Three.js / WebGL 静止フレーム描画済み';
        status.classList.remove('error');
      }
      if(perf)perf.textContent='1 frame · '+renderer.info.render.triangles.toLocaleString('ja-JP')+' triangles · '+(Math.round(w*renderer.getPixelRatio()))+' × '+Math.round(h*renderer.getPixelRatio());
    }

    // Static on purpose. Resize-only redraw, no animation loop or CPU timer.
    onResize=()=>{
      if(onResize.queued)return;
      onResize.queued=true;
      window.requestAnimationFrame(()=>{
        onResize.queued=false;
        if(!disposed)redraw();
      });
    };
    window.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('orientationchange',onResize,{passive:true});

    let contextLost=false;
    renderer.domElement.addEventListener('webglcontextlost',event=>{
      event.preventDefault();
      contextLost=true;
      document.documentElement.dataset.glassReady='error';
      if(status)status.textContent='WebGL接続が失われました';
    });
    renderer.domElement.addEventListener('webglcontextrestored',()=>{
      // Conservative: rebuilding the studio environment and shader programs.
      location.reload();
    });
    redraw();

    window.motionGlassStudy={
      type:'Three.js WebGL static scene',
      study:'optical-glass-001',
      approval:'pending',
      threeRevision:THREE.REVISION,
      get drawCount(){return paintCount;},
      get rendererInfo(){return renderer.info.render;},
      get contextLost(){return contextLost;},
      snapshot(){return renderer.domElement.toDataURL('image/png');}
    };
  } catch(error) {
    reportError(error && error.message ? error.message : error);
  }

  window.addEventListener('pagehide',()=>{
    disposed=true;
    if(onResize) {
      window.removeEventListener('resize',onResize);
      window.removeEventListener('orientationchange',onResize);
    }
    if(activeRenderer)activeRenderer.dispose();
  },{once:true});
})();
