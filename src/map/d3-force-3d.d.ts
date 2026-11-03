// d3-force-3d ships without types. These cover only what orbitMap.ts uses; its API matches d3-force with an
// extra z axis (https://github.com/vasturiano/d3-force-3d).
declare module 'd3-force-3d' {
  export interface Node3D {
    index?: number;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
  }
  export interface Link3D<N> {
    source: string | N;
    target: string | N;
  }
  export interface Force<N> {
    (alpha: number): void;
  }
  export interface Simulation<N extends Node3D> {
    force(name: string, force: Force<N> | null): this;
    tick(iterations?: number): this;
    stop(): this;
  }
  export function forceSimulation<N extends Node3D>(nodes: N[], numDimensions?: 1 | 2 | 3): Simulation<N>;

  export interface LinkForce<N, L> extends Force<N> {
    id(fn: (node: N) => string): this;
    distance(fn: (link: L) => number): this;
    strength(value: number): this;
  }
  export function forceLink<N, L extends Link3D<N>>(links: L[]): LinkForce<N, L>;

  export interface ManyBodyForce<N> extends Force<N> {
    strength(fn: (node: N) => number): this;
    distanceMax(value: number): this;
  }
  export function forceManyBody<N>(): ManyBodyForce<N>;

  export interface CollideForce<N> extends Force<N> {
    radius(fn: (node: N) => number): this;
  }
  export function forceCollide<N>(): CollideForce<N>;

  export interface AxisForce<N> extends Force<N> {
    strength(value: number): this;
  }
  export function forceX<N>(x?: number): AxisForce<N>;
  export function forceY<N>(y?: number): AxisForce<N>;
  export function forceZ<N>(z?: number): AxisForce<N>;
}
