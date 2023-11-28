const miJuego = (() => {
  'use strict';
  let e = [],
    t = ['C', 'D', 'H', 'S'],
    r = ['A', 'J', 'Q', 'K'],
    l = [],
    n = document.querySelectorAll('small'),
    a = document.querySelectorAll('.divCartas'),
    d = document.querySelector('#btnPedir'),
    s = document.querySelector('#btnNuevo'),
    o = document.querySelector('#btnDetener'),
    i = document.querySelector('.modal'),
    $ = document.querySelector('.modal-mensaje'),
    c = (t = 1) => {
      (e = u()), (l = []);
      for (let r = 0; r < t; r++) l.push(0);
      (d.disabled = !1),
        (o.disabled = !1),
        (l[0] = 0),
        (l[1] = 0),
        n.forEach((e) => (e.innerText = 0)),
        a.forEach((e) => (e.innerText = ''));
    },
    u = () => {
      e = [];
      for (let l = 2; l <= 10; l++) for (let n of t) e.push(l + n);
      for (let a of r) for (let d of t) e.push(a + d);
      return e.sort(_);
    },
    _ = () => Math.random() - 0.5,
    h = () => {
      if (0 === e.length) throw 'No hay cartas en el deck';
      return e.pop();
    },
    b = (e) => {
      let t = e.substring(0, e.length - 1);
      return isNaN(t) ? ('A' == t ? 11 : 10) : 1 * t;
    },
    A = (e, t) => ((l[t] += b(e)), (n[t].innerText = l[t]), l[t]),
    f = (e, t) => {
      let r = document.createElement('img');
      (r.src = `assets/cartas/${e}.png`),
        r.classList.add('carta'),
        a[t].append(r);
    },
    m = () => {
      let [e, t] = l;
      setTimeout(() => {
        e === t
          ? p('EMPATE!!')
          : (e > t && e <= 21) || t > 21
          ? p('GANA JUGADOR')
          : ((e < t && t <= 21) || e > 21) && p('GANA COMPUTADORA');
      }, 1e3);
    },
    g = (e) => {
      let t = 0;
      do {
        let r = h();
        (t = A(r, l.length - 1)), f(r, l.length - 1);
      } while (t < e && e <= 21);
      m();
    },
    p = (e) => {
      i.classList.remove('d-none'),
        i.removeAttribute('aria-hidden'),
        ($.innerText = e);
      let t = new bootstrap.Modal(i);
      t.show();
    },
    E = () => {
      l[0] > 21
        ? ((d.disabled = !0), (o.disabled = !0), g(l[0]))
        : 21 === l[0] && ((d.disabled = !0), (o.disabled = !0), g(l[0]));
    };
  return (
    d.addEventListener('click', () => {
      let e = h();
      A(e, 0), f(e, 0), E();
    }),
    o.addEventListener('click', () => {
      (d.disabled = !0), (o.disabled = !0), g(l[0]);
    }),
    s.addEventListener('click', () => {
      c();
    }),
    'Empezando el juego'
  );
})();
