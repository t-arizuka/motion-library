precision highp float;
uniform vec2 u_resolution;
varying vec2 v_uv;

// Original Motion Library shader: photographic atmospheric scattering study.
// No neon strokes, static bitmap, React Bits source, or post-process Bloom.
float hash21(vec2 p){
  p=fract(p*vec2(123.34,345.45));
  p+=dot(p,p+34.345);
  return fract(p.x*p.y);
}
float noise2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=.55;
  for(int i=0;i<4;i++){
    v+=a*noise2(p);
    p=p*2.01+vec2(7.13,-3.71);
    a*=.5;
  }
  return v;
}
float gauss(float x,float width){return exp(-2.5*pow(x/max(width,.001),2.0));}
float ellipse(vec2 p,vec2 c,vec2 r){
  vec2 d=(p-c)/r;
  return exp(-dot(d,d)*2.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float ar=u_resolution.x/u_resolution.y;
  float arClamped=min(ar,2.5);
  vec2 p=vec2(uv.x*arClamped,uv.y);
  vec2 source=vec2(arClamped*1.035,1.085);
  vec2 d=p-source;
  float radius=length(d);
  float a=atan(d.y,d.x);

  // Deep navy underpainting with true negative space on the left.
  vec3 col=vec3(.008,.025,.047);
  col+=vec3(.012,.028,.046)*smoothstep(.04,.92,uv.x);
  col+=vec3(.024,.062,.091)*ellipse(uv,vec2(.77,.47),vec2(.58,.70));
  col+=vec3(.015,.029,.047)*ellipse(uv,vec2(.66,.21),vec2(.43,.35));
  col*=1.0-.10*smoothstep(.25,0.0,uv.y);

  // Unequal optical-depth volumes; not a periodic ray/line pattern.
  float inFan=smoothstep(-3.06,-2.42,a)*(1.0-smoothstep(-1.06,-.63,a));
  float depth=exp(-.28*radius);
  float warp=(fbm(vec2(a*4.8,radius*.65))-0.55)*.092;
  float turbulent=fbm(vec2(a*12.6+1.7,radius*.70+7.1));
  float broad=gauss(a+2.09+warp,.63)*.78+
              gauss(a+1.82-warp,.40)*.40+
              gauss(a+2.36+warp*.55,.30)*.43;
  float filaments=0.0;
  for(int i=0;i<12;i++){
    float k=float(i);
    float seed=hash21(vec2(k*1.61+2.7,k*.69+7.9));
    float center=mix(-2.64,-1.43,seed);
    float w=mix(.020,.135,hash21(vec2(k*4.1,11.9)));
    float strength=mix(.12,.46,hash21(vec2(k*3.31,8.7)));
    float bending=warp*(.16+hash21(vec2(k,6.5))*.8);
    filaments+=gauss(a-center+bending,w)*strength;
  }
  float atmosphere=.65+.56*turbulent;
  float fanLight=inFan*depth*atmosphere*(.12+broad*.57+filaments*.29);
  fanLight*=smoothstep(.04,.27,radius);
  float distanceFromLeft=smoothstep(.22,.66,uv.x);
  fanLight*=mix(.18,1.0,distanceFromLeft);
  col+=vec3(.135,.188,.214)*fanLight;
  col+=vec3(.075,.11,.13)*fanLight*gauss(a+2.03,.57);

  // Off-canvas soft white daylight; no saturated blue neon source.
  float sourceHalo=ellipse(uv,vec2(1.10,1.13),vec2(.55,.82));
  float spill=ellipse(uv,vec2(1.08,1.02),vec2(.42,.54));
  float sourceCore=ellipse(uv,vec2(1.055,1.09),vec2(.19,.235));
  col+=vec3(.19,.23,.245)*sourceHalo*.78;
  col+=vec3(.13,.17,.20)*spill*.56;
  col+=vec3(.84,.88,.89)*sourceCore*1.12;

  // Broken low-level pools; not a geometric horizon or a floor texture.
  float groundBand=exp(-pow((uv.y-.097)/.034,2.0));
  float groundNoise=.66+.42*noise2(vec2(uv.x*18.0,uv.y*9.0));
  float pool=groundBand*(.44*ellipse(uv,vec2(.68,.11),vec2(.32,.16))+
                         .40*ellipse(uv,vec2(.87,.12),vec2(.25,.17)));
  col+=vec3(.087,.125,.14)*pool*groundNoise;
  float reflection=gauss(uv.y-(.075+.020*sin(uv.x*9.1)),.029)*
                   ellipse(uv,vec2(.75,.08),vec2(.33,.12));
  col+=vec3(.029,.051,.065)*reflection;

  float haze=fbm(vec2(uv.x*3.2+4.8,uv.y*2.7+2.9));
  col+=vec3(.012,.023,.029)*smoothstep(.45,.85,haze)*distanceFromLeft;
  col*=1.0-.05*length(uv-vec2(.72,.55));
  col+=(hash21(gl_FragCoord.xy)-.5)*.0032;
  col=max(col,vec3(0.0));
  col=pow(col,vec3(.91));
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}
