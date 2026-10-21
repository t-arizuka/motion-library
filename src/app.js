/** Visual engines are referenced, not vendored; see LICENSE_NOTES.md. */
const  ENGINE_URL='https://esm.sh/@paper-design/shaders@0.0.78?bundle';
const  TEMPLATES={
  mesh:{
    id:'mesh',title:'Mesh Gradient',subtitle:'柔らかな色が溶け合う背景',number:'01',fragment:'meshGradientFragmentShader',
    defaults:{colors:['#C3B6CE','#E2C3B8','#A4BAD0','#D6D0C6'],speed:0.35,strength:0.40,swirl:0.09,grainMixer:0.04,grainOverlay:0.06},
    advanced:[{key:'swirl',label:'渦の強さ',min:0,max:1,step:.01},{key:'grainMixer',label:'色の境界の粒子',min:0,max:.5,step:.01},{key:'grainOverlay',label:'表面の粒子感',min:0,max:.35,step:.01}],
    makeUniforms(lib,s){return {...sizing(),u_colors:s.colors.map(lib.getShaderColorFromString),u_colorsCount:4,u_distortion:s.strength,u_swirl:s.swirl,u_grainMixer:s.grainMixer,u_grainOverlay:s.grainOverlay};}
  },
  grain:{
    id:'grain',title:'Grain Gradient',subtitle:'繊細な粒子と穏やかな色の表情',number:'02',fragment:'grainGradientFragmentShader',
    defaults:{colors:['#C3B6CE','#E2C3B8','#A4BAD0','#D6D0C6'],colorBack:'#423B4C',speed:.35,strength:.45,softness:.75,noise:.23,shape:'corners'},
    advanced:[{key:'softness',label:'色のなめらかさ',min:.2,max:1,step:.01},{key:'noise',label:'粒子の強さ',min:0,max:.6,step:.01},{key:'shape',label:'広がり方',choices:[['corners','コーナー'],['blob','やわらかなかたまり'],['sphere','円形'],['wave','波状']]}],
    makeUniforms(lib,s,noiseTexture){return {...sizing(),u_colors:s.colors.map(lib.getShaderColorFromString),u_colorsCount:4,u_colorBack:lib.getShaderColorFromString(s.colorBack),u_intensity:s.strength,u_softness:s.softness,u_noise:s.noise,u_shape:lib.GrainGradientShapes[s.shape],u_noiseTexture:noiseTexture};}
  }
};
const COLOR_PRESETS={
  mesh:[
    {name:'オパール',colors:['#C3B6CE','#E2C3B8','#A4BAD0','#D6D0C6']},
    {name:'ミストブルー',colors:['#D3DDEA','#A9C5D4','#EEE8DC','#8EA5BD']},
    {name:'セージ',colors:['#C2D0C3','#E2E4CF','#A2B9AE','#DDC6AF']},
    {name:'テラコッタ',colors:['#D9A58C','#EFE0C7','#AC6E64','#C8B8B0']},
    {name:'ナイト',colors:['#29334B','#526988','#B8A3B7','#6A7F91']}
  ],
  grain:[
    {name:'スモーク',colors:['#C3B6CE','#E2C3B8','#A4BAD0','#D6D0C6'],colorBack:'#423B4C'},
    {name:'グレイシア',colors:['#E2ECEA','#ACC7C7','#A1B8D4','#E2D2C9'],colorBack:'#303F51'},
    {name:'フィルムローズ',colors:['#CDA8B9','#F1C5B6','#9D94B4','#C6CED2'],colorBack:'#493845'},
    {name:'アース',colors:['#C1B6A0','#DFCBAC','#98B3A2','#D0AF94'],colorBack:'#4D5045'},
    {name:'モノクロ',colors:['#F2F1EF','#ADB1B3','#565D65','#D8D9D6'],colorBack:'#24292F'}
  ]
};
const sizing=()=>({u_fit:1,u_scale:1,u_rotation:0,u_originX:.5,u_originY:.5,u_offsetX:0,u_offsetY:0,u_worldWidth:0,u_worldHeight:0});
const  deepCopy=x=>JSON.parse(JSON.stringify(x));
const  COLORS=/^#[0-9A-F]{6}$/i;
const  makeDefaultSettings=id=>deepCopy(TEMPLATES[id].defaults);



const numberRanges={speed:[0,1.8],strength:[0,1],swirl:[0,1],grainMixer:[0,.5],grainOverlay:[0,.35],softness:[.2,1],noise:[0,.6]};
function normalizeConfig(template,input){
  if(!Object.hasOwn(TEMPLATES,template)||!input||typeof input!=='object')throw Error('背景の設定に問題があります');
  const defaults=TEMPLATES[template].defaults;
  if(!Array.isArray(input.colors)||input.colors.length!==4||!input.colors.every(v=>typeof v==='string'&&COLORS.test(v)))throw Error('カラーは #RRGGBB 形式で指定してください');
  const settings={...defaults,colors:input.colors.map(x=>x.toUpperCase())};
  for(const key of Object.keys(defaults)){
    if(key==='colors')continue;
    const value=input[key];
    if(key==='colorBack'){if(!COLORS.test(value))throw Error('背景色が不正です');settings[key]=value.toUpperCase();}
    else if(key==='shape'){if(!['corners','blob','sphere','wave'].includes(value))throw Error('形状が不正です');settings[key]=value;}
    else{const range=numberRanges[key];if(typeof value!=='number'||!Number.isFinite(value)||!range||value<range[0]||value>range[1])throw Error(key+' が範囲外です');settings[key]=value;}
  }
  return {schemaVersion:1,template,settings};
}
function encodeConfig(template,input){
  const json=JSON.stringify(normalizeConfig(template,input));
  return btoa(json).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
function normalizePublishUrl(input){
  const value=String(input||'').trim();
  let url;
  try{url=new URL(value);}catch(e){throw Error('公開URLを入力してください（https://〜）');}
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('公開URLは https:// で始まり、? や # を含まないURLにしてください');
  if(['localhost','127.0.0.1'].includes(url.hostname))throw Error('WordPress用コードには公開されたHTTPSのURLが必要です');
  if(['github.com','raw.githubusercontent.com'].includes(url.hostname))throw Error('GitHubのリポジトリURLではなく、GitHub Pagesの公開URLを入力してください');
  url.pathname=url.pathname.replace(/\/(?:index|editor|open|edit)\.html$/i,'/');
  url.pathname=url.pathname.replace(/\/$/,'')+'/';
  return url;
}
function generateIframeEmbed(template,settings,publishUrl,mode='with-text'){
  const cfg=encodeConfig(template,settings);
  const base=normalizePublishUrl(publishUrl);
  const target=new URL('embed/v1/index.html',base);target.searchParams.set('data',cfg);
  const background=settings.colorBack||settings.colors[0];
  const frame=`<iframe title="Motion Library 背景" aria-hidden="true" tabindex="-1" loading="eager" src="${target.href.replaceAll('&','&amp;')}" style="position:absolute;inset:0;display:block;width:100%;height:100%;border:0;pointer-events:none;z-index:0" scrolling="no"></iframe>`;
  const wrapperStart=`<div class="motion-library-mv" style="position:relative;isolation:isolate;min-height:clamp(360px,70vh,760px);overflow:hidden;background:${background}">`;
  if(mode==='background')return wrapperStart+frame+'</div>';
  if(mode!=='with-text')throw Error('出力形式が不正です');
  // Text/buttons are normal WordPress HTML outside the iframe (and stay clickable).
  const overlay=`<div class="motion-library-mv-content" style="position:relative;z-index:1;min-height:clamp(360px,70vh,760px);box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:clamp(24px,7vw,110px);color:#fff;text-shadow:0 2px 24px #17233755"><h2 style="font-size:clamp(28px,4.2vw,64px);line-height:1.35;margin:0 0 18px">ここにキャッチコピーを入力</h2><p style="font-size:clamp(14px,1.2vw,18px);margin:0 0 30px">説明文をWordPress側で編集できます。</p><a href="/" style="display:inline-block;padding:14px 24px;background:#fff;color:#1e293b;text-decoration:none;border-radius:4px;text-shadow:none">詳しく見る →</a></div>`;
  // A single line helps Classic Editor avoid wpautop injecting unwanted tags.
  return wrapperStart+frame+overlay+'</div>';
}
function localPreviewUrl(template,settings){
  const u=new URL('embed-test.html',location.href);u.searchParams.set('data',encodeConfig(template,settings));return u.href;
}




const $=id=>document.getElementById(id);
const PAGE=document.body.dataset.page;
const KEY='motion-library-gallery-editor-003';
const limits={speed:[0,1.8],strength:[0,1],swirl:[0,1],grainMixer:[0,.5],grainOverlay:[0,.35],softness:[.2,1],noise:[0,.6]};
let lib=null,texture=null,currentMount=null,mountEpoch=0,paintFrame=0,noticeTimer=0;
const saved={};
function toast(msg){const box=$('toast');if(!box)return;box.textContent=msg;box.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>box.classList.remove('visible'),2600);}
function readSaved(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');for(const id of Object.keys(TEMPLATES)){if(raw[id])saved[id]=validate(id,raw[id]);}}catch(err){console.warn('保存済みデータの読み込み:',err);}}
function validate(id,raw){if(!raw||typeof raw!=='object'||!Array.isArray(raw.colors)||raw.colors.length!==4||!raw.colors.every(c=>COLORS.test(c)))throw Error('設定ファイルのカラーが不正です');
  const result=makeDefaultSettings(id);result.colors=raw.colors.map(c=>c.toUpperCase());
  for(const key of Object.keys(result)){if(key==='colors')continue;const x=raw[key];if(key==='colorBack'){if(!COLORS.test(x))throw Error('背景色の形式が不正です');result[key]=x.toUpperCase();continue;}if(key==='shape'){if(!['corners','blob','sphere','wave'].includes(x))throw Error('形状が不正です');result[key]=x;continue;}const range=limits[key];if(range && typeof x==='number'&&Number.isFinite(x))result[key]=Math.max(range[0],Math.min(range[1],x));}
  return result;
}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch(e){console.warn('自動保存が使用できません',e);}}
function canvasAvailable(){return !!document.createElement('canvas').getContext('webgl2');}
async function engine(){if(!canvasAvailable())throw Error('WebGL2を利用できません。ブラウザのグラフィック設定をご確認ください。');lib??=await import(ENGINE_URL);for(const key of ['ShaderMount','getShaderColorFromString','getShaderNoiseTexture','meshGradientFragmentShader','grainGradientFragmentShader','GrainGradientShapes']){if(!(key in lib))throw Error('描画エンジンの仕様が変更されました: '+key);}return lib;}
async function noise(){if(!texture){texture=lib.getShaderNoiseTexture();if(texture&&!texture.complete&&texture.decode)await texture.decode();}return texture;}
async function mountShader(id,host,settings,{live=false,downsample=false}={}){const source=lib[TEMPLATES[id].fragment];const tex=id==='grain'?await noise():null;const uniforms=TEMPLATES[id].makeUniforms(lib,settings,tex);const next=new lib.ShaderMount(host,source,uniforms,undefined,live?settings.speed:0,0,downsample?1:1.25,downsample?700000:1920*1080*2);return next;}
function reportError(host,error){console.error('[Motion Library]',error);const layer=host.closest('.preview-surface')?.querySelector('.surface-status');if(layer){layer.classList.add('is-error');layer.textContent=`描画を読み込めませんでした: ${error.message||error}`;}else{host.dataset.error=error.message||String(error);}}
function clearStatus(host){const el=host.closest('.preview-surface')?.querySelector('.surface-status');if(el)el.hidden=true;}
function fileName(){return PAGE==='gallery'?'open.html':'edit.html';}
async function startGallery(){readSaved();const galleries=[...document.querySelectorAll('[data-preview-id]')];try{await engine();const created=await Promise.allSettled(galleries.map(async surface=>{const id=surface.dataset.previewId,host=surface.querySelector('.shader-host');const mount=await mountShader(id,host,saved[id]||makeDefaultSettings(id),{downsample:true});clearStatus(host);return mount;}));const mounts=created.filter(x=>x.status==='fulfilled').map(x=>x.value);created.forEach((result,i)=>{if(result.status==='rejected')reportError(galleries[i].querySelector('.shader-host'),result.reason);});window.addEventListener('pagehide',()=>mounts.forEach(m=>m.dispose()));}catch(e){galleries.forEach(s=>reportError(s.querySelector('.shader-host'),e));}}
function selectedTemplate(){const search=new URLSearchParams(location.search).get('template');return Object.hasOwn(TEMPLATES,search)?search:'mesh';}
function createColorField({label,value,onChange}){const row=document.createElement('div');row.className='color-field';const text=document.createElement('label');text.className='color-name';text.textContent=label;const wrap=document.createElement('div');wrap.className='color-control';const chooser=document.createElement('input');chooser.type='color';chooser.value=value;chooser.setAttribute('aria-label',label+' をカラーピッカーで変更');const hex=document.createElement('input');hex.type='text';hex.className='hex-input';hex.inputMode='text';hex.maxLength=7;hex.value=value.toUpperCase();hex.setAttribute('aria-label',label+' のHEXカラー');hex.spellcheck=false;
  function apply(value){const cleaned=value.trim().toUpperCase();if(!COLORS.test(cleaned)){hex.classList.add('invalid');hex.setAttribute('aria-invalid','true');return;}hex.classList.remove('invalid');hex.removeAttribute('aria-invalid');chooser.value=cleaned;hex.value=cleaned;onChange(cleaned);}
  chooser.addEventListener('input',()=>apply(chooser.value));hex.addEventListener('input',()=>{if(COLORS.test(hex.value))apply(hex.value);else{hex.classList.add('invalid');hex.setAttribute('aria-invalid','true');}});hex.addEventListener('change',()=>{if(!COLORS.test(hex.value)){hex.value=chooser.value.toUpperCase();hex.classList.remove('invalid');hex.removeAttribute('aria-invalid');}else apply(hex.value);});wrap.append(chooser,hex);row.append(text,wrap);return row;}
function getEditorState(){return saved[editorId];}
let editorId=null,isPlaying=!matchMedia('(prefers-reduced-motion: reduce)').matches,device='desktop',showCopy=true;
function refreshShader(){if(!currentMount||!lib)return;cancelAnimationFrame(paintFrame);paintFrame=requestAnimationFrame(()=>{paintFrame=0;if(!currentMount)return;try{const s=getEditorState();currentMount.setUniforms(TEMPLATES[editorId].makeUniforms(lib,s,texture));currentMount.setSpeed(isPlaying?s.speed:0);}catch(e){reportError($('preview-canvas'),e);}});}
function mutate(cb){cb(getEditorState());persist();refreshShader();updatePresetSelection();}
function drawColors(){const group=$('color-controls');group.replaceChildren();getEditorState().colors.forEach((hex,index)=>group.append(createColorField({label:`カラー ${index+1}`,value:hex,onChange:hex=>mutate(s=>s.colors[index]=hex)})));if(editorId==='grain'){group.append(createColorField({label:'背景カラー',value:getEditorState().colorBack,onChange:hex=>mutate(s=>s.colorBack=hex)}));}updatePresetSelection();}
function updatePresetSelection(){
  const s=getEditorState();
  for(const button of document.querySelectorAll('.preset-option')){
    const preset=COLOR_PRESETS[editorId][Number(button.dataset.preset)];
    const selected=preset.colors.every((color,i)=>color===s.colors[i])&&(editorId!=='grain'||preset.colorBack===s.colorBack);
    button.classList.toggle('is-selected',selected);
    button.setAttribute('aria-pressed',String(selected));
  }
}
function buildPresets(){
  const root=$('preset-options');
  root.replaceChildren();
  COLOR_PRESETS[editorId].forEach((preset,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='preset-option';
    button.dataset.preset=String(index);
    button.setAttribute('aria-label',preset.name+' の配色を適用');
    button.setAttribute('aria-pressed','false');
    const swatch=document.createElement('span');
    swatch.className='preset-swatch';
    swatch.style.background=`linear-gradient(125deg,${preset.colors.join(',')})`;
    const name=document.createElement('span');
    name.className='preset-name';
    name.textContent=preset.name;
    button.append(swatch,name);
    button.addEventListener('click',()=>{
      mutate(s=>{
        s.colors=[...preset.colors];
        if(editorId==='grain')s.colorBack=preset.colorBack;
      });
      drawColors();
      toast(preset.name+' を適用しました');
    });
    root.append(button);
  });
  updatePresetSelection();
}
function buildAdvanced(){const root=$('advanced-settings');root.replaceChildren();for(const def of TEMPLATES[editorId].advanced){const line=document.createElement('div');line.className='advanced-line';const label=document.createElement('label');const id='field-'+def.key;label.htmlFor=id;label.textContent=def.label;line.append(label);if(def.choices){const select=document.createElement('select');select.id=id;for(const [val,caption] of def.choices){const option=new Option(caption,val);select.add(option);}select.value=getEditorState()[def.key];select.addEventListener('change',()=>mutate(s=>s[def.key]=select.value));line.append(select);}else{const out=document.createElement('output');out.textContent=getEditorState()[def.key].toFixed(2);const range=document.createElement('input');range.type='range';range.id=id;range.min=def.min;range.max=def.max;range.step=def.step;range.value=getEditorState()[def.key];range.addEventListener('input',()=>{out.textContent=Number(range.value).toFixed(2);mutate(s=>s[def.key]=Number(range.value));});line.append(out,range);}root.append(line);}}
function setupEditor(){readSaved();editorId=selectedTemplate();saved[editorId]??=makeDefaultSettings(editorId);$('editor-title').textContent=TEMPLATES[editorId].title;$('template-kicker').textContent=`BACKGROUND / ${TEMPLATES[editorId].number}`;const s=getEditorState();drawColors();buildAdvanced();buildPresets();$('speed').value=s.speed;$('speed-val').textContent=s.speed.toFixed(2);$('strength').value=s.strength;$('strength-val').textContent=s.strength.toFixed(2);
  $('speed').addEventListener('input',()=>{$('speed-val').textContent=Number($('speed').value).toFixed(2);mutate(s=>s.speed=Number($('speed').value));});$('strength').addEventListener('input',()=>{$('strength-val').textContent=Number($('strength').value).toFixed(2);mutate(s=>s.strength=Number($('strength').value));});
  function setDevice(next){device=next;$('preview-canvas').classList.toggle('mobile',device==='mobile');for(const button of document.querySelectorAll('[data-device]')){button.classList.toggle('active',button.dataset.device===device);button.setAttribute('aria-pressed',String(button.dataset.device===device));}}
  document.querySelectorAll('[data-device]').forEach(btn=>btn.addEventListener('click',()=>setDevice(btn.dataset.device)));
  $('show-text').addEventListener('change',()=>{$('preview-canvas').classList.toggle('hide-copy',!$('show-text').checked);showCopy=$('show-text').checked;});
  $('play').addEventListener('click',()=>{isPlaying=!isPlaying;$('play').textContent=isPlaying?'一時停止':'再生';currentMount?.setSpeed(isPlaying?getEditorState().speed:0);});$('play').textContent=isPlaying?'一時停止':'再生';
  $('reset').addEventListener('click',()=>{if(!confirm('このアニメーションの色と設定を初期値に戻しますか？'))return;saved[editorId]=makeDefaultSettings(editorId);persist();const val=getEditorState();drawColors();buildAdvanced();$('speed').value=val.speed;$('strength').value=val.strength;$('speed-val').textContent=val.speed.toFixed(2);$('strength-val').textContent=val.strength.toFixed(2);refreshShader();toast('初期設定に戻しました');});
  $('save').addEventListener('click',()=>{const file={schemaVersion:3,template:editorId,settings:deepCopy(getEditorState())};const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`motion-${editorId}-settings.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('設定を保存しました');});
  $('load').addEventListener('click',()=>$('load-file').click());$('load-file').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>64000)throw Error('ファイルが大きすぎます');const data=JSON.parse(await file.text());if(data.schemaVersion!==3||data.template!==editorId)throw Error('このアニメーション用の設定ファイルではありません');saved[editorId]=validate(editorId,data.settings);persist();drawColors();buildAdvanced();const s=getEditorState();$('speed').value=s.speed;$('strength').value=s.strength;$('speed-val').textContent=s.speed.toFixed(2);$('strength-val').textContent=s.strength.toFixed(2);refreshShader();toast('設定を読み込みました');}catch(err){toast(`読み込みエラー: ${err.message||err}`);}finally{e.target.value='';}});
  // No-plugin background iframe export. All copy and buttons remain in WordPress DOM.
  const embedDialog=$('embed-dialog');
  const publishUrl=$('publish-url');
  try{
    const stored=localStorage.getItem('ml-publish-base')||'';
    publishUrl.value=stored||(location.protocol==='https:'?new URL('.',location.href).href:'');
  }catch(e){}
  const localTest=()=>localPreviewUrl(editorId,deepCopy(getEditorState()));
  function refreshExport(){
    const mode=document.querySelector('input[name="export-mode"]:checked')?.value||'with-text';
    try{
      const code=generateIframeEmbed(editorId,deepCopy(getEditorState()),publishUrl.value,mode);
      $('embed-code').value=code;
      $('export-warning').textContent='このコードはクラシックエディタの「テキスト」タブに貼り付けます。文字・ボタンはiframeの外側にあるためWordPressで編集できます。';
      $('copy-embed').disabled=false;
      try{localStorage.setItem('ml-publish-base',normalizePublishUrl(publishUrl.value).href);}catch(e){}
    }catch(error){
      $('embed-code').value='';
      $('copy-embed').disabled=true;
      $('export-warning').textContent='公開URLが必要です。アプリ一式をGitHub Pages等へ公開し、そのフォルダURLを入力してください。ローカル表示テストは公開前でも利用できます。';
    }
  }
  $('export-wp').addEventListener('click',()=>{refreshExport();embedDialog.showModal();});
  publishUrl.addEventListener('input',refreshExport);
  document.querySelectorAll('input[name="export-mode"]').forEach(r=>r.addEventListener('change',refreshExport));
  $('close-embed').addEventListener('click',()=>embedDialog.close());
  embedDialog.addEventListener('click',e=>{if(e.target===embedDialog)embedDialog.close();});
  $('copy-embed').addEventListener('click',async()=>{
    const code=$('embed-code').value;
    if(!code)return;
    try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(code);toast('WordPress用HTMLをコピーしました');return;}}catch(e){}
    $('embed-code').focus();$('embed-code').select();
    if(document.execCommand('copy'))toast('WordPress用HTMLをコピーしました');
    else toast('Ctrl+Cでコピーしてください');
  });
  $('download-test').addEventListener('click',()=>{
    window.open(localTest(),'_blank','noopener');
    toast('重ね表示の確認ページを開きました');
  });
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(paintFrame);currentMount?.dispose();});
  startEditorRender();
}
async function startEditorRender(){const epoch=++mountEpoch,host=$('preview-canvas').querySelector('.shader-host');try{await engine();if(epoch!==mountEpoch)return;currentMount=await mountShader(editorId,host,getEditorState(),{live:isPlaying});if(epoch!==mountEpoch){currentMount.dispose();currentMount=null;return;}clearStatus(host);$('gpu-state').textContent='WebGL2';$('gpu-state').classList.add('ready');}catch(e){reportError(host,e);$('gpu-state').textContent='描画エラー';$('gpu-state').classList.add('error');}}
if(PAGE==='gallery')startGallery();if(PAGE==='editor')setupEditor();
Object.defineProperty(window,'motionLibraryState',{get(){return {page:PAGE,template:editorId,settings:editorId?deepCopy(getEditorState()):null,ready:!!currentMount,device,isPlaying};}});

