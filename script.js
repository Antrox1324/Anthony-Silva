/* ==========================================================
   Página personal de Anthony Silva Alarcón
   Cada función se encarga de una sola cosa.
   ========================================================== */
'use strict';

/* ---------- Configuración ---------- */
const CONFIG = {
  email: 'silvaanthonya16@gmail.com',
  frases: [
    'programar en Java y C++',
    'enseñar y explicar',
    'hablar inglés',
    'resolver problemas',
  ],
  // Elementos que aparecen poco a poco al hacer scroll
  selectorRevelar: 'section h2, .about p, .fact, .job, .card',
};

const root = document.documentElement;
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema claro / oscuro ---------- */
function iniciarTema() {
  const boton = document.getElementById('theme');

  boton.addEventListener('click', () => {
    const elegido = root.getAttribute('data-theme');
    const esOscuro = elegido
      ? elegido === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', esOscuro ? 'light' : 'dark');
  });
}

/* ---------- Menú: marca la sección que se está viendo ---------- */
function iniciarMenuActivo() {
  const enlaces = [...document.querySelectorAll('nav a')];

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        enlaces.forEach((a) => {
          a.setAttribute('aria-current', a.getAttribute('href') === `#${entrada.target.id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  document.querySelectorAll('section[id]').forEach((s) => observador.observe(s));
}

/* ---------- Aparición suave de elementos al bajar ---------- */
function iniciarRevelado() {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('in');
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(CONFIG.selectorRevelar).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    observador.observe(el);
  });
}

/* ---------- Barra de progreso de lectura ---------- */
function iniciarBarraProgreso() {
  const barra = document.getElementById('bar');

  addEventListener(
    'scroll',
    () => {
      const total = root.scrollHeight - innerHeight;
      barra.style.width = `${total > 0 ? (scrollY / total) * 100 : 0}%`;
    },
    { passive: true }
  );
}

/* ---------- La foto sigue un poco al mouse ---------- */
function iniciarParalaje() {
  const foto = document.querySelector('.photo');
  if (!foto || sinMovimiento) return;

  addEventListener('pointermove', (e) => {
    foto.style.setProperty('--mx', (e.clientX / innerWidth - 0.5).toFixed(3));
    foto.style.setProperty('--my', (e.clientY / innerHeight - 0.5).toFixed(3));
  });
}

/* ---------- Frase que se escribe sola ("Me gusta…") ---------- */
function iniciarMaquinaDeEscribir() {
  const destino = document.getElementById('type');
  if (!destino || sinMovimiento) return;

  let frase = 0;
  let letras = 0;
  let borrando = false;

  function paso() {
    const texto = CONFIG.frases[frase];
    letras += borrando ? -1 : 1;
    destino.textContent = texto.slice(0, letras);

    let espera = borrando ? 35 : 70;
    if (!borrando && letras === texto.length) {
      borrando = true;
      espera = 1600; // pausa con la frase completa
    } else if (borrando && letras === 0) {
      borrando = false;
      frase = (frase + 1) % CONFIG.frases.length;
      espera = 300;
    }
    setTimeout(paso, espera);
  }

  destino.textContent = '';
  paso();
}

/* ---------- Botón "Copiar mi correo" ---------- */
function iniciarCopiarCorreo() {
  const boton = document.getElementById('copy');
  const aviso = document.getElementById('toast');

  const mostrar = (mensaje, ms) => {
    aviso.textContent = mensaje;
    if (ms) setTimeout(() => (aviso.textContent = ''), ms);
  };

  boton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      mostrar('Correo copiado', 2500);
    } catch {
      mostrar(`Copia este correo: ${CONFIG.email}`);
    }
  });
}

/* ---------- Arranque ---------- */
iniciarTema();
iniciarMenuActivo();
iniciarRevelado();
iniciarBarraProgreso();
iniciarParalaje();
iniciarMaquinaDeEscribir();
iniciarCopiarCorreo();
