(function () {
  "use strict";
  var D = window.LR, $ = function (s, c) { return (c || document).querySelector(s); };
  var IMG = "assets/img/";
  var SITE = D.config.site.replace(/^https?:\/\//, "");

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sem(t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  var ICO = {
    seta: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mais: '<svg class="mais" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke-width="2"/><path d="M7 12.5l3.2 3.2L17.5 8"/></svg>'
  };

  /* ---------- vitória, confetes (canvas-confetti) e celebração ---------- */
  (function () {
    var cores = ["#0445AD", "#FCBD04", "#FFED00", "#029828", "#E60316", "#FFFFFF"];

    function dispararConfetes(intenso) {
      if (typeof window.confetti !== "function") return;
      var duracao = intenso ? 4500 : 2800;
      var fim = Date.now() + duracao;
      var ultimoQuadro = 0;
      (function quadro(agora) {
        if (!ultimoQuadro || agora - ultimoQuadro >= 45) {
          ultimoQuadro = agora;
          window.confetti({
            particleCount: intenso ? 4 : 3,
            angle: 270,
            spread: 110,
            startVelocity: 18,
            gravity: 0.58,
            drift: (Math.random() - 0.5) * 0.7,
            origin: { x: Math.random(), y: -0.05 },
            colors: cores,
            ticks: 420,
            scalar: 0.95
          });
        }
        if (Date.now() < fim) requestAnimationFrame(quadro);
      })(performance.now());
      if (intenso) {
        window.confetti({
          particleCount: 45,
          angle: 60,
          spread: 58,
          startVelocity: 46,
          gravity: 0.65,
          origin: { x: 0, y: 0.72 },
          colors: cores,
          ticks: 360,
          scalar: 0.95
        });
        window.confetti({
          particleCount: 45,
          angle: 120,
          spread: 58,
          startVelocity: 46,
          gravity: 0.65,
          origin: { x: 1, y: 0.72 },
          colors: cores,
          ticks: 360,
          scalar: 0.95
        });
      }
    }

    var frases = [
      "🎉 Ganhamos!! Leandro é Reitor Eleito do IFAM!",
      "🏆 Obrigado, comunidade do IFAM!",
      "🎊 Juntos para o IFAM ir mais longe!",
      "💚💛💙 Vitória construída por todos nós!"
    ];
    var cliques = 0;
    try { cliques = parseInt(localStorage.getItem("lr_vitoria_cliques"), 10) || 0; } catch (e) {}

    var placar = $("#vitoriaPlacar"), elCliques = $("#vitoriaCliques");
    function atualizaPlacar() {
      if (!placar || !elCliques) return;
      if (cliques > 0) {
        placar.hidden = false;
        elCliques.textContent = cliques.toLocaleString("pt-BR");
      }
    }
    atualizaPlacar();

    function comemorar() {
      dispararConfetes(true);
      cliques++;
      try { localStorage.setItem("lr_vitoria_cliques", String(cliques)); } catch (e) {}
      atualizaPlacar();
      toast(frases[(cliques - 1) % frases.length]);
    }

    var bComemorar = $("#btnComemorar");
    if (bComemorar) bComemorar.addEventListener("click", comemorar);

    // Link de comemoração no WhatsApp (api.whatsapp.com preserva emojis UTF-8 sem virar "?")
    var msgWpp = "🎉🏆 GANHAMOS!! Votação encerrada e Leandro Damasceno é o novo Reitor eleito do IFAM! Obrigado a toda a comunidade por fazer parte dessa vitória! 💚💛💙 Juntos para o IFAM ir mais longe: " + D.config.site;
    var urlWpp = "https://api.whatsapp.com/send?text=" + encodeURIComponent(msgWpp);
    var bWpp = $("#btnWppVitoria");
    if (bWpp) bWpp.href = urlWpp;

    // Fechar / reabrir tarja flutuante
    var flutuante = $("#vitoriaFloat"), btnMin = $("#vfMinimizar"), btnAbrir = $("#vfAbrir");
    if (btnMin && flutuante) {
      btnMin.addEventListener("click", function () {
        flutuante.classList.add("minimizado");
      });
    }
    if (btnAbrir && flutuante) {
      btnAbrir.addEventListener("click", function () {
        flutuante.classList.remove("minimizado");
      });
    }

    // Disparo inicial de confetes assim que canvas-confetti carregar
    var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduzido) {
      window.addEventListener("load", function () {
        setTimeout(function () { dispararConfetes(false); }, 350);
      });
    }
  })();

  /* ---------- segmentos ---------- */
  var segWrap = $("#segmentos");
  [["estudantes", "Sou estudante", "Alimentação, transporte, esporte e mais"],
   ["servidores", "Sou servidor", "Docentes e TAEs: carreira, jornada, saúde"],
   ["terceirizados", "Sou terceirizado", "Contratos, respeito, qualificação"]].forEach(function (s) {
    var seg = D.segmentos[s[0]];
    var b = el("button", { class: "seg revela", type: "button" },
      '<img src="' + IMG + seg.foto + '" alt="" loading="lazy">' +
      '<span class="tag">' + seg.p.length + ' propostas</span>' +
      '<span class="info"><span><h3>' + s[1] + '</h3><p>' + s[2] + '</p></span><span class="seta">' + ICO.seta + '</span></span>');
    b.onclick = function () { location.hash = "seg-" + s[0]; };
    segWrap.appendChild(b);
  });

  /* ---------- eixos ---------- */
  var eWrap = $("#eixos");
  D.eixos.forEach(function (e) {
    var b = el("button", { class: "eixo revela", type: "button" },
      '<img src="' + IMG + "eixo" + e.n + '.png" alt="" width="58" height="58" loading="lazy">' +
      "<small>EIXO " + e.n + "</small><h3>" + esc(e.titulo).replace("Internacionalização", "Internacio&shy;nalização") + '</h3><span class="qt">' + e.p.length + " propostas →</span>");
    b.onclick = function () { location.hash = "eixo-" + e.n; };
    eWrap.appendChild(b);
  });

  /* ---------- busca ---------- */
  var idx = [];
  D.eixos.forEach(function (e) { e.p.forEach(function (p, i) { idx.push({ h: "eixo-" + e.n + "-" + (i + 1), onde: "Eixo " + e.n, t: p[0], s: sem(p[0] + " " + p[1]) }); }); });
  Object.keys(D.segmentos).forEach(function (k) { var g = D.segmentos[k]; g.p.forEach(function (p, i) { idx.push({ h: "seg-" + k + "-" + (i + 1), onde: "Para " + g.nome.toLowerCase(), t: p[0], s: sem(p[0] + " " + p[1]) }); }); });
  var res = $("#resultados"), busca = $("#busca"), tBusca;
  busca.addEventListener("input", function () {
    clearTimeout(tBusca);
    tBusca = setTimeout(function () {
      var q = sem(busca.value.trim());
      if (q.length < 2) { res.classList.remove("on"); res.innerHTML = ""; return; }
      var termos = q.split(/\s+/);
      var achou = idx.filter(function (r) { return termos.every(function (t) { return r.s.indexOf(t) > -1; }); });
      res.innerHTML = achou.length ? "" : '<div class="vazio">Nada encontrado. Tente outra palavra.</div>';
      achou.slice(0, 12).forEach(function (r) {
        var b = el("button", { type: "button", role: "listitem" }, "<span>" + r.onde + "</span><b>" + esc(r.t) + "</b>");
        b.onclick = function () { location.hash = r.h; };
        res.appendChild(b);
      });
      res.classList.add("on");
    }, 160);
  });

  /* ---------- princípios carrossel ---------- */
  var tr = $("#trilho"), bPrev = $("#priPrev"), bNext = $("#priNext");
  var barra = $("#priBarra"), cont = $("#priContador");
  var totalPri = D.principios.length;

  D.principios.forEach(function (p, i) {
    tr.appendChild(el("article", { class: "pri" },
      '<div class="ck">' + ICO.check + "<b>" + String(i + 1).padStart(2, "0") + "</b></div><h3>" + esc(p[0]) + "</h3><p>" + esc(p[1]) + "</p>"
    ));
  });

  function passoCard() {
    var card = tr.querySelector(".pri");
    return card ? card.offsetWidth + 16 : 320;
  }

  function atualizaControles() {
    var maxScroll = tr.scrollWidth - tr.clientWidth;
    var sl = tr.scrollLeft;
    var step = passoCard();
    var idx = Math.min(totalPri - 1, Math.max(0, Math.round(sl / step)));
    var progresso = (idx + 1) / totalPri;
    if (barra) barra.style.width = Math.round(progresso * 100) + "%";
    if (cont) cont.textContent = String(idx + 1).padStart(2, "0") + " / " + String(totalPri).padStart(2, "0");
    if (bPrev) {
      var isStart = sl <= 10;
      bPrev.disabled = isStart;
      bPrev.style.opacity = isStart ? "0.3" : "1";
      bPrev.style.cursor = isStart ? "not-allowed" : "pointer";
    }
    if (bNext) {
      var isEnd = sl >= maxScroll - 10;
      bNext.disabled = isEnd;
      bNext.style.opacity = isEnd ? "0.3" : "1";
      bNext.style.cursor = isEnd ? "not-allowed" : "pointer";
    }
  }

  if (bPrev) {
    bPrev.onclick = function () {
      var step = passoCard();
      var currentIdx = Math.round(tr.scrollLeft / step);
      var targetIdx = Math.max(0, currentIdx - 1);
      var cards = tr.querySelectorAll(".pri");
      if (cards[targetIdx]) {
        cards[targetIdx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      } else {
        tr.scrollBy({ left: -step, behavior: "smooth" });
      }
    };
  }
  if (bNext) {
    bNext.onclick = function () {
      var step = passoCard();
      var currentIdx = Math.round(tr.scrollLeft / step);
      var targetIdx = Math.min(totalPri - 1, currentIdx + 1);
      var cards = tr.querySelectorAll(".pri");
      if (cards[targetIdx]) {
        cards[targetIdx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      } else {
        tr.scrollBy({ left: step, behavior: "smooth" });
      }
    };
  }

  tr.addEventListener("scroll", function () {
    requestAnimationFrame(atualizaControles);
  }, { passive: true });

  window.addEventListener("resize", function () {
    atualizaControles();
  });
  setTimeout(atualizaControles, 120);

  /* ---------- trajetória ---------- */
  var ln = $("#linha");
  D.trajetoria.forEach(function (m) {
    ln.appendChild(el("div", { class: "marco revela" },
      '<span class="pt"></span><span class="ano">' + m.ano + "</span>" + (m.lugar ? '<span class="lugar">' + m.lugar + "</span>" : "") +
      "<h3>" + esc(m.titulo) + "</h3><p>" + esc(m.texto) + "</p>" + (m.fotos ? '<div class="fotos">' + m.fotos.map(function (f) { return '<figure><img src="' + IMG + f[0] + '" alt="' + esc(f[1]) + '" loading="lazy"><figcaption>' + esc(f[1]) + "</figcaption></figure>"; }).join("") + "</div>" : "")));
  });

  /* ---------- participe ---------- */
  var L = D.config.links;
  $("#lkZap").href = L.whatsapp;
  $("#lkSug").href = L.sugestao;
  var temas = [
    ["Assistência estudantil", "O que faria você ou seus colegas estudarem com mais tranquilidade?"],
    ["Carreira e valorização", "O que faria você se sentir mais valorizado no IFAM?"],
    ["Infraestrutura", "O que mais precisa melhorar nas salas, laboratórios ou na internet do seu campus?"],
    ["Campi do interior", "O que o seu campus precisa para o IFAM chegar mais longe?"],
    ["Pesquisa e extensão", "Que projeto você gostaria de ver acontecendo no seu campus?"],
    ["Saúde e bem-estar", "O que cuidaria melhor das pessoas no dia a dia do IFAM?"],
    ["Outro tema", "Qual é a sua ideia? Conte do seu jeito."]
  ];
  var tWrap = $("#temas"), perg = $("#pergunta");
  temas.forEach(function (t) {
    var b = el("button", { type: "button", class: "tema", "aria-pressed": "false" }, esc(t[0]));
    b.onclick = function () {
      [].forEach.call(tWrap.children, function (x) { x.setAttribute("aria-pressed", x === b); });
      perg.textContent = t[1];
      $("#lkSug").textContent = "Enviar minha ideia →";
    };
    tWrap.appendChild(b);
  });
  var ICX = {
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    musica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    cv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4"/></svg>'
  };
  var exWrap = $("#extras");
  [["insta", "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", "Instagram", "@leandro.a.damasceno", L.instagram],
   ["musica", "#1DB954", "Playlist", "no Spotify", L.playlist],
   ["cv", "var(--navy)", "Currículo Lattes", L.lattes ? "Trajetória completa" : "Em breve", L.lattes],
   ["pdf", "var(--vermelho)", "Plano completo", "PDF para baixar", L.plano, true],
   ["share", "var(--azul)", "Compartilhe o site", "leandroreitor.com.br", null, false, true]].forEach(function (x) {
    var tag = x[6] ? "button" : "a";
    var e = el(tag, { class: "extra" }, '<span class="ic" style="background:' + x[1] + '">' + ICX[x[0]] + "</span><span>" + x[2] + "<small>" + x[3] + "</small></span>");
    if (x[6]) { e.type = "button"; e.onclick = function () { compartilhar("Leandro Reitor · Juntos para o IFAM ir mais longe! Conheça as propostas e coloque a moldura na sua foto:", D.config.site); }; }
    else if (x[4]) { e.href = x[4]; if (x[5]) e.setAttribute("download", "Plano-de-Gestao-Leandro-Reitor.pdf"); else { e.target = "_blank"; e.rel = "noopener"; } }
    else { e.href = "#participe"; e.onclick = function (ev) { ev.preventDefault(); toast("O Lattes entra aqui em breve"); }; }
    exWrap.appendChild(e);
  });
  var lb = $("#lattesBtn");
  if (L.lattes) { lb.href = L.lattes; lb.target = "_blank"; lb.rel = "noopener"; } else lb.style.display = "none";

  /* cabeçalho: nome só aparece depois do topo, para não repetir */
  var hero = $("#inicio");
  function rolou() { document.body.classList.toggle("rolou", window.scrollY > hero.offsetHeight - 80); }
  window.addEventListener("scroll", rolou, { passive: true }); rolou();

  /* ---------- compartilhar ---------- */
  function toast(t) { var x = $("#toast"); x.textContent = t; x.classList.add("on"); clearTimeout(x._t); x._t = setTimeout(function () { x.classList.remove("on"); }, 2200); }
  function compartilhar(texto, url) {
    if (navigator.share) { navigator.share({ text: texto, url: url }).catch(function () {}); return; }
    window.open("https://wa.me/?text=" + encodeURIComponent(texto + " " + url), "_blank", "noopener");
  }
  window.LRtoast = toast;

  /* ---------- painel ---------- */
  var painel = $("#painel"), cab = $("#pCab"), corpo = $("#pCorpo"), ultimoFoco = null;
  function listaProps(lista, base, verde) {
    return lista.map(function (p, i) {
      return '<article class="prop' + (verde ? " verde" : "") + '" id="' + base + "-" + (i + 1) + '">' +
        '<button type="button" aria-expanded="false"><span class="num">' + (i + 1) + '</span><span class="tt"><span>' + esc(p[0]) + "</span></span>" + ICO.mais + "</button>" +
        '<div class="txt"><p>' + esc(p[1]) + '</p><button class="comp" type="button" data-t="' + esc(p[0]) + '" data-h="' + base + "-" + (i + 1) + '">' + ICO.zap + " Compartilhar esta proposta</button></div></article>";
    }).join("");
  }
  function abrir(hash) {
    var m = hash.match(/^(eixo|seg)-([a-z0-9]+)(?:-(\d+))?$/);
    if (!m) return fechar(true);
    var html = "", topo = "";
    if (m[1] === "eixo") {
      var e = D.eixos[+m[2] - 1]; if (!e) return fechar(true);
      topo = '<img class="ico" src="' + IMG + "eixo" + e.n + '.png" alt=""><div><small>Eixo ' + e.n + " de 8</small><h2 id=\"pTitulo\">" + esc(e.titulo) + "</h2></div>";
      html = '<p class="desc">' + esc(e.desc) + "</p>" + listaProps(e.p, "eixo-" + e.n) +
        '<div class="ponte">' + (e.n > 1 ? '<a class="btn branco" href="#eixo-' + (e.n - 1) + '">← Eixo ' + (e.n - 1) + "</a>" : "") +
        (e.n < 8 ? '<a class="btn azul" href="#eixo-' + (e.n + 1) + '">Eixo ' + (e.n + 1) + " →</a>" : '<a class="btn amarelo" href="#moldura" data-sair>Colocar a moldura</a>') + "</div>";
    } else {
      var g = D.segmentos[m[2]]; if (!g) return fechar(true);
      topo = '<img class="fotoseg" src="' + IMG + g.foto + '" alt=""><div><small>Propostas para</small><h2 class="azul" id="pTitulo">' + esc(g.nome) + "</h2></div>";
      html = '<p class="desc">' + esc(g.frase) + "</p>" + listaProps(g.p, "seg-" + m[2], true) +
        '<div class="ponte">' + (g.eixoRelacionado ? '<a class="btn azul" href="#eixo-' + g.eixoRelacionado + '">Veja também o Eixo ' + g.eixoRelacionado + " →</a>" : "") +
        '<a class="btn amarelo" href="#moldura" data-sair>Colocar a moldura</a></div>';
    }
    cab.innerHTML = topo + '<button class="fechar" type="button" data-fechar aria-label="Fechar">' + ICO.x + "</button>";
    corpo.innerHTML = html;
    if (!painel.classList.contains("on")) { ultimoFoco = document.activeElement; painel.classList.add("on"); document.documentElement.style.overflow = "hidden"; }
    corpo.scrollTop = 0;
    if (m[3]) {
      var alvoP = document.getElementById(m[1] + "-" + m[2] + "-" + m[3]);
      if (alvoP) { alternar(alvoP, true); setTimeout(function () { alvoP.scrollIntoView({ block: "start" }); }, 60); }
    }
    $(".fechar", cab).focus({ preventScroll: true });
  }
  function fechar(semHistorico) {
    if (!painel.classList.contains("on")) return;
    painel.classList.remove("on"); document.documentElement.style.overflow = "";
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
    if (!semHistorico && /^#(eixo|seg)-/.test(location.hash)) history.pushState(null, "", location.pathname + location.search + "#propostas");
  }
  function alternar(art, forca) {
    var on = forca != null ? forca : !art.classList.contains("aberta");
    art.classList.toggle("aberta", on); $("button", art).setAttribute("aria-expanded", on);
  }
  painel.addEventListener("click", function (ev) {
    var t = ev.target;
    if (t.closest("[data-fechar]")) return fechar();
    var c = t.closest(".comp");
    if (c) return compartilhar("Proposta do Leandro Reitor: " + c.dataset.t + ".", D.config.site + "/#" + c.dataset.h);
    if (t.closest("[data-sair]")) { ev.preventDefault(); fechar(true); history.pushState(null, "", "#moldura"); $("#moldura").scrollIntoView(); return; }
    var b = t.closest(".prop>button");
    if (b) alternar(b.parentNode);
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") fechar(); });
  function rota() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (/^(eixo|seg)-/.test(h)) abrir(h); else fechar(true);
  }
  window.addEventListener("hashchange", rota);
  rota();

  /* ---------- barra inferior: seção ativa ---------- */
  var links = [].slice.call(document.querySelectorAll(".barra a"));
  var mapa = { inicio: "inicio", "para-voce": "propostas", propostas: "propostas", principios: "propostas", juntos: "leandro", leandro: "leandro", moldura: "moldura", participe: "participe" };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { var s = mapa[en.target.id]; links.forEach(function (a) { a.classList.toggle("ativo", a.dataset.s === s && !a.classList.contains("destaque")); }); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(mapa).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    var rv = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("vis"); rv.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".revela").forEach(function (x) { rv.observe(x); });
  } else document.querySelectorAll(".revela").forEach(function (x) { x.classList.add("vis"); });
  /* ---------- contador de acessos ---------- */
  (function () {
    var BASE = 7400;
    var elDigitos = document.getElementById("valorContador");
    if (!elDigitos) return;

    var KEY_LOCAL = "lr_acessos_total";
    var KEY_SESSAO = "lr_visita_contada";

    function formatar(num) {
      try {
        return Number(num).toLocaleString("pt-BR");
      } catch (e) {
        return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    }

    function animarNumero(de, para, duracao) {
      if (de === para) {
        elDigitos.textContent = formatar(para);
        return;
      }
      var inicio = performance.now();
      function passo(agora) {
        var progresso = Math.min((agora - inicio) / duracao, 1);
        var easeOut = 1 - Math.pow(1 - progresso, 3);
        var valor = Math.round(de + (para - de) * easeOut);
        elDigitos.textContent = formatar(valor);
        if (progresso < 1) {
          requestAnimationFrame(passo);
        } else {
          elDigitos.textContent = formatar(para);
        }
      }
      requestAnimationFrame(passo);
    }

    var salvo = parseInt(localStorage.getItem(KEY_LOCAL), 10);
    var valorAtual = (!isNaN(salvo) && salvo >= BASE) ? salvo : BASE;
    elDigitos.textContent = formatar(valorAtual);

    var jaContouSessao = false;
    try {
      jaContouSessao = sessionStorage.getItem(KEY_SESSAO) === "1";
    } catch (e) {}

    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 4000) : null;
    var endpoint = "https://counterapi.com/api/leandroreitor-site-2026/view/principal";

    fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (timeoutId) clearTimeout(timeoutId);
        var apiVal = parseInt(data.value, 10);
        if (!isNaN(apiVal) && apiVal > 0) {
          var novoTotal = BASE + apiVal;
          if (novoTotal > valorAtual) {
            animarNumero(valorAtual, novoTotal, 1000);
            try { localStorage.setItem(KEY_LOCAL, novoTotal); } catch (e) {}
          }
        }
        try { sessionStorage.setItem(KEY_SESSAO, "1"); } catch (e) {}
      })
      .catch(function () {
        if (timeoutId) clearTimeout(timeoutId);
        if (!jaContouSessao) {
          var novoTotal = valorAtual + 1;
          animarNumero(valorAtual, novoTotal, 700);
          try {
            localStorage.setItem(KEY_LOCAL, novoTotal);
            sessionStorage.setItem(KEY_SESSAO, "1");
          } catch (e) {}
        }
      });
  })();
})();
