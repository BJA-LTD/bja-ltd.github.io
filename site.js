(function(){
  var KEY='og.lang', root=document.documentElement;
  function setLang(l){ root.lang=l; try{localStorage.setItem(KEY,l);}catch(_){}
    document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed', b.dataset.lang===l?'true':'false');}); }
  var saved=null; try{saved=localStorage.getItem(KEY);}catch(_){}
  setLang(saved || ((navigator.language||'').toLowerCase().indexOf('fr')===0 ? 'fr' : 'en'));
  document.querySelectorAll('.langs button').forEach(function(b){ b.addEventListener('click', function(){ setLang(b.dataset.lang); }); });

  document.querySelectorAll('.video button').forEach(function(b){ b.addEventListener('click', function(){
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.dataset.id)+'?autoplay=1&rel=0';
    f.title=b.getAttribute('aria-label')||'video'; f.allow='autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen=true;
    b.replaceWith(f); }); });

  // Cookie banner (only on pages with the Google tag): Accept/Decline updates Google Consent Mode, choice kept in this browser
  var CK='og.consent', banner=document.querySelector('.cookie');
  function track(o){ if(window.dataLayer) window.dataLayer.push(o); }
  if(banner && typeof window.gtag==='function'){
    var ck=null; try{ck=localStorage.getItem(CK);}catch(_){}
    if(ck!=='yes' && ck!=='no') banner.hidden=false;
    banner.querySelectorAll('button[data-consent]').forEach(function(b){ b.addEventListener('click', function(){
      var yes=b.dataset.consent==='yes', g=yes?'granted':'denied';
      try{localStorage.setItem(CK, yes?'yes':'no');}catch(_){}
      window.gtag('consent','update',{ad_storage:g, ad_user_data:g, ad_personalization:g, analytics_storage:g});
      window.gtag('set','ads_data_redaction',!yes);
      banner.hidden=true; }); });
    document.querySelectorAll('[data-cookie-settings]').forEach(function(b){ b.addEventListener('click', function(){ banner.hidden=false; }); });
  }
  // Conversion events for Google Tag Manager triggers: play_click (Google Play button), signup_ok / enquiry_ok (form sent)
  document.querySelectorAll('a[href^="https://play.google.com/"]').forEach(function(a){ a.addEventListener('click', function(){
    var m=/[?&]id=([^&]+)/.exec(a.href); track({event:'play_click', app_id:m?m[1]:''}); }); });

  var URL_=document.body.dataset.signup||'', MAIL=document.body.dataset.mail;
  function say(form, key, cls){ var m=form.querySelector('.msg'); m.className='msg '+cls;
    m.innerHTML=form.querySelector('template[data-k="'+key+'"]').innerHTML; }
  function mailto(subject, body){ location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body); }
  document.querySelectorAll('form[data-kind]').forEach(function(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var kind=form.dataset.kind, fd=new FormData(form), lang=root.lang==='fr'?'fr':'en';
      var data={ email:(fd.get('email')||'').trim(), consent:!!fd.get('consent'), website:fd.get('website')||'', lang:lang };
      if(kind==='signup'){ data.games=fd.getAll('games'); if(!data.games.length){ say(form,'games','err'); return; } }
      else { ['name','arrive','depart','guests','message'].forEach(function(k){ data[k]=(fd.get(k)||'').toString().trim(); }); data.guests=+data.guests||0; }
      if(!data.consent){ say(form,'consent','err'); return; }
      if(!URL_){
        if(kind==='signup') mailto('Early access', 'Please add '+data.email+' to the early-access testers of: '+data.games.join(', '));
        else mailto('Enquiry: '+data.name, data.message+'\n\n'+data.arrive+' > '+data.depart+', '+data.guests+' guests\n'+data.email);
        say(form,'mail','ok'); return;
      }
      var btn=form.querySelector('button[type=submit]'); btn.disabled=true;
      fetch(URL_+'/'+kind, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data) })
        .then(function(r){ if(r.ok){ form.reset(); say(form,'ok','ok'); track({event:kind+'_ok'}); } else say(form, r.status===429?'slow':(r.status===400?'check':'fail'), 'err'); })
        .catch(function(){ say(form,'fail','err'); })
        .then(function(){ btn.disabled=false; });
    });
  });
})();
