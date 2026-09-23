/* NOVA MOTORS EXPORT — interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky nav ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- reveal on scroll (robust: never leaves content invisible) ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  var showAll = function () { reveals.forEach(function (el) { el.classList.add('is-in'); }); };
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    var revealInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.96) el.classList.add('is-in');
      });
    };
    revealInView();
    window.addEventListener('load', revealInView);
    setTimeout(showAll, 2200);
  } else {
    showAll();
  }

  /* ---- parallax (hero bg + ambient band), scroll-driven ---- */
  var heroBg = document.querySelector('.hero__bg');
  var bandBg = document.querySelector('.band__bg');
  var band = document.getElementById('band');
  if (!reduce) {
    var raf = false;
    var onP = function () {
      if (raf) return; raf = true;
      requestAnimationFrame(function () {
        var y = window.scrollY, vh = window.innerHeight;
        if (heroBg && y < vh * 1.2) heroBg.style.transform = 'scaleX(-1) translateY(' + (y * 0.14) + 'px) scale(1.05)';
        if (bandBg && band) {
          var r = band.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh) bandBg.style.transform = 'translateY(' + ((r.top - vh) * -0.08) + 'px)';
        }
        raf = false;
      });
    };
    onP();
    window.addEventListener('scroll', onP, { passive: true });
  }

  /* ---- stat counters ---- */
  var stats = document.querySelectorAll('.stat__n[data-count]');
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var finalVal = function (el) { return el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); };
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); sio.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    stats.forEach(function (el) { sio.observe(el); });
    setTimeout(function () { stats.forEach(function (el) { if (el.textContent === '0') el.textContent = finalVal(el); }); }, 3000);
  } else {
    stats.forEach(function (el) { el.textContent = finalVal(el); });
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if (burger && links) {
    var toggle = function (open) {
      links.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      toggle(!links.classList.contains('is-open'));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
  }

  /* ---- language EN (default) / ES / AR ---- */
  var I18N = {
    es: {
      nav_inventory: 'INVENTARIO', nav_process: 'PROCESO', nav_warranty: 'GARANTÍAS', nav_faq: 'FAQ', nav_contact: 'CONTACTO',
      hero_eyebrow: 'ADQUISICIÓN PRIVADA · MADRID / DUBÁI',
      hero_l1: 'Buscamos lo', hero_l2: 'inalcanzable',
      hero_lede: 'Buscamos, importamos y entregamos el coche exacto — de Dubái a España, un expediente, un contacto.',
      cta_request: 'SOLICITAR UN COCHE', cta_inventory: 'INVENTARIO', scroll: 'BAJA',
      man_lead: 'No vendemos coches de stock. Abrimos un expediente, encontramos la unidad exacta y te la entregamos.',
      man_body: 'Un único corredor entre Europa y el Golfo. Cada mandato confidencial, un director de adquisiciones de principio a fin.',
      man_sign: 'NOVA MOTORS EXPORT · MADRID · DUBÁI',
      ix_process: '02 — PROCESO', proc_title: 'BÚSQUEDA · IMPORTACIÓN · ENTREGA', proc_sub: 'Un solo hilo, de principio a fin. Sin intermediarios.',
      step1_h: 'Búsqueda', step1_p: 'Localizamos la unidad exacta —chasis, spec y procedencia— en el mercado privado de Dubái.',
      step2_h: 'Importación', step2_p: 'Aduana, homologación y trámites entre EAU y España. Cero fricción para ti.',
      step3_h: 'Entrega', step3_p: 'Transporte cerrado, entregado con el expediente de importación y dos juegos de llaves.',
      ix_imports: '03 — IMPORTACIONES', inv_title: 'IMPORTACIONES RECIENTES',
      inv_sub: 'Unidades reales de Dubái. Precio de compra, coste puesto en España y valor de mercado — sin maquillar.',
      st_delivered: 'ENTREGADO', sp_power: 'POTENCIA', sp_engine: 'MOTOR',
      pl_buy: 'COMPRA · DUBÁI', pl_landed: 'PUESTO · ESPAÑA', pl_market: 'MERCADO · ES', vs_market: 'VS MERCADO', enquire: 'CONSULTAR',
      inv_note: 'CASOS REALES · PRECIOS PUESTO EN ESPAÑA, IMPUESTOS INCLUIDOS',
      band_q: '«El coche correcto no está a la venta.', band_q2: 'Por eso existimos.»', band_by: 'NOVA MOTORS EXPORT · MESA DE ADQUISICIONES',
      ix_bases: '04 — SEDES', mk_title: 'DOS SEDES · UN EXPEDIENTE', mk_sub: 'El corredor Madrid–Dubái, operado extremo a extremo.',
      mk_madrid: 'Sede europea. Homologación, matriculación y entrega en la UE.',
      corridor: 'CORREDOR DE IMPORTACIÓN',
      mk_dubai: 'Sede del Golfo. Colecciones privadas emiratíes y logística de exportación desde DXB.',
      stat1: 'EXPEDIENTES ENTREGADOS', stat2: 'PAÍSES DE ORIGEN', stat3: 'SEMANAS · ENTREGA MEDIA', stat4: 'CONFIDENCIAL',
      ix_warranty: '05 — GARANTÍAS', wr_title: 'SIN RIESGO, POR CONTRATO', wr_sub: 'Cada garantía, por escrito en el contrato de servicio.',
      wr1_h: 'Garantía de inspección y reembolso',
      wr1_p: 'Si el coche llega con un defecto previo que la inspección debía detectar, te devolvemos íntegros los honorarios y Nova se queda el vehículo, reembolsándote lo que pagaste por él puesto en España.',
      wr2_h: 'Garantía mecánica en España',
      wr2_p: 'Tras la entrega: garantía mecánica y mantenimiento a través de nuestros talleres colaboradores en toda España.',
      wr3_h: 'Pago directo, control total',
      wr3_p: 'Pagas al vendedor directamente, solo tras la inspección y tu aprobación por escrito. Nunca tocamos el dinero del coche.',
      wr4_h: 'Transparencia total de costes',
      wr4_p: 'El coste puesto en España con todos los impuestos, antes de comprar. Sin costes ocultos.',
      ix_faq: '06 — FAQ', faq_title: 'TODO CLARO ANTES DE EMPEZAR', faq_sub: 'Las preguntas que todo cliente hace. Sin letra pequeña.', faq_cta: '¿OTRA DUDA? ESCRÍBENOS',
      q1: '¿Cuándo y a quién pago?', a1: 'Solo tras la inspección, el informe y tu aprobación por escrito. Pagas directamente al vendedor — nunca tocamos el dinero del coche.',
      q2: '¿Y si la inspección pasa algo por alto?', a2: 'Si un defecto previo se cuela, te devolvemos los honorarios y nos quedamos el coche, reembolsándote lo que pagaste por él puesto en España.',
      q3: '¿Qué pasa si la inspección falla?', a3: 'Se descarta sin coste adicional y pasamos a la siguiente unidad de tu lista.',
      q4: '¿Cuánto pagaré en total?', a4: 'Antes de comprar recibes el coste puesto en España con todos los impuestos, con un ejemplo real.',
      q5: '¿Cuánto tarda?', a5: '45–60 días desde la compra; la búsqueda suele llevar una o dos semanas.',
      q6: '¿Puedo importar para revender?', a6: 'Sí — buscamos modelos con buena salida en España y calculamos el margen antes de comprar.',
      q7: '¿Y después de la entrega?', a7: 'Garantía mecánica y mantenimiento en España a través de nuestros talleres colaboradores.',
      q8: '¿Se puede importar cualquier coche?', a8: 'No todos — algunos no se homologan o requieren cambios costosos. Lo comprobamos antes de proponerte una unidad.',
      ix_contact: '07 — CONTACTO', ct_l1: 'Solicita', ct_l2: 'un coche',
      ct_p: 'Dinos qué coche buscas. Un director de adquisiciones abre tu expediente y responde en privado en menos de 24 horas.',
      f_name: 'NOMBRE', f_contact: 'EMAIL O TELÉFONO', f_car: 'COCHE BUSCADO', f_notes: 'DETALLES DEL MANDATO',
      f_send: 'ENVIAR SOLICITUD PRIVADA', f_ok: 'SOLICITUD RECIBIDA · TE CONTACTAREMOS EN PRIVADO', ph_car: 'Marca · modelo · spec',
      foot_tag: 'IMPORTACIÓN PRIVADA · MADRID · DUBÁI', foot_reach: 'CONTACTO', foot_conf: 'CONFIDENCIAL'
    },
    ar: {
      nav_inventory: 'المخزون', nav_process: 'العملية', nav_warranty: 'الضمانات', nav_faq: 'الأسئلة', nav_contact: 'اتصال',
      hero_eyebrow: 'اقتناء خاص · مدريد / دبي',
      hero_l1: 'نبحث عمّا', hero_l2: 'لا يُقتنى',
      hero_lede: 'نعثر على السيارة المحدّدة ونستوردها ونسلّمها — من دبي إلى إسبانيا، ملف واحد ونقطة تواصل واحدة.',
      cta_request: 'اطلب سيارة', cta_inventory: 'المخزون', scroll: 'مرّر',
      man_lead: 'لا نبيع سيارات جاهزة. نفتح ملفًا، ونحدّد الوحدة بعينها، ونضعها بين يديك.',
      man_body: 'ممر خاص واحد بين أوروبا والخليج. كل تفويض سرّي، ومدير اقتناء واحد من البداية إلى النهاية.',
      man_sign: 'نوفا موتورز إكسبورت · مدريد · دبي',
      ix_process: '٠٢ — العملية', proc_title: 'توريد · استيراد · تسليم', proc_sub: 'خيط واحد من البداية إلى النهاية. بلا وسطاء.',
      step1_h: 'التوريد', step1_p: 'نتعقّب الوحدة المحدّدة — الهيكل والمواصفات والمصدر — في السوق الخاص بدبي.',
      step2_h: 'الاستيراد', step2_p: 'الجمارك والاعتماد والأوراق بين الإمارات وإسبانيا. صفر احتكاك لك.',
      step3_h: 'التسليم', step3_p: 'نقل مغلق، يُسلَّم مع ملف الاستيراد وطقمَي مفاتيح.',
      ix_imports: '٠٣ — الواردات', inv_title: 'واردات حديثة',
      inv_sub: 'وحدات حقيقية من دبي. سعر الشراء، والتكلفة واصلةً إلى إسبانيا، وقيمة السوق — دون تجميل.',
      st_delivered: 'تم التسليم', sp_power: 'القدرة', sp_engine: 'المحرك',
      pl_buy: 'شراء · دبي', pl_landed: 'واصلة · إسبانيا', pl_market: 'السوق · إسبانيا', vs_market: 'مقابل السوق', enquire: 'استفسار',
      inv_note: 'حالات استيراد حقيقية · أسعار واصلة إلى إسبانيا شاملة كل الضرائب',
      band_q: '«السيارة الصحيحة ليست للبيع.', band_q2: 'لهذا وُجدنا.»', band_by: 'نوفا موتورز إكسبورت · مكتب الاقتناء',
      ix_bases: '٠٤ — المقرّات', mk_title: 'مقرّان · ملف واحد', mk_sub: 'ممر مدريد–دبي، يُدار من الطرف إلى الطرف.',
      mk_madrid: 'المقر الأوروبي. الاعتماد والتسجيل والتسليم في الاتحاد الأوروبي.',
      corridor: 'ممر الاستيراد',
      mk_dubai: 'مقر الخليج. مجموعات إماراتية خاصة ولوجستيات تصدير من دبي.',
      stat1: 'ملفات مُسلّمة', stat2: 'دول المنشأ', stat3: 'أسابيع · متوسط التسليم', stat4: 'سرّية تامة',
      ix_warranty: '٠٥ — الضمانات', wr_title: 'دون مخاطرة · بموجب العقد', wr_sub: 'كل ضمان مكتوب في عقد الخدمة.',
      wr1_h: 'ضمان الفحص والاسترداد',
      wr1_p: 'إذا وصلت السيارة بعيب سابق كان على الفحص كشفه، نعيد أتعابنا كاملة وتحتفظ نوفا بالسيارة، مع ردّ ما دفعته فيها واصلةً إلى إسبانيا.',
      wr2_h: 'ضمان ميكانيكي في إسبانيا',
      wr2_p: 'بعد التسليم: ضمان ميكانيكي وصيانة عبر ورشنا الشريكة في كل إسبانيا.',
      wr3_h: 'دفع مباشر، تحكّم كامل',
      wr3_p: 'تدفع للبائع مباشرةً، فقط بعد الفحص وموافقتك الخطية. لا نمسّ مال السيارة أبدًا.',
      wr4_h: 'شفافية كاملة في التكاليف',
      wr4_p: 'التكلفة واصلةً إلى إسبانيا بكل الضرائب، قبل الشراء. بلا رسوم خفية.',
      ix_faq: '٠٦ — الأسئلة', faq_title: 'كل شيء واضح قبل أن نبدأ', faq_sub: 'الأسئلة التي يطرحها كل عميل. بلا حروف صغيرة.', faq_cta: 'سؤال آخر؟ راسلنا',
      q1: 'متى ولمن أدفع؟', a1: 'فقط بعد الفحص والتقرير وموافقتك الخطية. تدفع للبائع مباشرةً — لا نمسّ مال السيارة.',
      q2: 'وإن أغفل الفحص شيئًا؟', a2: 'إذا تسلّل عيب سابق، نعيد الأتعاب ونحتفظ بالسيارة، مع ردّ ما دفعته فيها واصلةً إلى إسبانيا.',
      q3: 'ماذا لو رسبت السيارة في الفحص؟', a3: 'تُستبعد دون تكلفة إضافية وننتقل إلى الوحدة التالية في قائمتك.',
      q4: 'كم سأدفع إجمالًا؟', a4: 'قبل الشراء تحصل على التكلفة واصلةً إلى إسبانيا بكل الضرائب، مع مثال حقيقي.',
      q5: 'كم تستغرق؟', a5: '٤٥–٦٠ يومًا من الشراء؛ والبحث عادةً أسبوع أو أسبوعان.',
      q6: 'هل أستطيع الاستيراد لإعادة البيع؟', a6: 'نعم — نستهدف طُرزًا رائجة في إسبانيا ونحسب الهامش قبل الشراء.',
      q7: 'وماذا بعد التسليم؟', a7: 'ضمان ميكانيكي وصيانة في إسبانيا عبر ورشنا الشريكة.',
      q8: 'هل يمكن استيراد أي سيارة؟', a8: 'ليس كلها — بعضها لا يُعتمد أو يحتاج تعديلات مكلفة. نتحقق قبل أن نقترح وحدة.',
      ix_contact: '٠٧ — اتصال', ct_l1: 'اطلب', ct_l2: 'سيارة',
      ct_p: 'أخبرنا بالسيارة التي تريدها. يفتح مدير الاقتناء ملفك ويردّ بسرّية خلال أقل من ٢٤ ساعة.',
      f_name: 'الاسم', f_contact: 'بريد أو هاتف', f_car: 'السيارة المطلوبة', f_notes: 'تفاصيل التفويض',
      f_send: 'إرسال طلب خاص', f_ok: 'تم استلام الطلب · سنتواصل معك بسرّية', ph_car: 'الماركة · الطراز · المواصفات',
      foot_tag: 'استيراد خاص · مدريد · دبي', foot_reach: 'اتصال', foot_conf: 'سرّي'
    }
  };
  // capture English defaults from the DOM
  var nodes = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    (nodes[k] = nodes[k] || []).push(el);
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
  });
  var phNodes = [].slice.call(document.querySelectorAll('[data-i18n-ph]'));
  phNodes.forEach(function (el) { el.setAttribute('data-en-ph', el.getAttribute('placeholder') || ''); });
  var langBtns = [].slice.call(document.querySelectorAll('#langToggle [data-lang]'));
  var setLang = function (lang) {
    var ar = lang === 'ar';
    var dict = I18N[lang];
    document.body.classList.toggle('ar', ar);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', ar ? 'rtl' : 'ltr');
    Object.keys(nodes).forEach(function (k) {
      nodes[k].forEach(function (el) {
        el.textContent = (dict && dict[k] != null) ? dict[k] : el.getAttribute('data-en');
      });
    });
    phNodes.forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      el.setAttribute('placeholder', (dict && dict[k] != null) ? dict[k] : el.getAttribute('data-en-ph'));
    });
    langBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-lang') === lang); });
  };
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---- FAQ accordion (single open) ---- */
  var faqItems = [].slice.call(document.querySelectorAll('.faq-item'));
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---- form (demo) ---- */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = document.getElementById('formOk');
      if (ok) ok.hidden = false;
      form.querySelectorAll('input,textarea').forEach(function (i) { i.value = ''; });
    });
  }
})();
