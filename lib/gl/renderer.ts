// One OGL renderer and one fullscreen triangle, in the persistent #gl host.
// Imported dynamically after first paint; the driver owns every uniform.
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { bakeAtlas } from "./atlas";
import { fragment, vertex } from "./shader";

export type Uniforms = Record<string, { value: number | number[] | Texture }>;

export type Screen = {
  canvas: HTMLCanvasElement;
  uniforms: Uniforms;
  dpr: number;
  /** 1 by default; the driver lowers it when frames run long (software GL, slow GPUs). */
  quality: number;
  resize: (w: number, h: number) => void;
  render: () => void;
  /** GPU ms per frame, collected only when created with `timing: true`. */
  gpuTimes: number[];
  destroy: () => void;
};

const MAX_PIXELS = 6e6; // a ceiling for very large monitors, on top of the DPR cap

export function createScreen(
  host: HTMLElement,
  { phone, timing = false, dprCap }: { phone: boolean; timing?: boolean; dprCap?: number },
): Screen | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ dpr: 1, alpha: false, antialias: false, depth: false, powerPreference: "default" });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.classList.add("gl-canvas");
  canvas.setAttribute("aria-hidden", "true");

  const atlas = new Texture(gl, {
    image: bakeAtlas(phone ? 160 : 240),
    flipY: false,
    generateMipmaps: true,
    minFilter: gl.LINEAR_MIPMAP_LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  });

  const uniforms: Uniforms = {
    uRes: { value: [1, 1] },
    uDpr: { value: 1 },
    uTime: { value: 0 },
    uAtlas: { value: atlas },
    uS: { value: 92 },
    uS0: { value: 92 },
    uMargin: { value: 36 },
    uScroll: { value: 0 },
    uSun: { value: [0, 0] },
    uSunR: { value: 210 },
    uOpen: { value: 0.05 },
    uBack: { value: 0.12 },
    uGlint: { value: 1 },
    uVel: { value: 0 },
    uRim: { value: phone ? 0 : 1 },
    uDust: { value: phone ? 0 : 1 },
    uHero: { value: [-1e5, -1e5] },
    uHeroOpen: { value: 0 },
    uBeam: { value: 0 },
    uBeamLen: { value: 1e5 },
    uLock: { value: 1e9 },
    uHot: { value: [0, 0, 0, 0] },
    uJali: { value: 0 },
    uBand: { value: 0 },
    uSwing: { value: 0 },
    uRetract: { value: 0 },
    uDay: { value: 0 },
    uTap: { value: [0, 0, -10, 0] },
    uQuiet: { value: new Array(32).fill(0) },
    uQuietN: { value: 0 },
  };

  let program: Program;
  try {
    program = new Program(gl, { vertex, fragment, uniforms, depthTest: false, depthWrite: false });
  } catch {
    return null;
  }
  // OGL only warns on a failed compile or link; treat that as "no GL" so the poster shows.
  if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) return null;
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  host.appendChild(canvas);

  // GPU timing (lab and gate only): EXT_disjoint_timer_query_webgl2.
  const gl2 = gl as WebGL2RenderingContext;
  const ext = timing && renderer.isWebgl2 ? gl2.getExtension("EXT_disjoint_timer_query_webgl2") : null;
  const pending: WebGLQuery[] = [];
  const gpuTimes: number[] = [];

  const cap = dprCap ?? (phone ? 1.5 : 2);
  const screen: Screen = {
    canvas,
    uniforms,
    dpr: 1,
    quality: 1,
    gpuTimes,
    resize(w, h) {
      const dpr = Math.min(window.devicePixelRatio || 1, cap, Math.sqrt(MAX_PIXELS / (w * h))) * screen.quality;
      screen.dpr = dpr;
      renderer.dpr = dpr;
      renderer.setSize(w, h);
      uniforms.uRes.value = [w, h];
      uniforms.uDpr.value = dpr;
    },
    render() {
      if (ext) {
        while (pending.length && gl2.getQueryParameter(pending[0], gl2.QUERY_RESULT_AVAILABLE)) {
          const q = pending.shift()!;
          if (!gl2.getParameter(ext.GPU_DISJOINT_EXT)) gpuTimes.push(gl2.getQueryParameter(q, gl2.QUERY_RESULT) / 1e6);
          gl2.deleteQuery(q);
        }
        const q = gl2.createQuery()!;
        gl2.beginQuery(ext.TIME_ELAPSED_EXT, q);
        renderer.render({ scene: mesh });
        gl2.endQuery(ext.TIME_ELAPSED_EXT);
        pending.push(q);
        return;
      }
      renderer.render({ scene: mesh });
    },
    destroy() {
      program.remove();
      gl.deleteTexture(atlas.texture);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
  return screen;
}
