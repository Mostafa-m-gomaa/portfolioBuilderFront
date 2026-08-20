import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

ensureGsapPlugins();

export { gsap, ScrollTrigger };
