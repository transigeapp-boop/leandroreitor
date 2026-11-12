/* Moldura Leandro Reitor — tudo acontece no aparelho; a foto nunca é enviada. */
(function () {
  "use strict";
  var C = { azul: "#0445AD", azul2: "#036ABD", navy: "#04004F", verde: "#029828", amarelo: "#FCBD04", marca: "#FFED00", vermelho: "#E60316", branco: "#FFFFFF" };
  var TAM = { perfil: [1080, 1080], post: [1080, 1350], story: [1080, 1920] };
  var TIT = "Now, Poppins, 'Segoe UI', sans-serif";
  var cv = document.getElementById("tela"), ctx = cv.getContext("2d");
  var palco = document.getElementById("palco"), wiz = document.getElementById("wiz");
  var st = { f: "post", m: "moldura", s: "", img: null, zoom: 1, ox: 0, oy: 0 };
  var simbolo = new Image(); simbolo.src = "assets/img/logo-simbolo.png"; simbolo.onload = function () { desenhar(); };
  var seloImg = new Image(); seloImg.src = "assets/img/selo.png"; seloImg.onload = function () { desenhar(); };

  /* ---------- utilidades de desenho ---------- */
  function rr(x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function fonte(peso, px) { ctx.font = peso + " " + px + "px " + TIT; }

  /* selo oficial "Vote LEANDRO REITOR" (PNG da campanha) */
  function bloco(x, y, s) {
    var w = 480 * s, h = w * 430 / 983;
    if (seloImg.complete && seloImg.naturalWidth) {
      ctx.save(); ctx.shadowColor = "rgba(4,0,79,.30)"; ctx.shadowBlur = 22 * s; ctx.shadowOffsetY = 8 * s;
      ctx.drawImage(seloImg, x, y, w, h); ctx.restore();
    }
    etiquetaSeg(x + w * .25, y + 1 * s, .62 * s / .9);
    return { w: w, h: h };
  }
  function larguraBloco(s) { return 480 * s; }
  function iconeCalendario(x, y, s, cor) {
    ctx.save(); ctx.strokeStyle = cor; ctx.fillStyle = cor; ctx.lineWidth = 3.4 * s;
    ctx.beginPath(); rr(x, y + 4 * s, 30 * s, 27 * s, 5 * s); ctx.stroke();
    ctx.fillRect(x, y + 4 * s, 30 * s, 8 * s);
    ctx.fillRect(x + 7 * s, y, 3.4 * s, 9 * s); ctx.fillRect(x + 20 * s, y, 3.4 * s, 9 * s);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) ctx.fillRect(x + (6 + i * 7.5) * s, y + (16 + j * 7) * s, 4.5 * s, 4 * s);
    ctx.restore();
  }
  function iconePessoas(x, y, s, cor) {
    ctx.save(); ctx.fillStyle = cor;
    [[16, 9, 6.5], [5, 12, 5], [27, 12, 5]].forEach(function (c) { ctx.beginPath(); ctx.arc(x + c[0] * s, y + c[1] * s, c[2] * s, 0, 7); ctx.fill(); });
    ctx.beginPath(); ctx.ellipse(x + 16 * s, y + 28 * s, 11 * s, 9 * s, 0, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 4 * s, y + 28 * s, 7 * s, 7 * s, 0, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 28 * s, y + 28 * s, 7 * s, 7 * s, 0, Math.PI, 0); ctx.fill();
    ctx.restore();
  }
  /* pílula com ícone (padrão dos cards do Canva) */
  function pilula(x, y, texto, s, fundo, corTexto, icone, alinhaDir) {
    fonte(700, 34 * s); var tw = ctx.measureText(texto).width;
    var h = 62 * s, ic = 46 * s, w = tw + ic + 44 * s;
    if (alinhaDir) x = x - w;
    ctx.save(); ctx.shadowColor = "rgba(4,0,79,.25)"; ctx.shadowBlur = 16 * s; ctx.shadowOffsetY = 5 * s;
    ctx.fillStyle = fundo; ctx.beginPath(); rr(x, y, w, h, 14 * s); ctx.fill(); ctx.restore();
    ctx.fillStyle = C.amarelo; ctx.beginPath(); ctx.arc(x + 12 * s + ic / 2, y + h / 2, ic / 2, 0, 7); ctx.fill();
    icone(x + 12 * s + ic / 2 - 16 * s, y + h / 2 - 17 * s, s, fundo === C.amarelo ? C.azul : C.azul);
    if (fundo === C.amarelo) { ctx.fillStyle = C.branco; ctx.beginPath(); ctx.arc(x + 12 * s + ic / 2, y + h / 2, ic / 2, 0, 7); ctx.fill(); icone(x + 12 * s + ic / 2 - 16 * s, y + h / 2 - 17 * s, s, C.azul); }
    ctx.fillStyle = corTexto; ctx.textBaseline = "middle"; fonte(700, 34 * s); ctx.fillText(texto, x + ic + 26 * s, y + h / 2 + 2 * s); ctx.textBaseline = "alphabetic";
    return { w: w, h: h };
  }
  function vote(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-4 * Math.PI / 180);
    fonte(800, 50 * s); var w = ctx.measureText("VOTE").width + 34 * s;
    ctx.shadowColor = "rgba(239,4,25,.35)"; ctx.shadowBlur = 14 * s; ctx.shadowOffsetY = 5 * s;
    ctx.fillStyle = C.vermelho; ctx.beginPath(); rr(0, 0, w, 70 * s, 8 * s); ctx.fill(); ctx.shadowColor = "transparent";
    ctx.fillStyle = C.branco; ctx.fillText("VOTE", 17 * s, 54 * s); ctx.restore();
  }
  function selo(cx, cy, r) {
    ctx.save(); ctx.shadowColor = "rgba(4,0,79,.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.fillStyle = C.branco; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.restore();
    if (simbolo.complete && simbolo.naturalWidth) { var k = r * 1.42 / Math.max(simbolo.width, simbolo.height); ctx.drawImage(simbolo, cx - simbolo.width * k / 2, cy - simbolo.height * k / 2 + r * .02, simbolo.width * k, simbolo.height * k); }
  }
  function etiquetaSeg(x, y, s) {
    if (!st.s) return 0;
    var t = "SOU " + st.s;
    fonte(800, 34 * s); var w = ctx.measureText(t).width + 40 * s;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = C.marca; ctx.fillRect(0, 0, w, 56 * s);
    ctx.fillStyle = C.azul; ctx.fillText(t, 20 * s, 40 * s); ctx.restore();
    return 62 * s;
  }

  /* ---------- foto ---------- */
  function foto(W, H) {
    if (!st.img) {
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#DCE3F2"); g.addColorStop(1, "#BFC9DE"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.75)"; var u = Math.min(W, H);
      ctx.beginPath(); ctx.arc(W / 2, H * .42, u * .16, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(W / 2, H * .42 + u * .5, u * .34, u * .3, 0, Math.PI, 0); ctx.fill();
      return;
    }
    var i = st.img, base = Math.max(W / i.width, H / i.height), k = base * st.zoom, w = i.width * k, h = i.height * k;
    var mx = Math.max(0, (w - W) / 2), my = Math.max(0, (h - H) / 2);
    st.ox = Math.max(-mx, Math.min(mx, st.ox)); st.oy = Math.max(-my, Math.min(my, st.oy));
    ctx.drawImage(i, (W - w) / 2 + st.ox, (H - h) / 2 + st.oy, w, h);
  }
  function degradeBase(W, H, h0, forca) {
    var g = ctx.createLinearGradient(0, H - h0, 0, H); g.addColorStop(0, "rgba(4,0,79,0)"); g.addColorStop(1, "rgba(4,0,79," + forca + ")");
    ctx.fillStyle = g; ctx.fillRect(0, H - h0, W, h0);
  }

  /* ---------- moldura colorida (card "Moldura da campanha") ---------- */
  function bordaColorida(W, H, m, t, r) {
    ctx.save();
    ctx.fillStyle = C.branco;
    // área externa à moldura: branca (como o card)
    ctx.beginPath(); ctx.rect(0, 0, W, H); rr(m, m, W - 2 * m, H - 2 * m, r); ctx.fill("evenodd");
    // anel azul
    ctx.beginPath(); rr(m, m, W - 2 * m, H - 2 * m, r); rr(m + t, m + t, W - 2 * (m + t), H - 2 * (m + t), Math.max(4, r - t)); ctx.fillStyle = C.azul; ctx.fill("evenodd");
    ctx.clip("evenodd");
    ctx.fillStyle = C.amarelo; ctx.fillRect(W * .38, 0, W * .3, m + t + 2);
    ctx.fillStyle = C.verde; ctx.fillRect(0, H * .34, m + t + 2, H * .24);
    ctx.fillStyle = C.vermelho; ctx.fillRect(W - m - t - 2, H * .52, m + t + 2, H * .22);
    ctx.fillStyle = C.vermelho; ctx.fillRect(W * .30, H - m - t - 2, W * .2, m + t + 2);
    ctx.fillStyle = C.verde; ctx.fillRect(W * .50, H - m - t - 2, W * .22, m + t + 2);
    ctx.restore();
  }
  function raiosCanto(W, H, s) {
    // faixas diagonais saindo do canto inferior esquerdo (assinatura dos cards)
    ctx.save();
    var cores = [C.amarelo, C.verde, C.vermelho], b = 22 * s;
    cores.forEach(function (c, i) {
      ctx.fillStyle = c; ctx.beginPath();
      var y0 = H - 14 * s - i * b * 1.15;
      ctx.moveTo(0, y0); ctx.lineTo(260 * s, y0 - 70 * s); ctx.lineTo(260 * s, y0 - 70 * s + b * .7); ctx.lineTo(0, y0 + b); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  }

  function ladoDireito(xd, y, s) {
    ctx.save(); ctx.textAlign = "right"; ctx.shadowColor = "rgba(4,0,79,.45)"; ctx.shadowBlur = 12;
    fonte(800, 44 * s); ctx.fillStyle = C.branco; ctx.fillText("Juntos para o IFAM", xd, y + 44 * s);
    ctx.fillStyle = C.amarelo; ctx.fillText("ir mais longe!", xd, y + 98 * s);
    ctx.restore();
    pilula(xd, y + 128 * s, "26 e 27 de novembro", .95 * s, C.amarelo, C.azul, iconeCalendario, true);
  }
  function postStory(W, H, story) {
    var s = 1, topo = story ? 210 : 70, baseLivre = story ? 330 : 64;
    foto(W, H);
    if (st.m === "moldura") {
      degradeBase(W, H, story ? 820 : 560, .78);
      bordaColorida(W, H, 26, 30, 54);
      raiosCanto(W, H, 1);
      selo(W - 140, topo + 66, 70);
      var yb = H - baseLivre - 66 - 185;
      bloco(76, yb, .88);
      ladoDireito(W - 86, yb + 44, .86);
    } else {
      // Faixa: painel azul inclinado na base, como o card "Moldura da campanha"
      var hp = story ? 560 : 430, y0 = H - hp - (story ? 150 : 0);
      ctx.save();
      ctx.fillStyle = C.azul; ctx.beginPath(); ctx.moveTo(0, y0 + 90); ctx.lineTo(W, y0); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      var faixas = [C.amarelo, C.verde, C.vermelho];
      faixas.forEach(function (c, i) { ctx.fillStyle = c; ctx.beginPath(); var d = i * 16; ctx.moveTo(0, y0 + 90 - 14 - d - 2); ctx.lineTo(W, y0 - 14 - d - 2); ctx.lineTo(W, y0 - d - 2); ctx.lineTo(0, y0 + 90 - d - 2); ctx.closePath(); ctx.fill(); });
      ctx.restore();
      if (story) { ctx.fillStyle = C.azul; ctx.fillRect(0, H - 150, W, 150); }
      selo(W - 130, topo + 60, 64);
      var by = y0 + 130;
      bloco(60, by - 10, .98);
      ladoDireito(W - 66, by + 36, 1);
    }
  }

  function perfil(W) {
    var R = W / 2;
    foto(W, W);
    if (st.m === "moldura") {
      degradeBase(W, W, 420, .6);
      var t = 54, r = R - t / 2;
      var arcos = [[C.azul, 0.70, 1.30], [C.amarelo, 1.30, 1.72], [C.azul, 1.72, 2.05], [C.verde, 2.05, 2.30], [C.vermelho, 0.30, 0.70], [C.verde, 0.0, 0.30]];
      ctx.lineWidth = t;
      arcos.forEach(function (a) { ctx.strokeStyle = a[0]; ctx.beginPath(); ctx.arc(R, R, r, a[1] * Math.PI, a[2] * Math.PI); ctx.stroke(); });
      var s = .9, lw = larguraBloco(s);
      bloco(R - lw / 2, W - 370, s);
    } else {
      // anel azul largo com texto em curva
      var tb = 118, rb = R - tb / 2;
      ctx.lineWidth = tb; ctx.strokeStyle = C.azul; ctx.beginPath(); ctx.arc(R, R, rb, 0, 7); ctx.stroke();
      ctx.lineWidth = 14;
      [[C.amarelo, 1.05, 1.45], [C.verde, 1.45, 1.75], [C.vermelho, 1.75, 1.95]].forEach(function (a) { ctx.strokeStyle = a[0]; ctx.beginPath(); ctx.arc(R, R, R - tb - 7, a[1] * Math.PI, a[2] * Math.PI); ctx.stroke(); });
      curva(st.s ? "SOU " + st.s + " E VOTO LEANDRO REITOR" : "LEANDRO REITOR • JUNTOS PARA O IFAM IR MAIS LONGE!", R, R, rb, C.branco, 52, true);
      curva("ELEIÇÃO 26 E 27 DE NOVEMBRO", R, R, rb, C.amarelo, 50, false);
    }
  }
  function curva(txt, cx, cy, r, cor, px, cima) {
    ctx.save(); fonte(800, px); ctx.fillStyle = cor; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var ls = 2, larg = 0, ws = [];
    for (var i = 0; i < txt.length; i++) { var w = ctx.measureText(txt[i]).width + ls; ws.push(w); larg += w; }
    var ang = larg / r, a = cima ? -Math.PI / 2 - ang / 2 : Math.PI / 2 + ang / 2;
    for (var j = 0; j < txt.length; j++) {
      var d = ws[j] / r, meio = cima ? a + d / 2 : a - d / 2;
      ctx.save(); ctx.translate(cx + r * Math.cos(meio), cy + r * Math.sin(meio)); ctx.rotate(meio + (cima ? Math.PI / 2 : -Math.PI / 2));
      ctx.fillText(txt[j], 0, 2); ctx.restore();
      a = cima ? a + d : a - d;
    }
    ctx.restore();
  }

  /* pinta a moldura num canvas qualquer (prévia pequena ou final) */
  function pintar(canvas, modelo) {
    var t = TAM[st.f], W = t[0], H = t[1], antes = ctx, mAntes = st.m;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    ctx = canvas.getContext("2d"); if (modelo) st.m = modelo;
    ctx.clearRect(0, 0, W, H); ctx.save();
    if (st.f === "perfil") { ctx.beginPath(); ctx.arc(W / 2, H / 2, W / 2, 0, 7); ctx.clip(); perfil(W); }
    else postStory(W, H, st.f === "story");
    ctx.restore(); ctx = antes; st.m = mAntes;
    canvas.classList.toggle("redonda", st.f === "perfil");
  }
  function desenhar() {
    var p = +wiz.dataset.passo;
    if (p === 2) [].forEach.call(document.querySelectorAll("#optModelo canvas"), function (c) { pintar(c, c.dataset.m); });
    if (p === 4) pintar(document.getElementById("miniFinal"));
    if (p === 5) pintar(cv);
  }

  /* ---------- passo a passo ---------- */
  var voltar = document.getElementById("wVoltar"), wnum = document.getElementById("wNum");
  function ir(p, semRolar) {
    wiz.dataset.passo = p;
    [].forEach.call(wiz.querySelectorAll(".passo"), function (x) { x.hidden = +x.dataset.p !== p; });
    [].forEach.call(wiz.querySelectorAll(".prog i"), function (x, i) { x.classList.toggle("on", i < Math.min(p, 4)); });
    wnum.textContent = p === 5 ? "Pronto!" : p + " de 4";
    voltar.hidden = p === 1;
    palco.classList.toggle("perfil", st.f === "perfil");
    desenhar();
    if (semRolar) return;
    var topo = wiz.getBoundingClientRect().top;
    if (topo < 60 || topo > window.innerHeight * .5) window.scrollTo({ top: window.scrollY + topo - 74, behavior: "smooth" });
  }
  function marca(grupo, attr, valor) {
    [].forEach.call(document.querySelectorAll("#" + grupo + " .op"), function (x) { x.classList.toggle("sel", x.dataset[attr] === valor); });
  }
  voltar.onclick = function () { var p = +wiz.dataset.passo; ir(p === 5 ? 3 : p - 1); };
  document.getElementById("optFormato").addEventListener("click", function (e) {
    var b = e.target.closest(".op"); if (!b) return;
    st.f = b.dataset.f; st.ox = st.oy = 0; marca("optFormato", "f", st.f); ir(2);
  });
  document.getElementById("optModelo").addEventListener("click", function (e) {
    var b = e.target.closest(".op"); if (!b) return;
    st.m = b.dataset.m; marca("optModelo", "m", st.m); ir(3);
  });
  document.getElementById("optSeg").addEventListener("click", function (e) {
    var b = e.target.closest(".op"); if (!b) return;
    st.s = b.dataset.s; marca("optSeg", "s", st.s); ir(st.img ? 5 : 4);
  });
  [].forEach.call(document.querySelectorAll(".troca[data-ir]"), function (b) { b.onclick = function () { ir(+b.dataset.ir); }; });

  var zoom = document.getElementById("zoom");
  zoom.addEventListener("input", function () { st.zoom = +zoom.value; pintar(cv); });

  function carregar(inp) {
    var f = inp.files && inp.files[0]; if (!f) return;
    var url = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      var max = 2400, k = Math.min(1, max / Math.max(im.width, im.height));
      if (k < 1) { var c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); st.img = c; }
      else st.img = im;
      st.zoom = 1; zoom.value = 1; st.ox = st.oy = 0;
      ir(5);
    };
    im.onerror = function () { window.LRtoast && window.LRtoast("Não consegui abrir essa foto. Tente outra."); };
    im.src = url; inp.value = "";
  }
  document.getElementById("arquivo").addEventListener("change", function () { carregar(this); });
  document.getElementById("arquivo2").addEventListener("change", function () { carregar(this); });

  /* arrastar e pinça */
  var pts = {}, ini = null;
  function escala() { return cv.width / cv.getBoundingClientRect().width; }
  cv.addEventListener("pointerdown", function (e) { if (!st.img) return; cv.setPointerCapture(e.pointerId); pts[e.pointerId] = { x: e.clientX, y: e.clientY }; ini = null; cv.style.cursor = "grabbing"; });
  cv.addEventListener("pointermove", function (e) {
    if (!pts[e.pointerId]) return;
    var ids = Object.keys(pts), k = escala();
    if (ids.length === 1) { st.ox += (e.clientX - pts[e.pointerId].x) * k; st.oy += (e.clientY - pts[e.pointerId].y) * k; }
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (ids.length === 2) {
      var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (!ini) ini = { d: d, z: st.zoom };
      st.zoom = Math.max(1, Math.min(3, ini.z * d / ini.d)); zoom.value = st.zoom;
    }
    pintar(cv);
  });
  function solta(e) { delete pts[e.pointerId]; ini = null; cv.style.cursor = ""; }
  cv.addEventListener("pointerup", solta); cv.addEventListener("pointercancel", solta);
  cv.addEventListener("wheel", function (e) { if (!st.img) return; e.preventDefault(); st.zoom = Math.max(1, Math.min(3, st.zoom - e.deltaY * .0015)); zoom.value = st.zoom; pintar(cv); }, { passive: false });

  /* exportar */
  function gerar(cb) {
    var png = st.f === "perfil";
    cv.toBlob(function (b) { cb(b, "leandro-reitor-" + st.f + (png ? ".png" : ".jpg"), png ? "image/png" : "image/jpeg"); }, png ? "image/png" : "image/jpeg", .93);
  }
  document.getElementById("baixar").onclick = function () {
    gerar(function (b, nome) {
      var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = nome; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      window.LRtoast && window.LRtoast("Pronto! Imagem salva.");
    });
  };
  document.getElementById("compartilhar").onclick = function () {
    gerar(function (b, nome, tipo) {
      var f = new File([b], nome, { type: tipo });
      if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], text: "Eu voto Leandro Reitor! Juntos para o IFAM ir mais longe! Coloque a moldura na sua foto: leandroreitor.com.br" }).catch(function () {});
      else document.getElementById("baixar").click();
    });
  };

  if (document.fonts && document.fonts.load) {
    Promise.all(["900 96px Poppins", "800 40px Poppins", "700 34px Poppins", "500 92px Poppins"].map(function (f) { return document.fonts.load(f); })).then(desenhar, desenhar);
  }
  ir(1, true);
})();
