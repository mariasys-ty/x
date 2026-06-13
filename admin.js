/* ============================================
   XSTREAM SYSTEM MANAGEMENT - ADMIN.JS
   Merged: Xstream Database + Afro Gallero Dashboard
   ============================================ */

// === FIREBASE CONFIGURATION (Xstream) ===
firebase.initializeApp({
  apiKey: "AIzaSyCvrWHOHXmVmHkl451aQA6XFCWy7xA9jFw",
  authDomain: "xstream-9f21e.firebaseapp.com",
  projectId: "xstream-9f21e",
  storageBucket: "xstream-9f21e.firebasestorage.app",
  messagingSenderId: "179015046758",
  appId: "1:179015046758:web:e7da8143826b59b49e7fa7"
});

var auth = firebase.auth();
var db = firebase.database();

// === ADMIN CONFIGURATION ===
const ADMIN_UID = "XtfmZZ0n3xXEcAykk1GcMHc7rsw1";
let currentPath = '';
let maintenanceMode = false;

// === COUNTRY MAPPINGS (Afro Gallero) ===
var CC_MAP={US:"United States",CA:"Canada",MX:"Mexico",BR:"Brazil",AR:"Argentina",CO:"Colombia",PE:"Peru",CL:"Chile",VE:"Venezuela",GB:"United Kingdom",FR:"France",DE:"Germany",IT:"Italy",ES:"Spain",PT:"Portugal",NL:"Netherlands",BE:"Belgium",CH:"Switzerland",AT:"Austria",PL:"Poland",CZ:"Czechia",SE:"Sweden",NO:"Norway",DK:"Denmark",FI:"Finland",IE:"Ireland",RO:"Romania",HU:"Hungary",BG:"Bulgaria",HR:"Croatia",RS:"Serbia",SI:"Slovenia",SK:"Slovakia",LT:"Lithuania",LV:"Latvia",EE:"Estonia",GR:"Greece",TR:"Turkey",RU:"Russia",UA:"Ukraine",SA:"Saudi Arabia",AE:"UAE",IL:"Israel",JO:"Jordan",KW:"Kuwait",QA:"Qatar",PK:"Pakistan",IN:"India",BD:"Bangladesh",LK:"Sri Lanka",NP:"Nepal",CN:"China",JP:"Japan",KR:"South Korea",TH:"Thailand",VN:"Vietnam",ID:"Indonesia",PH:"Philippines",MY:"Malaysia",SG:"Singapore",NG:"Nigeria",ZA:"South Africa",KE:"Kenya",GH:"Ghana",ET:"Ethiopia",TZ:"Tanzania",EG:"Egypt",MA:"Morocco",TN:"Tunisia",DZ:"Algeria",SN:"Senegal",CI:"Ivory Coast",CM:"Cameroon",CD:"DR Congo",MG:"Madagascar",MU:"Mauritius",RW:"Rwanda",UG:"Uganda",ZM:"Zambia",ZW:"Zimbabwe",MW:"Malawi",MZ:"Mozambique",AO:"Angola",AU:"Australia",NZ:"New Zealand",unknown:"Unknown"};

var CCOORDS={US:[38,-97],CA:[56,-106],MX:[23,-102],BR:[-14,-51],AR:[-38,-63],CO:[4,-74],PE:[-9,-75],CL:[-35,-71],VE:[8,-66],GB:[54,-2],FR:[46,2],DE:[51,10],IT:[42,12],ES:[40,-4],PT:[39,-8],NL:[52,5],BE:[51,4],CH:[47,8],AT:[47,13],PL:[52,19],CZ:[50,14],SE:[62,15],NO:[62,10],DK:[56,10],FI:[64,26],IE:[53,-8],RO:[46,25],HU:[47,19],BG:[43,25],HR:[45,16],RS:[44,21],SI:[46,15],SK:[49,19],LT:[56,24],LV:[57,25],EE:[59,26],GR:[39,22],TR:[39,35],RU:[62,98],UA:[49,32],SA:[24,45],AE:[24,54],IL:[31,35],JO:[31,37],KW:[29,48],QA:[25,51],PK:[30,69],IN:[21,78],BD:[24,90],LK:[7,81],NP:[28,84],CN:[35,105],JP:[36,138],KR:[36,128],TH:[15,101],VN:[16,108],ID:[-2,118],PH:[13,122],MY:[4,110],SG:[1,104],NG:[10,8],ZA:[-29,25],KE:[0,38],GH:[7,-1],ET:[9,39],TZ:[-6,35],EG:[27,30],MA:[32,-5],TN:[34,9],DZ:[28,3],SN:[14,-14],CI:[8,-5],CM:[6,12],CD:[-4,22],MG:[-19,47],MU:[-20,57],RW:[-2,30],UG:[1,32],ZM:[-13,28],ZW:[-19,30],MW:[-13,34],MZ:[-18,36],AO:[-12,17],AU:[-25,134],NZ:[-41,174]};

var SRC_COLORS={direct:"#8E44AD",organic_search:"#27AE60",social:"#2980B9",referral:"#B8860B",paid_google:"#E67E22",paid_social:"#E67E22",email:"#C0392B",campaign:"#1ABC9C",paid_ads:"#E67E22",affiliate:"#9B59B6",influencer:"#E91E63"};
var SRC_LABELS={direct:"Direct",organic_search:"Organic Search",social:"Social",referral:"Referral",paid_google:"Paid Google",paid_social:"Paid Social",email:"Email",campaign:"Campaign",paid_ads:"Paid Ads",affiliate:"Affiliate",influencer:"Influencer"};

// === UTILITY FUNCTIONS ===
function fe(c){if(!c||c==="unknown") return "🌎";return c.toUpperCase().replace(/./g,function(ch){return String.fromCodePoint(127397+ch.charCodeAt())})}
function $(id){return document.getElementById(id)}
function esc(s){if(!s) return "";var d=document.createElement("div");d.textContent=String(s);return d.innerHTML}
function toast(m){var t=document.createElement("div");t.className="tst";t.innerHTML=`<span>${esc(m)}</span>`;$("tbox").appendChild(t);setTimeout(function(){t.classList.add("out");setTimeout(function(){t.remove()},250)},3000)}
function fd(d){return d.toISOString().split("T")[0]}
function fdp(k,r){if(r==="today") return "Today";var d=new Date(k+"T12:00:00");return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function fdur(s){if(!s||s<=0) return "—";var m=Math.floor(s/60),sc=Math.round(s%60);return m>0?m+"m "+sc+"s":sc+"s"}
function tAgo(ts){if(!ts) return "";var s=Math.floor((Date.now()-ts)/1000);if(s<60) return s+"s ago";if(s<3600) return Math.floor(s/60)+"m ago";if(s<86400) return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago"}
function rT(ts){if(!ts) return "—";var v=ts;if(typeof ts==="number"&&ts<1e12) v=ts*1000;if(typeof ts==="string") v=parseInt(ts,10);if(isNaN(v)) return "—";return new Date(v).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function rTime(ts){if(!ts) return "";var v=ts;if(typeof v==="number"&&v<1e12) v=v*1000;return new Date(v).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}

function isDk(){return document.body.dataset.theme==="dark"}
function gC(){return isDk()?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"}
function tC(){return isDk()?"#A8A49C":"#4A4A4A"}

var cF={family:"'DM Sans',system-ui,sans-serif",size:10};
function cO(h){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:!h,labels:{font:cF,boxWidth:10,padding:6,color:tC()}}},scales:{x:{ticks:{font:cF,maxRotation:45,color:tC()},grid:{display:false}},y:{ticks:{font:cF,color:tC()},grid:{color:gC()}}}}}
function dO(){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{font:cF,boxWidth:9,padding:6,color:tC(),usePointStyle:true,pointStyle:"circle"}}}}}
var ch={};function mk(id,cfg){if(ch[id]) ch[id].destroy();var el=$(id);if(!el) return null;ch[id]=new Chart(el,cfg);return ch[id]}

function srcClass(s){if(s.includes("organic")) return "src-organic";if(s.includes("social")||s.includes("paid_social")) return "src-social";if(s.includes("paid")||s.includes("google")&&s.includes("cpc")) return "src-paid";if(s.includes("email")) return "src-email";if(s.includes("referral")) return "src-referral";if(s.includes("campaign")||s.includes("influencer")||s.includes("affiliate")) return "src-campaign";return "src-direct"}
function pRow(ic,nm,val,tot,col){var p=tot>0?Math.round((val/tot)*100):0;return`<div class="dev-row"><div class="dev-ic"><i data-lucide="${ic}"></i></div><div class="dev-info"><div class="dev-nm">${esc(nm)}</div><div class="pbar" style="margin-top:2px"><div class="pbar-f" style="width:${p}%;background:${col||'var(--accent)'}"></div></div></div><div class="dev-pct">${val.toLocaleString()}</div></div>`}

// === THEME MANAGEMENT ===
(function(){var t=localStorage.getItem("adminTheme");if(t==="dark") document.body.dataset.theme="dark";uTI()})();
function tTm(){document.body.dataset.theme=isDk()?"":"dark";localStorage.setItem("adminTheme",isDk()?"dark":"light");uTI();rA()}
function uTI(){$("themeIcon").setAttribute("data-lucide",isDk()?"moon":"sun");lucide.createIcons()}
 $("themeBtn").addEventListener("click",tTm);
function rA(){var a=document.querySelector(".tp.active");if(!a) return;var id=a.id;if(id==="p-overview") rOv();else if(id==="p-analytics") rAn();else if(id==="p-health") rHt();else if(id==="p-security") rSec()}

// === AUTHENTICATION (Enhanced for both systems) ===
auth.onAuthStateChanged(function(u){
  if(u){
    $("loginS").classList.add("hidden");
    $("dashS").classList.remove("hidden");
    $("uEm").textContent=u.email;
    
    initDatabaseExplorer();
    iDsh();
  }else{
    $("dashS").classList.add("hidden");
    $("loginS").classList.remove("hidden");
  }
  lucide.createIcons()
});

// Login handler
 $("lB").addEventListener("click",function(){
  var e=$("lErr");
  e.classList.add("hidden");
  auth.signInWithEmailAndPassword($("lE").value.trim(),$("lP").value)
    .then(function(){toast("Signed in successfully!")})
    .catch(function(x){
      e.textContent=x.message;
      e.classList.remove("hidden")
    })
});

 $("lP").addEventListener("keydown",function(e){if(e.key==="Enter") $("lB").click()});
 $("loB").addEventListener("click",function(){
  auth.signOut().then(()=>location.reload())
});

// === TAB NAVIGATION ===
var tI={database:true};
document.querySelectorAll(".tab").forEach(function(t){
  t.addEventListener("click",function(){
    document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("active")});
    document.querySelectorAll(".tp").forEach(function(x){x.classList.remove("active")});
    t.classList.add("active");
    var tab=t.dataset.tab;
    $("p-"+tab).classList.add("active");
    
    if(tab==="overview"&&!tI.overview){tI.overview=true;lAn().then(rOv)}else if(tab==="overview") rOv();
    if(tab==="analytics"&&!tI.analytics){tI.analytics=true;lDp().then(rAn)}else if(tab==="analytics") rAn();
    if(tab==="health"&&!tI.health){tI.health=true;lHt().then(rHt)}else if(tab==="health") rHt();
    if(tab==="security"&&!tI.security){tI.security=true;lSec().then(rSec)}else if(tab==="security") rSec();
    if(tab==="users"&&!tI.users){tI.users=true;lUf().then(rUs)}
    lucide.createIcons()
  })
});

// Modal tab navigation
document.querySelectorAll(".mt").forEach(function(t){
  t.addEventListener("click",function(){
    document.querySelectorAll(".mt").forEach(function(x){x.classList.remove("active")});
    document.querySelectorAll(".mtp").forEach(function(x){x.classList.remove("active")});
    t.classList.add("active");
    $("mtp-"+t.dataset.mt).classList.add("active");
    lucide.createIcons()
  })
});

 $("mClose").addEventListener("click",cMo);
 $("userModal").addEventListener("click",function(e){if(e.target===$("userModal")) cMo()});
 
 // === SAFE FIREBASE CALL (Prevents infinite hanging) ===
function safeOnce(ref, timeout) {
  return new Promise(function(resolve) {
    var finished = false;
    var timer = setTimeout(function() {
      if (!finished) {
        finished = true;
        console.warn("Firebase call timed out, forcing continue...");
        resolve({ val: function() { return null; } });
      }
    }, timeout || 8000); // 8 second safety timeout
    
    ref.once("value").then(function(snap) {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve(snap);
      }
    }).catch(function(err) {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        console.error("Firebase error caught safely:", err.message);
        resolve({ val: function() { return null; } });
      }
    });
  });
}

// ============================================
// DATA STORES (Afro Gallero Analytics)
// ============================================
var dlD={},pgD=[],rcD=[],lvD={},usD={},rfD={},dvD={},bwD={},coD={},cvD={},sqD={},rfwD={};
var htD={},htL={},htS="—",htSv=0;
var awD={},umD={},cmU=null,cR="today";
var vfD={},aiD={},featD={},dashD={},segD={};
var trSrcD={},utmCombD={},utmSrcD={},utmMedD={},utmCampD={};
var engD={},devSubD={},gpuD={},ispD={};
var seoD={},exitD={},pathD={},formErrD={};
var heatSumD={},formSumD={};
var secBotD={},secSuspD=[],secCrawlD={},secFlagsD={},secAlertsD=[],secVpnD={};

var DC={Mobile:"#2980B9",Tablet:"#8E44AD",Desktop:"#27AE60"};
var BC={Chrome:"#4285F4",Firefox:"#FF7139",Safari:"#007AFF",Edge:"#0078D7",Opera:"#FF1B2D",Brave:"#F5A623",Vivaldi:"#EF5350",Other:"#8A8A7A"};

function gDK(){
  var k=[],n=new Date();
  if(cR==="today"){
    k.push(fd(n));
  }else{
    var d=cR==="7"?7:30;
    for(var i=d-1;i>=0;i--){
      var dd=new Date(n);
      dd.setDate(dd.getDate()-i);
      k.push(fd(dd))
    }
  }
  return k
}

// === DATA LOADING FUNCTIONS ===
function lAn(){
  return Promise.all([
    db.ref("analytics/daily").once("value"),
    db.ref("analytics/pages").once("value"),
    db.ref("analytics/recent").orderByChild("ts").limitToLast(100).once("value"),
    db.ref("analytics/referrers").once("value"),
    db.ref("analytics/devices").once("value"),
    db.ref("analytics/browsers").once("value"),
    db.ref("analytics/countries").once("value"),
    db.ref("analytics/countryVisitors").once("value"),
    db.ref("analytics/visitFrequency").once("value"),
    db.ref("analytics/ai").once("value"),
    db.ref("analytics/features").once("value"),
    db.ref("analytics/dashboard").once("value"),
    db.ref("analytics/traffic/sources").once("value")
  ]).then(function(s){
    dlD=s[0].val()||{};
    pgD=s[1].val()||{};
    var rv=s[2].val()||{};
    rcD=Object.values(rv).sort(function(a,b){return(b.ts||0)-(a.ts||0)});
    rfD=s[3].val()||{};
    dvD=s[4].val()||{};
    bwD=s[5].val()||{};
    coD=s[6].val()||{};
    cvD=s[7].val()||{};
    vfD=s[8].val()||{};
    var aiAll=s[9].val()||{};
    aiD=aiAll.interactions||{};
    segD=aiAll.segments||{};
    featD=s[10].val()||{};
    dashD=s[11].val()||{};
    trSrcD=s[12].val()||{};
  })
}

function lDp(){
  return Promise.all([
    db.ref("analytics/searches").once("value"),
    db.ref("analytics/routeFlows").once("value"),
    db.ref("analytics/journeys").orderByChild("ts").limitToLast(50).once("value")
  ]).then(function(s){
    sqD=s[0].val()||{};
    rfwD=s[1].val()||{};
    window._journD=Object.values(s[2].val()||{}).sort(function(a,b){return(b.ts||0)-(a.ts||0)})
  })
}

function lHt(){
  return Promise.all([
    db.ref("analytics/health").once("value"),
    db.ref("analytics/health/latest").once("value")
  ]).then(function(s){
    htD=s[0].val()||{};
    htL=s[1].val()||{};
    htSv=htD.score||0;
    htS=htD.status||"—"
  })
}

function lSec(){
  return Promise.all([
    db.ref("analytics/security/botScores").once("value"),
    db.ref("analytics/security/suspicious").once("value"),
    db.ref("analytics/security/crawlers").once("value"),
    db.ref("analytics/alerts").once("value")
  ]).then(function(s){
    secBotD=s[0].val()||{};
    var suspAll=s[1].val()||{};
    secSuspD=[];
    Object.values(suspAll).forEach(function(arr){
      if(Array.isArray(arr)) arr.forEach(function(v){secSuspD.push(v)});
      else secSuspD.push(arr)
    });
    secSuspD.sort(function(a,b){return(b.ts||0)-(a.ts||0)});
    secCrawlD=s[2].val()||{};
    var alertAll=s[3].val()||{};
    secAlertsD=[];
    Object.entries(alertAll).forEach(function(e){
      Object.values(e[1]).forEach(function(a){secAlertsD.push(a)})
    });
    secAlertsD.sort(function(a,b){return(b.ts||0)-(a.ts||0)});
  })
}

function lUb() {
  return Promise.all([
    safeOnce(db.ref("users")),
    safeOnce(db.ref("user_profiles"))
  ]).then(function(s) {
    var usersBase = s[0].val() || {};
    var profilesBase = s[1].val() || {};
    
    usD = Object.assign({}, usersBase);
    
    Object.entries(profilesBase).forEach(function(entry) {
      var profileKey = entry[0];
      var profileData = entry[1];
      
      if (profileData.uid && usD[profileData.uid]) {
        usD[profileData.uid] = Object.assign({}, usD[profileData.uid], profileData);
      } else {
        usD[profileKey] = profileData;
      }
    });
  });
}
      
      function lUf() {
        return lUb().then(function() {
          return Promise.all([
            safeOnce(db.ref("movies")),
            safeOnce(db.ref("messages"))
          ]).then(function(s) {
            awD = s[0].val() || {};
            umD = s[1].val() || {}
          })
        });
      }
      
     
function lLv(){db.ref("analytics/live").on("value",function(s){lvD=s.val()||{}})}

// === USER HELPERS ===
function eUI(uid){
  var r=usD[uid];
  if(!r) return null;
  return{
    uid:uid,
    raw:r,
    dn:r.displayName||r.name||r.fullName||r.username||r.firstName||r.lastName||"Unknown",
    fn:r.firstName||"",
    ln:r.lastName||"",
    em:r.email||"",
    ph:r.phone||r.phoneNumber||"",
    pu:r.photoURL||r.profilePhoto||r.avatar||r.image||"",
    bio:r.about||r.bio||r.briefBio||"",
    loc:r.location||r.city||"",
    ctry:r.country||"",
    spec:r.specialty||r.artSpecialty||r.medium||"",
    web:r.website||r.portfolioUrl||r.domainName||"",
    insta:r.instagram||r.insta||"",
    usr:r.username||"",
    jn:r.createdAt||"",
    fav:r.favorites?Object.keys(r.favorites):[],
    artN:r.artworks||r.works||null
  }
}

function gUA(uid){
  var a=[];
  Object.entries(awD).forEach(function(e){
    var id=e[0],v=e[1];
    if(v.uid===uid||v.userId===uid||v.artistId===uid)
      a.push(Object.assign({id:id},v))
  });
  var info=eUI(uid);
  if(info&&info.artN&&typeof info.artN==="object"){
    Object.entries(info.artN).forEach(function(e){
      var id=e[0],v=e[1];
      if(typeof v==="object"&&v!==null){
        v._un=true;
        a.push(Object.assign({id:id},v))
      }
    });
  }
  return a
}

// === MAP VISUALIZATION ===
function dMp(ci,ti,cd){
  var cv=$(ci),tp=$(ti);
  if(!cv) return;
  var wr=cv.parentElement,w=wr.clientWidth,h=Math.round(w*.48);
  cv.width=w*2;cv.height=h*2;
  cv.style.height=h+"px";
  var ctx=cv.getContext("2d");
  ctx.scale(2,2);
  var dk=isDk();
  ctx.fillStyle=dk?"#0D1B2A":"#EAF2F8";
  ctx.fillRect(0,0,w,h);
  
  var en=Object.entries(cd||{}).sort(function(a,b){return b[1]-a[1]}),mx=en.length?en[0][1]:1,tp2={};
  en.slice(0,3).forEach(function(e){tp2[e[0]]=1});
  
  var dots=[];
  en.forEach(function(e){
    var co=CCOORDS[e[0]];
    if(!co) return;
    var cx=(co[1]+180)/360*w,cy=(90-co[0])/180*h,r=Math.max(3,Math.min(16,3+(e[1]/mx)*13));
    dots.push({c:e[0],x:cx,y:cy,r:r,v:e[1],t:!!tp2[e[0]]})
  });
  
  dots.filter(function(d){return d.t}).forEach(function(d){
    var g=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*2.5);
    g.addColorStop(0,dk?"rgba(212,168,83,.2)":"rgba(184,134,11,.15)");
    g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.arc(d.x,d.y,d.r*2.5,0,Math.PI*2);
    ctx.fill()
  });
  
  dots.forEach(function(d){
    ctx.fillStyle=d.t?(dk?"#D4A853":"#B8860B"):(dk?"rgba(212,168,83,.6)":"rgba(184,134,11,.55)");
    ctx.beginPath();
    ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
    ctx.fill()
  });
  
  cv.onmousemove=function(e){
    var rc=cv.getBoundingClientRect(),mx=e.clientX-rc.left,my=e.clientY-rc.top,f=null;
    for(var i=0;i<dots.length;i++){
      var d=dots[i];
      if(Math.sqrt(Math.pow(mx-d.x,2)+Math.pow(my-d.y,2))<d.r+4){f=d;break}
    }
    if(f){
      tp.style.display="block";
      tp.style.left=(f.x+10)+"px";
      tp.style.top=(f.y-6)+"px";
      tp.textContent=fe(f.c)+" "+(CC_MAP[f.c]||f.c)+" — "+f.v.toLocaleString()
    }else tp.style.display="none"
  };
  cv.onmouseleave=function(){tp.style.display="none"}
}

// ============================================
// DATABASE EXPLORER FUNCTIONS (Xstream Original)
// ============================================

function initDatabaseExplorer(){
  loadRootNodes();
  setupMaintenanceListener();
  loadPath('/');
}

function loadRootNodes(){
  db.ref('/').once('value').then(function(snap){
    var data=snap.val()||{};
    var container=$('root-nodes');
    container.innerHTML='';
    
    Object.keys(data).forEach(function(key){
      var btn=document.createElement('button');
      btn.className='node-btn';
      btn.textContent=key;
      btn.onclick=function(){loadPath(key)};
      container.appendChild(btn);
    });
  }).catch(function(err){toast('Error loading nodes: '+err.message,'error')})
}

function loadPath(path){
  currentPath=path;
  $('current-path-badge').textContent='/'+path;
  
  document.querySelectorAll('.node-btn').forEach(function(btn){
    btn.classList.toggle('active',btn.textContent===path)
  });

  db.ref(path).once('value').then(function(snap){
    var data=snap.val();
    var editor=$('json-editor');
    try{
      editor.value=JSON.stringify(data,null,2)
    }catch(e){
      editor.value=String(data)
    }
  }).catch(function(err){toast(err.message,'error')})
}

function loadCustomPath(){
  var path=$('custom-path-input').value.trim();
  if(!path) return toast('Enter a path','error');
  loadPath(path)
}

function formatJson(){
  var editor=$('json-editor');
  try{
    var parsed=JSON.parse(editor.value);
    editor.value=JSON.stringify(parsed,null,2);
    toast('JSON Formatted')
  }catch(e){
    toast('Invalid JSON: '+e.message,'error')
  }
}

function saveNode(){
  if(!currentPath) return;
  var editor=$('json-editor');
  try{
    var parsedData=JSON.parse(editor.value);
    db.ref(currentPath).set(parsedData).then(function(){
      toast('Node saved successfully!');
      loadRootNodes()
    }).catch(function(err){toast(err.message,'error')})
  }catch(e){
    toast('Invalid JSON. Cannot save.','error')
  }
}

function deleteNode(){
  if(!currentPath||currentPath==='/') return toast('Cannot delete root node','error');
  if(confirm(`ARE YOU SURE YOU WANT TO DELETE /${currentPath}?\nThis cannot be undone.`)){
    db.ref(currentPath).remove().then(function(){
      toast('Node deleted');
      $('json-editor').value='null';
      loadRootNodes()
    }).catch(function(err){toast(err.message,'error')})
  }
}

// === MAINTENANCE MODE (Xstream) ===
function setupMaintenanceListener(){
  db.ref('maintenanceMode').on('value',function(snap){
    var mode=snap.val();
    maintenanceMode=mode&&mode.isActive===true;
    updateMaintenanceUI()
  })
}

function toggleMaintenance(){
  var newState=!maintenanceMode;
  db.ref('maintenanceMode').set({
    isActive:newState,
    updatedBy:auth.currentUser.uid,
    updatedAt:Date.now()
  }).then(function(){
    toast(newState?'Maintenance Mode TURNED ON':'Site is BACK ONLINE',newState?'error':'success')
  }).catch(function(err){toast(err.message,'error')})
}

function updateMaintenanceUI(){
  var toggle=$('maintenance-toggle');
  var dot=$('maintenance-dot');
  var label=$('maintenance-label');
  
  if(maintenanceMode){
    toggle.classList.add('active');
    dot.classList.add('offline');
    label.textContent='ACTIVE';
    label.style.color='var(--danger)'
  }else{
    toggle.classList.remove('active');
    dot.classList.remove('offline');
    label.textContent='ONLINE';
    label.style.color='var(--success)'
  }
}

// ============================================
// OVERVIEW TAB RENDERING
// ============================================
function rOv(){
  var ks=[],n=new Date();
  for(var i=6;i>=0;i--){var d=new Date(n);d.setDate(d.getDate()-i);ks.push(fd(d))}
  
  var tv=0,vi=0,cl=0,ss=0,dur=0,nw=0,tb=0;
  ks.forEach(function(k){var d=dlD[k]||{};tv+=(d.views||0);vi+=(d.visitors||0);cl+=(d.clicks||0);ss+=(d.sessions||0);dur+=(d.duration||0);nw+=(d.newVisitors||0);tb+=(d.bounces||0)});
  
  var br=ss>0?Math.round((tb/ss)*100):0,cc=Object.keys(coD).length;
  var seoSc=0,seoN=Object.keys(seoD).length;
  if(seoN>0){var sSum=0;Object.values(seoD).forEach(function(p){sSum+=(p.score||0)});seoSc=Math.round(sSum/seoN)}
  var trc=Object.keys(trSrcD).length;

  $('ovStats').innerHTML=
    `<div class="sc"><div class="sc-icon" style="background:var(--info-l);color:var(--info)"><i data-lucide="eye"></i></div><div class="sc-lbl">Views</div><div class="sc-val">${tv.toLocaleString()}</div><div class="sc-sub">7 days</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="users"></i></div><div class="sc-lbl">Visitors</div><div class="sc-val">${vi.toLocaleString()}</div><div class="sc-sub">unique</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="mouse-pointer-click"></i></div><div class="sc-lbl">Clicks</div><div class="sc-val">${cl.toLocaleString()}</div><div class="sc-sub">7 days</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--purple-l);color:var(--purple)"><i data-lucide="globe"></i></div><div class="sc-lbl">Countries</div><div class="sc-val">${cc}</div><div class="sc-sub">reached</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--warn-l);color:var(--warn)"><i data-lucide="target"></i></div><div class="sc-lbl">Bounce</div><div class="sc-val">${br}%</div><div class="sc-sub">7 day avg</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="radio"></i></div><div class="sc-lbl">Active</div><div class="sc-val">${Object.keys(lvD).length}</div><div class="sc-sub">now</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="route"></i></div><div class="sc-lbl">Sources</div><div class="sc-val">${trc}</div><div class="sc-sub">channels</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--info-l);color:var(--info)"><i data-lucide="search-code"></i></div><div class="sc-lbl">SEO</div><div class="sc-val">${seoSc}</div><div class="sc-sub">${seoN} pages</div></div>`;

  var vL=ks.map(function(k){return fdp(k,"7")});
  mk("ovViewsChart",{type:"bar",data:{labels:vL,datasets:[{label:"Views",data:ks.map(function(k){return(dlD[k]||{}).views||0}),backgroundColor:isDk()?"rgba(212,168,83,.65)":"rgba(184,134,11,.65)",borderRadius:3,barPercentage:.6}]},options:cO(true)});
  mk("ovVisChart",{type:"line",data:{labels:vL,datasets:[{label:"Visitors",data:ks.map(function(k){return(dlD[k]||{}).visitors||0}),borderColor:"#2980B9",backgroundColor:"rgba(41,128,185,.08)",fill:true,tension:.4,pointRadius:2,pointHoverRadius:4}]},options:cO()});
  
  var de=Object.entries(dvD).sort(function(a,b){return b[1]-a[1]});
  mk("ovDevChart",{type:"doughnut",data:{labels:de.map(function(e){return e[0]}),datasets:[{data:de.map(function(e){return e[1]}),backgroundColor:de.map(function(e){return DC[e[0]]||"#8A8A7A"}),borderWidth:0}]},options:dO()});
  
  var ce=Object.entries(coD).sort(function(a,b){return b[1]-a[1]}).slice(0,8);
  mk("ovCountryChart",{type:"doughnut",data:{labels:ce.map(function(e){return CC_MAP[e[0]]||e[0]}),datasets:[{data:ce.map(function(e){return e[1]}),backgroundColor:["#B8860B","#2980B9","#27AE60","#C0392B","#8E44AD","#F39C12","#1ABC9C","#E67E22"],borderWidth:0}]},options:dO()});
  
  dMp("ovMapCanvas","ovMapTip",coD);
  
  var srcE=Object.entries(trSrcD).sort(function(a,b){return b[1]-a[1]});
  mk("ovSrcChart",{type:"doughnut",data:{labels:srcE.map(function(e){return SRC_LABELS[e[0]]||e[0]}),datasets:[{data:srcE.map(function(e){return e[1]}),backgroundColor:srcE.map(function(e){return SRC_COLORS[e[0]]||"#8A8A7A"}),borderWidth:0}]},options:dO()});
  
  rFd("ovFeed",rcD.slice(0,25));

  var seoE=Object.entries(seoD).sort(function(a,b){return(b[1].score||0)-(a[1].score||0)}).slice(0,5);
  $('ovSEO').innerHTML=seoE.length?seoE.map(function(e){
    var p=e[0],d=e[1],sc=d.score||0,iss=d.issues?d.issues.filter(function(i){return i.type==="error"}).length:0;
    var bc=sc>=80?"badge-success":sc>=50?"badge-warn":"badge-danger";
    return`<div class="seo-sc"><div class="sc-v" style="color:${sc>=80?'var(--success)':sc>=50?'var(--warn)':'var(--danger)'}">${sc}</div><div class="sc-info"><div class="sc-nm">${esc(p)} ${iss?`<span class="badge badge-danger">${iss} err</span>`:''}</div><div class="sc-iss">${d.issues?d.issues.length:"0"} issues total</div></div></div>`
  }).join(""):`<div class="empty-s">No SEO data</div>`;
  
  lucide.createIcons()
}

function rFd(eid,data){
  var el=$(eid);
  if(!data.length){el.innerHTML=`<div class="empty-s">No activity</div>`;return}
  el.innerHTML=data.map(function(r){
    var a=tAgo(r.ts),t=r.type||"click";
    if(t==="view") return`<div class="fi"><div class="fd view"></div><div><div class="ft"><strong>Viewed</strong> ${esc(r.page)}${r.country?` <span style="color:var(--muted)">· ${fe(r.country)}</span>`:""}</div><div class="fm">${a}</div></div></div>`;
    if(t==="search"||t==="search_submit") return`<div class="fi"><div class="fd search"></div><div><div class="ft"><strong>Searched</strong> "${esc((r.query||"").substring(0,40))}"</div><div class="fm">${a}</div></div></div>`;
    if(t==="route_change") return`<div class="fi"><div class="fd route"></div><div><div class="ft"><strong>Navigated</strong> ${esc(r.from)} → ${esc(r.to)}</div><div class="fm">${a}</div></div></div>`;
    return`<div class="fi"><div class="fd click"></div><div><div class="ft"><strong>Clicked</strong> ${esc((r.label||"").substring(0,50))} on ${esc(r.page)}${r.country?` · ${fe(r.country)}`:""}</div><div class="fm">${a} · ${(r.dev||"")}</div></div></div>`
  }).join("")
}

// ============================================
// ANALYTICS TAB RENDERING
// ============================================
function agA(){
  var ks=gDK(),v=0,vi=0,cl=0,ss=0,dur=0,nw=0,bn=0,eng=0,st={},langs={},inpM={},dm=0,ab=0,rm=0;
  ks.forEach(function(k){
    var d=dlD[k]||{};
    v+=(d.views||0);vi+=(d.visitors||0);cl+=(d.clicks||0);ss+=(d.sessions||0);dur+=(d.duration||0);nw+=(d.newVisitors||0);bn+=(d.bounces||0);eng+=(d.engagement||0);
    if(d.scroll) Object.entries(d.scroll).forEach(function(e){st[e[0]]=(st[e[0]]||0)+e[1]});
    if(d.languages) Object.entries(d.languages).forEach(function(e){langs[e[0]]=(langs[e[0]]||0)+e[1]});
    if(d.inputMethods) Object.entries(d.inputMethods).forEach(function(e){inpM[e[0]]=(inpM[e[0]]||0)+e[1]});
    dm+=(d.darkModeUsers||0);ab+=(d.adBlockerUsers||0);rm+=(d.reducedMotionUsers||0)
  });
  return{v:v,vi:vi,cl:cl,ss:ss,ad:ss>0?Math.round(dur/ss):0,nw:nw,bn:bn,br:ss>0?Math.round((bn/ss)*100):0,ae:ks.length?Math.round(eng/ks.length):0,ks:ks,st:st,langs:langs,inpM:inpM,dm:dm,ab:ab,rm:rm}
}

function rAn(){
  var a=agA();
  $('aStats').innerHTML=
    `<div class="sc"><div class="sc-icon" style="background:var(--info-l);color:var(--info)"><i data-lucide="users"></i></div><div class="sc-lbl">Visitors</div><div class="sc-val">${a.vi.toLocaleString()}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="eye"></i></div><div class="sc-lbl">Views</div><div class="sc-val">${a.v.toLocaleString()}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="mouse-pointer-click"></i></div><div class="sc-lbl">Clicks</div><div class="sc-val">${a.cl.toLocaleString()}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--purple-l);color:var(--purple)"><i data-lucide="clock"></i></div><div class="sc-lbl">Avg Duration</div><div class="sc-val">${fdur(a.ad)}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--warn-l);color:var(--warn)"><i data-lucide="target"></i></div><div class="sc-lbl">Bounce</div><div class="sc-val">${a.br}%</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="zap"></i></div><div class="sc-lbl">Engagement</div><div class="sc-val">${a.ae}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="user-plus"></i></div><div class="sc-lbl">New</div><div class="sc-val">${a.nw.toLocaleString()}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="radio"></i></div><div class="sc-lbl">Active</div><div class="sc-val">${Object.keys(lvD).length}</div></div>`;

  var lb=a.ks.map(function(k){return fdp(k,cR)});
  mk("aViewsCh",{type:"bar",data:{labels:lb,datasets:[
    {label:"Views",data:a.ks.map(function(k){return(dlD[k]||{}).views||0}),backgroundColor:isDk()?"rgba(212,168,83,.6)":"rgba(184,134,11,.6)",borderRadius:3,barPercentage:.55},
    {label:"Clicks",data:a.ks.map(function(k){return(dlD[k]||{}).clicks||0}),backgroundColor:"rgba(39,174,96,.6)",borderRadius:3,barPercentage:.55}
  ]},options:cO()});

  mk("aNrCh",{type:"doughnut",data:{labels:["New","Returning"],datasets:[{data:[Math.max(0,a.nw),Math.max(0,a.vi-a.nw)],backgroundColor:["#F39C12","#2980B9"],borderWidth:0}]},options:dO()});

  var sL=["25%","50%","75%","90%","100%"];
  mk("aScrollCh",{type:"bar",data:{labels:sL,datasets:[{label:"Visitors",data:sL.map(function(m){return a.st[m]||0}),backgroundColor:"rgba(142,68,173,.55)",borderRadius:3,barPercentage:.55}]},options:Object.assign({},cO(true),{indexAxis:"y"})});

  var eb={l:0,m:0,h:0};
  a.ks.forEach(function(k){var e=(dlD[k]||{}).engagement||0;if(e<30) eb.l++;else if(e<60) eb.m++;else eb.h++});
  mk("aEngCh",{type:"doughnut",data:{labels:["Low","Medium","High"],datasets:[{data:[eb.l,eb.m,eb.h],backgroundColor:["#C0392B","#F39C12","#27AE60"],borderWidth:0}]},options:dO()});

  // Traffic Sources
  var srcE=Object.entries(trSrcD).sort(function(a,b){return b[1]-a[1]});
  var srcT=srcE.reduce(function(s,e){return s+e[1]},0)||1;
  $('aSrc').innerHTML=srcE.length?srcE.map(function(e){
    var n=SRC_LABELS[e[0]]||e[0],c=e[1],p=Math.round((c/srcT)*100);
    return`<div class="dev-row"><div class="dev-ic"><span class="src-badge ${srcClass(e[0])}" style="padding:0 6px;font-size:.6rem;border:none">${n.substring(0,2).toUpperCase()}</span></div><div class="dev-info"><div class="dev-nm">${esc(n)}</div><div class="pbar" style="margin-top:2px"><div class="pbar-f" style="width:${p}%;background:${SRC_COLORS[e[0]]||'var(--accent)'}"></div></div></div><div class="dev-pct">${p}%</div></div>`
  }).join(""):`<div class="empty-s">No traffic data</div>`;

  // Searches & Routes
  var se=Object.entries(sqD).sort(function(a,b){return b[1]-a[1]}).slice(0,15);
  $('aSearch').innerHTML=se.length?`<table class="dt"><thead><tr><th>Query</th><th>Count</th></tr></thead><tbody>${se.map(function(e){return`<tr><td>${esc(e[0])}</td><td class="num">${e[1]}</td></tr>`}).join("")}</tbody></table>`:`<div class="empty-s">No searches</div>`;
  
  var re=Object.entries(rfwD).sort(function(a,b){return b[1]-a[1]}).slice(0,15);
  $('aRoutes').innerHTML=re.length?`<table class="dt"><thead><tr><th>From</th><th>To</th><th>Count</th></tr></thead><tbody>${re.map(function(e){var p=e[0].split(" → ");return`<tr><td>${esc(p[0]||"?")}</td><td>${esc(p[1]||"?")}</td><td class="num">${e[1]}</td></tr>`}).join("")}</tbody></table>`:`<div class="empty-s">No routes</div>`;

  // Browsers & Devices
  var be=Object.entries(bwD).sort(function(a,b){return b[1]-a[1]}),bt=be.reduce(function(s,e){return s+e[1]},0)||1;
  $('aBrw').innerHTML=be.map(function(e){return pRow("globe",e[0],e[1],bt,BC[e[0]]||"#8A8A7A")}).join("")||`<div class="empty-s">No data</div>`;

  var dsE=Object.entries(devSubD).sort(function(a,b){return b[1]-a[1]}),dsT=dsE.reduce(function(s,e){return s+e[1]},0)||1;
  $('aDevSub').innerHTML=dsE.length?dsE.map(function(e){return pRow("monitor",e[0],e[1],dsT,"var(--purple)")}).join(""):`<div class="empty-s">No data</div>`;

  $('aUpd').textContent="Updated "+new Date().toLocaleTimeString();
  lucide.createIcons()
}

// Range buttons
document.querySelectorAll(".rb").forEach(function(b){
  b.addEventListener("click",function(){
    document.querySelectorAll(".rb").forEach(function(x){x.classList.remove("active")});
    b.classList.add("active");
    cR=b.dataset.range;
    rAn()
  })
});

// Delete analytics
 $('clrA').addEventListener("click",function(){
  if(!confirm("Delete ALL analytics data? This cannot be undone.")) return;
  var btn=this;
  btn.disabled=true;
  btn.innerHTML='<div class="spin-r spin" style="width:11px;height:11px;border-width:1px;display:inline-block"></div> Deleting...';
  db.ref("analytics").remove().then(function(){
    toast("All analytics deleted");
    dlD={};pgD={};rcD=[];rfD={};dvD={};bwD={};coD={};sqD={};rfwD={};vfD={};aiD={};featD={};dashD={};trSrcD={};
    rOv();rAn();
    btn.disabled=false;
    btn.innerHTML='<i data-lucide="trash-2"></i> Delete All';
    lucide.createIcons()
  }).catch(function(){
    toast("Error deleting");
    btn.disabled=false;
    btn.innerHTML='<i data-lucide="trash-2"></i> Delete All';
    lucide.createIcons()
  })
});

// ============================================
// HEALTH TAB RENDERING
// ============================================
function cwvC(m,v){
  if(m==="lcp") return v<=2500?"good":v<=4000?"needs-improve":"poor";
  if(m==="cls") return v<=100?"good":v<=250?"needs-improve":"poor";
  if(m==="inp") return v<=200?"good":v<=500?"needs-improve":"poor";
  if(m==="fcp") return v<=1800?"good":v<=3000?"needs-improve":"poor";
  if(m==="ttfb") return v<=800?"good":v<=1800?"needs-improve":"poor";
  return "good"
}
function cwvL(c){return c==="good"?"Good":c==="needs-improve"?"Needs Improve":"Poor"}

function rHt(){
  var sc=htSv,st=htS,circ=2*Math.PI*36,off=circ-(sc/100)*circ,scC=st==="healthy"?"var(--success)":st==="degraded"?"var(--warn)":"var(--danger)";
  
  $('hScore').innerHTML=`<div class="hs-c"><svg viewBox="0 0 90 90"><circle class="bg-r" cx="45" cy="45" r="36"/><circle class="fg-r" cx="45" cy="45" r="36" stroke="${scC}" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg><div class="hs-v" style="color:${scC}">${sc}</div></div><div class="hs-i"><h3>Health Score</h3><p>${st==="healthy"?"All systems OK":st==="degraded"?"Some issues detected":"Critical issues"}</p><div class="hs-b ${st}">${st}</div></div>`;

  var m=htL;
  var cw=[{l:"LCP",v:m.lcp,u:"ms",m:"lcp"},{l:"CLS",v:m.cls!==undefined?(m.cls/1000).toFixed(3):null,u:"",m:"cls"},{l:"INP",v:m.inp,u:"ms",m:"inp"},{l:"FCP",v:m.fcp,u:"ms",m:"fcp"},{l:"TTFB",v:m.ttfb,u:"ms",m:"ttfb"}];
  $('hCWV').innerHTML=cw.map(function(c){
    if(c.v===null||c.v===undefined) return`<div class="cwv"><div class="cwv-l">${c.l}</div><div class="cwv-val" style="color:var(--muted)">—</div></div>`;
    var v=parseFloat(c.v),cls=cwvC(c.m,v);
    return`<div class="cwv"><div class="cwv-l">${c.l}</div><div class="cwv-val">${v}${c.u?" "+c.u:""}</div><span class="cwv-t ${cls}">${cwvL(cls)}</span></div>`
  }).join("");

  $('hPerf').innerHTML=
    `<div class="sc"><div class="sc-icon" style="background:var(--info-l);color:var(--info)"><i data-lucide="timer"></i></div><div class="sc-lbl">Load</div><div class="sc-val">${m.loadTime?m.loadTime+"ms":"—"}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="code"></i></div><div class="sc-lbl">DOM Ready</div><div class="sc-val">${m.domReady?m.domReady+"ms":"—"}</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--danger-l);color:var(--danger)"><i data-lucide="bug"></i></div><div class="sc-lbl">Errors</div><div class="sc-val">${m.errors||0}</div></div>`;

  var td=fd(new Date()),hD=htD[td]||{};
  var eD=hD.errorDetails?Object.values(hD.errorDetails).sort(function(a,b){return(b.ts||0)-(a.ts||0)}):[];
  $('hErrCnt').textContent=eD.length?"("+eD.length+")":"";
  $('hErrLog').innerHTML=eD.length?eD.map(function(e){return`<div class="ei"><div class="em">${esc((e.msg||"").substring(0,200))}</div><div class="ed">${esc(e.file||"")}:${e.line||""}:${e.col||""} · ${tAgo(e.ts)}</div></div>`}).join(""):`<div class="empty-s">No JS errors</div>`;

  var rD=hD.resourceErrorDetails?Object.values(hD.resourceErrorDetails).sort(function(a,b){return(b.ts||0)-(a.ts||0)}):[];
  $('hResErrCnt').textContent=rD.length?"("+rD.length+")":"";
  $('hResErrLog').innerHTML=rD.length?rD.map(function(e){return`<div class="ei"><div class="em">${esc((e.src||"").substring(0,250))}</div><div class="ed">${esc(e.tag||"")} · ${tAgo(e.ts)}</div></div>`}).join(""):`<div class="empty-s">No resource errors</div>`;

  lucide.createIcons()
}

 $('clrH').addEventListener("click",function(){
  if(!confirm("Clear all health data?")) return;
  var btn=this;
  btn.disabled=true;
  btn.innerHTML='<div class="spin-r spin" style="width:11px;height:11px;border-width:1px;display:inline-block"></div> Clearing...';
  db.ref("analytics/health").remove().then(function(){
    toast("Health data cleared");
    htD={};htL={};htSv=0;rHt();
    btn.disabled=false;
    btn.innerHTML='<i data-lucide="trash-2"></i> Clear';
    lucide.createIcons()
  }).catch(function(){
    toast("Error");
    btn.disabled=false;
    btn.innerHTML='<i data-lucide="trash-2"></i> Clear';
    lucide.createIcons()
  })
});

// ============================================
// SECURITY TAB RENDERING
// ============================================
function rSec(){
  var totalBots=Object.keys(secBotD).length;
  var highBots=0,medBots=0,lowBots=0;
  Object.values(secBotD).forEach(function(b){var s=b.score||0;if(s>=50) highBots++;else if(s>=20) medBots++;else lowBots++});
  var suspCount=secSuspD.length;
  var crawlCount=Object.keys(secCrawlD).length;
  var alertCount=secAlertsD.length;

  $('secStats').innerHTML=
    `<div class="sc"><div class="sc-icon" style="background:var(--danger-l);color:var(--danger)"><i data-lucide="bot"></i></div><div class="sc-lbl">Flagged Bots</div><div class="sc-val">${highBots}</div><div class="sc-sub">score ≥ 50</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--warn-l);color:var(--warn)"><i data-lucide="alert-triangle"></i></div><div class="sc-lbl">Suspicious</div><div class="sc-val">${suspCount}</div><div class="sc-sub">visitors</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--info-l);color:var(--info)"><i data-lucide="spider"></i></div><div class="sc-lbl">Crawlers</div><div class="sc-val">${crawlCount}</div><div class="sc-sub">detected</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--accent-l);color:var(--accent)"><i data-lucide="bell"></i></div><div class="sc-lbl">Alerts</div><div class="sc-val">${alertCount}</div><div class="sc-sub">total</div></div>`+
    `<div class="sc"><div class="sc-icon" style="background:var(--success-l);color:var(--success)"><i data-lucide="users"></i></div><div class="sc-lbl">Scored</div><div class="sc-val">${totalBots}</div><div class="sc-sub">total scans</div></div>`;

  mk("secBotCh",{type:"bar",data:{labels:["Low (0-19)","Medium (20-49)","High (50+)"],datasets:[{label:"Visitors",data:[lowBots,medBots,highBots],backgroundColor:["rgba(39,174,96,.6)","rgba(243,156,18,.6)","rgba(192,57,43,.6)"],borderRadius:3,barPercentage:.5}]},options:cO(true)});

  $('secSusp').innerHTML=secSuspD.length?`<table class="dt"><thead><tr><th>Score</th><th>Flags</th><th>Country</th><th>Time</th></tr></thead><tbody>${secSuspD.slice(0,20).map(function(s){var flags=s.flags?Object.keys(s.flags).join(", "):"";var sc=s.score||0;var bc=sc>=50?"badge-danger":sc>=20?"badge-warn":"badge-info";return`<tr><td><span class="badge ${bc}">${sc}</span></td><td style="font-size:.68rem;font-family:monospace;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(flags)}</td><td>${fe(s.country||"")} ${esc(CC_MAP[s.country]||s.country||"?")}</td><td style="font-size:.72rem;color:var(--muted)">${tAgo(s.ts)}</td></tr>`}).join("")}</tbody></table>`:`<div class="empty-s">No suspicious visitors</div>`;

  $('secAlerts').innerHTML=secAlertsD.length?secAlertsD.slice(0,30).map(function(a){var sev=a.severity||"info";var fc=sev==="critical"?"var(--danger)":sev==="error"?"var(--danger)":sev==="warning"?"var(--warn)":"var(--info)";return`<div class="fi"><div class="fd" style="background:${fc}"></div><div><div class="ft"><strong style="color:${fc}">${esc(sev.toUpperCase())}</strong> ${esc((a.type||"").replace(/_/g," "))}</div><div class="ft" style="font-size:.72rem;margin-top:1px">${esc((a.message||"").substring(0,120))}</div><div class="fm">${tAgo(a.ts)}${a.page?" · "+esc(a.page):""}</div></div></div>`}).join(""):`<div class="empty-s">No alerts recorded</div>`;

  lucide.createIcons()
}

// ============================================
// USER MANAGEMENT
// ============================================
function oMo(uid){
  cmU=uid;
  var info=eUI(uid);
  if(!info){toast("User not found");return}
  
  var ini=info.dn.split(" ").map(function(w){return w[0]}).join("").substring(0,2).toUpperCase();
  if(info.pu){
    $('mAv').innerHTML=`<img src="${esc(info.pu)}" alt="" onerror="this.parentElement.textContent='${ini}'">`
  }else{
    $('mAv').textContent=ini
  }
  
  $('mNm').textContent=info.dn+(info.usr?` (@${esc(info.usr)})`:"");
  $('mEm').textContent=info.em||"No email";
  $('mUid').innerHTML=`<i data-lucide="copy"></i> ${esc(uid)}`;
  $('mUid').dataset.copy=uid;

  var raw=info.raw,sk={artworks:1,works:1,gallery:1,favorites:1,profile:1,personalInfo:1,info:1,providerData:1,metadata:1};
  var nN={displayName:"Display Name",name:"Name",fullName:"Full Name",firstName:"First Name",lastName:"Last Name",email:"Email",emailAddress:"Email",phone:"Phone",phoneNumber:"Phone",about:"About",bio:"Bio",briefBio:"Bio",description:"Description",location:"Location",city:"City",country:"Country",specialty:"Specialty",artSpecialty:"Art Specialty",medium:"Medium",category:"Category",website:"Website",portfolioUrl:"Portfolio",domainName:"Domain",instagram:"Instagram",insta:"Instagram",username:"Username",photoURL:"Photo URL",profilePhoto:"Photo",avatar:"Avatar",createdAt:"Joined",created_at:"Joined",registeredAt:"Registered",joinedAt:"Joined",lastLogin:"Last Login",last_login:"Last Login",lastSeen:"Last Seen",provider:"Provider",signInMethod:"Sign In",gender:"Gender",dob:"Date of Birth",address:"Address",state:"State",language:"Language",currency:"Currency"};
  
  var fds=[];
  Object.keys(raw).forEach(function(k){
    if(sk[k]) return;
    var v=raw[k];
    if(v===null||v===undefined||v==="") return;
    if(typeof v==="object") return;
    var lb=nN[k]||k.replace(/([A-Z])/g," $1").replace(/^./,function(s){return s.toUpperCase()});
    var d=esc(String(v).substring(0,300));
    if(String(v).startsWith("http")) d=`<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v.length>40?v.substring(0,40)+"...":v)}</a>`;
    fds.push({l:lb,v:d})
  });

  $('mtp-profile').innerHTML=fds.length?`<div class="pf">${fds.map(function(f){return`<div class="pfi"><div class="pfl">${esc(f.l)}</div><div class="pfv">${f.v}</div></div>`}).join("")}</div>`:`<div class="empty-s">No profile fields</div>`;

  var arts=gUA(uid);
  if(arts.length){
    $('mtp-artworks').innerHTML=`<div class="ag">${arts.map(function(a){
      var img=a.imageUrl||a.image||a.photo||a.img||"";
      var ti=a.title||a.name||"Untitled";
      var pr=a.price?"$"+a.price:"";
      var md=a.medium||a.category||"";
      var src=a._un?"user node":"user";
      return`<div class="ac"><div class="aiw">${img?`<img src="${esc(img)}" alt="${esc(ti)}" loading="lazy" onerror="this.style.display='none'">`:'<div style="width:100%;height:100px;background:var(--bg-s);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.68rem">No image</div>'}<button class="adl" data-aid="${esc(a.id)}" data-src="${src}" title="Delete"><i data-lucide="x"></i></button></div><div class="aci"><div class="act">${esc(ti)}</div><div class="acm">${esc(md)}${pr?` · ${esc(pr)}`:""} <span style="color:var(--muted);font-size:.58rem">[${src}]</span></div></div></div>`
    }).join("")}</div>`;
    lucide.createIcons()
  }else{
    $('mtp-artworks').innerHTML=`<div class="empty-s">No artworks found</div>`
  }

  $('mtp-messages').innerHTML=`<div class="ml" id="mML"><div class="empty-s" style="padding:.4rem;font-size:.74rem">Loading...</div></div><div class="mxi"><input type="text" placeholder="Send a message..." id="mMI"><button class="btn btn-p btn-sm" id="mMS"><i data-lucide="send"></i></button></div>`;
  $('mMS').onclick=function(){
    var inp=$('mMI'),msg=inp.value.trim();
    if(!msg) return;
    $('mMS').disabled=true;
    db.ref("messages/"+uid).push({from:"admin",text:msg,ts:Date.now()}).then(function(){
      inp.value="";
      ldM(uid);
      toast("Sent");
      $('mMS').disabled=false
    }).catch(function(){
      toast("Error");
      $('mMS').disabled=false
    })
  };
  $('mMI').onkeydown=function(e){if(e.key==="Enter") $('mMS').click()};
  ldM(uid);

 $('mtp-raw').innerHTML=`<div style="margin-bottom:.4rem;font-size:.76rem;color:var(--muted)">Full JSON from <strong>/users/${uid}</strong> & <strong>/user_profiles/${uid}</strong></div><div class="rj">${esc(JSON.stringify(raw,null,2))}</div>`;

  $('userModal').classList.add("open");
  document.body.style.overflow="hidden";
  document.querySelectorAll(".mt").forEach(function(x){x.classList.remove("active")});
  document.querySelectorAll(".mtp").forEach(function(x){x.classList.remove("active")});
  document.querySelector('.mt[data-mt="profile"]').classList.add("active");
  $("mtp-profile").classList.add("active");
  lucide.createIcons()
}

function ldM(uid){
  var el=$('mML');
  if(!el) return;
  db.ref("messages/"+uid).orderByChild("ts").limitToLast(50).once("value").then(function(s){
    var d=s.val()||{},msgs=Object.values(d).sort(function(a,b){return(a.ts||0)-(b.ts||0)});
    if(!msgs.length){el.innerHTML=`<div class="empty-s" style="padding:.4rem;font-size:.74rem">No messages</div>`;return}
    el.innerHTML=msgs.map(function(m){return`<div class="mi ${m.from==="admin"?"admin":"user"}"><span class="mfr">${m.from==="admin"?"Admin":"User"}</span><span class="mtm">${rTime(m.ts)}</span><div class="mtx">${esc(m.text)}</div></div>`}).join("");
    el.scrollTop=el.scrollHeight
  }).catch(function(){el.innerHTML=`<div class="empty-s">Error</div>`})
}

function cMo(){$('userModal').classList.remove("open");document.body.style.overflow="";cmU=null}

// Universal click delegation
document.addEventListener("click",function(e){
  var copyTag=e.target.closest(".uid-tag[data-copy]");
  if(copyTag){
    navigator.clipboard.writeText(copyTag.dataset.copy).then(function(){toast("Copied!")}).catch(function(){});
    return
  }
  
  var artDel=e.target.closest(".adl");
  if(artDel&&!artDel.disabled){
    var aid=artDel.dataset.aid,src=artDel.dataset.src;
    if(!confirm("Delete artwork?")) return;
    artDel.disabled=true;
    artDel.innerHTML='<div class="spin-r spin" style="width:10px;height:10px;border-width:1px"></div>';
    var ref=src==="user node"?db.ref("user_information/"+cmU+"/artworks/"+aid):db.ref("artworks/"+aid);
    ref.remove().then(function(){toast("Deleted");oMo(cmU)}).catch(function(){toast("Error");artDel.disabled=false;artDel.innerHTML='<i data-lucide="x"></i>';lucide.createIcons()});
    return
  }
});

function dUsr(uid){
  if(!confirm("Delete user "+uid+"?\nRemoves:\n- /users/"+uid+"\n- /user_profiles/"+uid+"\n- Nested artworks\n- Messages")) return;
  var p=Object.keys(awD).length>0?Promise.resolve():db.ref("artworks").once("value").then(function(s){awD=s.val()||{}});
  p.then(function(){
    var ops=[
      db.ref("users/"+uid).remove(),
      db.ref("user_profiles/"+uid).remove()
    ];
    var arts=gUA(uid);
    arts.forEach(function(a){if(!a._un) ops.push(db.ref("artworks/"+a.id).remove())});
    ops.push(db.ref("messages/"+uid).remove());
    Promise.all(ops).then(function(){toast("Deleted");cMo();lUf().then(rUs)}).catch(function(){toast("Error")})
  })
}

 $('mDelUser').addEventListener("click",function(){if(cmU) dUsr(cmU)});

function rUs(){
  var el=$('uGrid');
  if(!el) return;
  
  // Force clear the "Loading..." text immediately
  el.innerHTML = ''; 
  
  var entries=Object.entries(usD);
  $('uCnt').textContent=entries.length+" user"+(entries.length!==1?"s":"");
  
  if(!entries.length){el.innerHTML=`<div class="empty-s" style="grid-column:1/-1">No users found in /users or /user_profiles</div>`;return}
  
  el.innerHTML=entries.map(function(e){
    var uid=e[0],info=eUI(uid);
    if(!info) return "";
    var ini=info.dn.split(" ").map(function(w){return w[0]}).join("").substring(0,2).toUpperCase();
    var arts=gUA(uid);
    var shortU=uid.length>14?uid.substring(0,14)+"...":uid;
    var avH=info.pu?`<div class="u-av"><img src="${esc(info.pu)}" alt="" onerror="this.parentElement.textContent='${ini}'">`:`<div class="u-av">${ini}</div>`;
    var loc=info.loc?`<i data-lucide="map-pin"></i> ${esc(info.loc)}`:"";
    
    return`<div class="u-card">${avH}<div class="u-info"><div class="u-nm">${esc(info.dn)}${info.usr?` <span style="color:var(--muted);font-weight:400;font-size:.74rem">@${esc(info.usr)}</span>`:""}</div><div class="u-em">${esc(info.em)}</div><div class="u-st"><strong>${arts.length}</strong> artworks</div><div class="u-meta">${info.jn?`<i data-lucide="calendar"></i> ${rT(info.jn)}`:""}${loc}</div><div class="u-meta"><span class="uid-tag" data-copy="${esc(uid)}" title="Copy UID"><i data-lucide="copy"></i> ${esc(shortU)}</span></div><div class="u-acts"><button class="btn btn-g btn-sm u-view" data-uid="${esc(uid)}"><i data-lucide="eye"></i> View</button><button class="btn btn-d btn-sm u-del" data-uid="${esc(uid)}"><i data-lucide="trash-2"></i></button></div></div></div>`
  }).join("");
  
  lucide.createIcons()
}

 $('uGrid').addEventListener("click",function(e){
  var viewBtn=e.target.closest(".u-view");
  if(viewBtn){oMo(viewBtn.dataset.uid);return}
  var delBtn=e.target.closest(".u-del");
  if(delBtn&&!delBtn.disabled){dUsr(delBtn.dataset.uid);return}
});

 $('refU').addEventListener("click",function(){lUf().then(rUs);toast("Refreshed")});

// ============================================
// MAINTENANCE SETTINGS (Afro Gallero Style)
// ============================================
db.ref("settings/maintenance").on("value",function(s){
  var on=s.val()===true;
  $('mTog').checked=on;
  $('mSt').className="st-ind "+(on?"on":"off");
  $('mStT').textContent=on?"Maintenance ON":"Site is Live"
});

db.ref("settings/maintenanceMessage").once("value").then(function(s){$('mMsg').value=s.val()||""});

function sM(v){
  return db.ref("settings/maintenance").set(v).then(function(){toast(v?"ON":"OFF")}).catch(function(){toast("Error")})
}

 $('mTog').addEventListener("change",function(){sM($('mTog').checked)});
 $('mOn').addEventListener("click",function(){sM(true)});
 $('mOff').addEventListener("click",function(){sM(false)});

 $('mSav').addEventListener("click",function(){
  var b=$('mSav');
  b.disabled=true;
  db.ref("settings/maintenanceMessage").set($('mMsg').value.trim()||null).then(function(){toast("Saved")}).catch(function(){toast("Error")}).finally(function(){b.disabled=false})
});

// ============================================
// INITIALIZATION
// ============================================
function iDsh(){
  lAn().then(function(){rOv();rAn()});
  lUb().then(function(){if(tI.users) lUf().then(rUs)});
  lLv();
  lucide.createIcons()
}

// Auto-refresh every 60 seconds
setInterval(function(){
  lAn().then(function(){rOv();if(tI.analytics) rAn()});
  if(tI.health) lHt().then(rHt);
  if(tI.security) lSec().then(rSec)
},60000);

// Initialize Lucide icons
lucide.createIcons();

console.log('✅ Xstream System Management initialized with full dashboard capabilities');