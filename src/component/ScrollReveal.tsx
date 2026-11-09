'use client';

import React, {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SCRUB_SPAN = 0.5;
const RISE_MASK = 'inset(-1em -1em -0.15em -1em)';

type RevealSplit = 'words' | 'chars' | 'lines';
type RevealEffect = 'fade' | 'rise' | 'flip' | 'scale';
type RevealMode = 'scrub' | 'enter';

interface ScrollRevealProps {
  children: ReactNode;
  /** Etiqueta del contenedor. Por defecto h2; usa "p" para párrafos. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  id?: string;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  baseOffset?: number;
  stagger?: number;
  smoothing?: number;
  splitBy?: RevealSplit;
  effect?: RevealEffect;
  mode?: RevealMode;
  duration?: number;
  highlightColor?: string;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

interface RevealLook {
  effect: RevealEffect;
  masked: boolean;
  baseOpacity: number;
  blur: number;
  offset: number;
  highlightColor: string;
}

// Lee un punto estilo ScrollTrigger ("top", "bottom", "center", "35%", "120px", con "+=N"/"-=N")
// como distancia en px desde el inicio de una caja del tamaño dado.
const POINT = /^(top|center|bottom|-?\d+(?:\.\d+)?%|-?\d+(?:\.\d+)?(?:px)?)?([+-]=-?\d+(?:\.\d+)?)?$/;
const readPoint = (token: string, size: number) => {
  const match = POINT.exec(token);
  if (!match) return 0;
  const [, base = 'top', relative] = match;
  const at =
    base === 'top'
      ? 0
      : base === 'center'
        ? size / 2
        : base === 'bottom'
          ? size
          : base.endsWith('%')
            ? (parseFloat(base) / 100) * size
            : parseFloat(base);
  return at + (relative ? (relative[0] === '+' ? 1 : -1) * parseFloat(relative.slice(2)) : 0);
};

/** "top 35%" → { edge: px dentro del elemento, line: px dentro de la ventana }. */
const readRange = (spec: string, elementHeight: number, viewHeight: number) => {
  const [edge = 'top', line = 'bottom'] = spec.replace(/^clamp\((.*)\)$/, '$1').trim().split(/\s+/);
  return { edge: readPoint(edge, elementHeight), line: readPoint(line, viewHeight) };
};

/**
 * Avance 0→1 entre dos momentos: cuando `start` del elemento cruza su línea y cuando `end` cruza
 * la suya. Se calcula con la posición actual en pantalla, sin registro global de posiciones.
 */
const progressBetween = (
  top: number,
  start: { edge: number; line: number },
  end: { edge: number; line: number }
) => {
  // Ambas distancias bajan a medida que se hace scroll; el avance va de 0 (toStart = 0)
  // a 1 (toEnd = 0).
  const toStart = top + start.edge - start.line;
  const toEnd = top + end.edge - end.line;
  const distance = toEnd - toStart;
  if (distance <= 0) return toEnd <= 0 ? 1 : 0;
  return Math.min(Math.max(-toStart / distance, 0), 1);
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = (value: number) => value * value * (3 - 2 * value);
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const easeBack = (value: number, overshoot: number) => {
  const shifted = value - 1;
  return 1 + (overshoot + 1) * shifted * shifted * shifted + overshoot * shifted * shifted;
};
const glowAt = (t: number) => (t <= 0 || t >= 1 ? 0 : t < 0.35 ? smooth(t / 0.35) : 1 - smooth((t - 0.35) / 0.65));

const paintPiece = (piece: HTMLElement, t: number, look: RevealLook) => {
  let reveal = t;
  let fadeIn = t;
  let motion = '';
  if (look.effect === 'rise') {
    reveal = easeOut(t);
    fadeIn = clamp01(reveal * 1.25);
    if (reveal < 1) {
      motion = look.masked
        ? `translateY(${((1 - reveal) * 100).toFixed(2)}%) translateY(${((1 - reveal) * 0.2).toFixed(3)}em)`
        : `translateY(${((1 - reveal) * 0.8).toFixed(3)}em)`;
    }
  } else if (look.effect === 'flip') {
    reveal = easeBack(t, 1.2);
    fadeIn = clamp01(t * 2);
    if (t < 1) motion = `perspective(6em) rotateX(${((1 - reveal) * 90).toFixed(2)}deg)`;
  } else if (look.effect === 'scale') {
    reveal = easeBack(t, 1.6);
    fadeIn = clamp01(t * 1.6);
    if (t < 1) motion = `scale(${(0.35 + 0.65 * reveal).toFixed(4)})`;
  }
  if (look.highlightColor) fadeIn = Math.max(fadeIn, clamp01(t / 0.35));
  const settle = clamp01(reveal);
  const lift = look.offset * (1 - settle);
  piece.style.opacity = t >= 1 ? '' : (look.baseOpacity + (1 - look.baseOpacity) * fadeIn).toFixed(3);
  piece.style.transform = [lift ? `translateY(${lift.toFixed(2)}px)` : '', motion].filter(Boolean).join(' ');
  piece.style.filter = look.blur && settle < 1 ? `blur(${(look.blur * (1 - settle)).toFixed(2)}px)` : '';
  if (look.highlightColor) {
    const glow = glowAt(t);
    piece.style.color =
      glow > 0.002 ? `color-mix(in srgb, ${look.highlightColor} ${(glow * 100).toFixed(1)}%, currentColor)` : '';
  }
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  as: Tag = 'h2',
  id,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  baseOffset = 0,
  stagger = 0.05,
  smoothing = 0,
  splitBy = 'words',
  effect = 'fade',
  mode = 'scrub',
  duration = 0.8,
  highlightColor = '',
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const text = useMemo(() => {
    const parts = Children.toArray(children);
    return parts.every(part => typeof part === 'string' || typeof part === 'number') ? parts.join('') : null;
  }, [children]);

  const splitText = useMemo(() => {
    if (text === null) return null;
    return text.split(/(\s+)/).map((word, index) =>
      word.trim() === '' ? (
        word
      ) : (
        <span className="scroll-reveal-word" key={index}>
          {splitBy === 'chars' ? (
            Array.from(word).map((char, charIndex) => (
              <span className="scroll-reveal-piece" key={charIndex}>
                {char}
              </span>
            ))
          ) : (
            <span className="scroll-reveal-piece">{word}</span>
          )}
        </span>
      )
    );
  }, [text, splitBy]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;
    if (scrollContainerRef && !scrollContainerRef.current) return;
    // Sin matchMedia (p. ej. jsdom) no se puede respetar prefers-reduced-motion: texto estático.
    if (typeof window.matchMedia !== 'function') return;

    const scroller = scrollContainerRef?.current || window;
    const wrappers = Array.from(el.querySelectorAll<HTMLElement>('.scroll-reveal-word'));
    const pieces = wrappers.length ? Array.from(el.querySelectorAll<HTMLElement>('.scroll-reveal-piece')) : [textEl];
    const viewportHeight = () => (scroller instanceof HTMLElement ? scroller.clientHeight : window.innerHeight);
    const scrub = smoothing > 0 ? smoothing : true;
    const span = mode === 'enter' ? Math.max(0.05, duration) : SCRUB_SPAN;
    const gap = Math.max(0, stagger);
    const mm = gsap.matchMedia();

    // Con "reducir movimiento" el texto se sigue revelando, pero solo con opacidad:
    // sin desenfoque, giro, desplazamiento ni cambio de color.
    mm.add({ reduce: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      const reduced = Boolean(context.conditions?.reduce);
      const rotation = reduced ? 0 : baseRotation;
      const look: RevealLook = reduced
        ? { effect: 'fade', masked: false, baseOpacity, blur: 0, offset: 0, highlightColor: '' }
        : {
            effect,
            masked: effect === 'rise' && wrappers.length > 0,
            baseOpacity,
            blur: enableBlur ? blurStrength : 0,
            offset: baseOffset,
            highlightColor
          };
      const order = pieces.map((_, index) => index);
      const last = pieces.map(() => -1);
      const state = { p: 0 };
      let count = pieces.length;

      const measure = () => {
        if (splitBy !== 'lines' || !wrappers.length) return;
        let line = -1;
        let top = -Infinity;
        wrappers.forEach((wrapper, index) => {
          const next = wrapper.offsetTop;
          if (Math.abs(next - top) > 2) {
            line += 1;
            top = next;
          }
          order[index] = line;
        });
        count = line + 1;
      };

      const total = () => span + Math.max(0, count - 1) * gap;

      const render = () => {
        const at = state.p * total();
        pieces.forEach((piece, index) => {
          const t = clamp01((at - order[index] * gap) / span);
          if (t === last[index]) return;
          last[index] = t;
          paintPiece(piece, t, look);
        });
      };

      measure();
      pieces.forEach(piece => {
        piece.style.willChange =
          pieces.length > 80 ? '' : look.effect === 'fade' && !look.offset ? 'opacity' : 'opacity, transform';
        piece.style.transformOrigin = look.effect === 'flip' ? '50% 100%' : '';
      });
      if (look.masked) {
        wrappers.forEach(wrapper => {
          wrapper.style.clipPath = RISE_MASK;
        });
      }
      render();

      let stopLocal: (() => void) | null = null;

      if (mode === 'enter') {
        // Se registra aquí y no al importar: ScrollTrigger usa matchMedia al registrarse.
        gsap.registerPlugin(ScrollTrigger);
        let played = false;
        const play = () => {
          if (played) return;
          played = true;
          gsap.to(state, { p: 1, duration: total(), ease: 'none', onUpdate: render });
          if (rotation) gsap.to(el, { rotate: 0, duration: Math.min(total(), 1.4), ease: 'power3.out' });
        };
        const startAt = () => {
          const view = viewportHeight();
          const top =
            el.getBoundingClientRect().top -
            (scroller instanceof HTMLElement
              ? scroller.getBoundingClientRect().top + scroller.clientTop - scroller.scrollTop
              : -window.scrollY);
          const raw = top - view + 0.2 * Math.min(el.offsetHeight, view);
          return Math.min(raw, ScrollTrigger.maxScroll(scroller) - 1);
        };
        if (rotation) gsap.set(el, { transformOrigin: '0% 50%', rotate: rotation });
        ScrollTrigger.create({
          trigger: el,
          scroller,
          start: startAt,
          onEnter: play,
          onLeave: play,
          onRefresh: (self: ScrollTrigger) => {
            if (self.progress > 0) play();
          }
        });
      } else {
        // Modo scroll: el avance se calcula en cada scroll a partir de la posición actual del
        // texto en pantalla. No usa ScrollTrigger ni posiciones guardadas, así que no le
        // afecta que otras secciones (p. ej. ScrollExpand) cambien de altura, y no toca
        // ninguna otra animación de la página.
        const follow = typeof scrub === 'number' ? Math.min(Math.max(scrub, 0.01), 5) : 0;
        let shown = -1;
        let wanted = 0;
        let frame = 0;

        const targetProgress = () => {
          const view = viewportHeight();
          const viewTop = scroller instanceof HTMLElement ? scroller.getBoundingClientRect().top + scroller.clientTop : 0;
          const top = el.getBoundingClientRect().top - viewTop;
          const height = el.offsetHeight;
          const start = { edge: 0, line: view - 0.2 * Math.min(height, view) };
          return {
            words: progressBetween(top, start, readRange(wordAnimationEnd, height, view)),
            turn: progressBetween(top, { edge: 0, line: view }, readRange(rotationEnd, height, view))
          };
        };

        const paint = (words: number, turn: number) => {
          state.p = words;
          render();
          if (rotation) el.style.transform = turn >= 1 ? '' : `rotate(${(rotation * (1 - turn)).toFixed(3)}deg)`;
        };

        const tick = () => {
          frame = 0;
          const next = targetProgress();
          wanted = next.words;
          // Con smoothing, el texto alcanza la posición del scroll de forma gradual.
          const step = follow ? 1 - Math.exp(-1 / (60 * follow)) : 1;
          shown = shown < 0 ? wanted : shown + (wanted - shown) * step;
          if (Math.abs(wanted - shown) < 0.001) shown = wanted;
          paint(shown, next.turn);
          if (shown !== wanted) frame = requestAnimationFrame(tick);
        };
        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(tick);
        };

        if (rotation) el.style.transformOrigin = '0% 50%';
        tick();
        scroller.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        // Si el texto cambia de tamaño (fuentes, ancho), se vuelve a calcular.
        const sizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
        sizeObserver?.observe(el);

        stopLocal = () => {
          cancelAnimationFrame(frame);
          scroller.removeEventListener('scroll', schedule);
          window.removeEventListener('resize', schedule);
          sizeObserver?.disconnect();
          el.style.transform = '';
          el.style.transformOrigin = '';
        };
      }

      const resizeObserver =
        splitBy === 'lines' && typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => {
              measure();
              last.fill(-1);
              render();
            })
          : null;
      resizeObserver?.observe(textEl);

      return () => {
        stopLocal?.();
        resizeObserver?.disconnect();
        pieces.forEach(piece => {
          piece.style.opacity = '';
          piece.style.transform = '';
          piece.style.transformOrigin = '';
          piece.style.filter = '';
          piece.style.color = '';
          piece.style.willChange = '';
        });
        wrappers.forEach(wrapper => {
          wrapper.style.clipPath = '';
        });
      };
    });

    return () => mm.revert();
  }, [
    mounted,
    scrollContainerRef,
    text,
    splitBy,
    effect,
    mode,
    duration,
    highlightColor,
    enableBlur,
    baseOpacity,
    baseRotation,
    blurStrength,
    baseOffset,
    stagger,
    smoothing,
    rotationEnd,
    wordAnimationEnd
  ]);

  return (
    <Tag ref={containerRef as RefObject<never>} id={id} className={`scroll-reveal ${containerClassName}`}>
      <span ref={textRef} className={`scroll-reveal-text ${textClassName}`}>
        {splitText ?? children}
      </span>
    </Tag>
  );
};

export default ScrollReveal;
