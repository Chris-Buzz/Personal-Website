import { createElement, ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

/**
 * Wrapper that adds scroll-reveal to whatever it renders. `as` can be an
 * intrinsic tag ("article") or a component (e.g. react-router's Link).
 */
export default function Reveal({ as = 'div', className = '', children, ...rest }: Props) {
  const ref = useReveal();
  return createElement(as, { ref, className: `reveal ${className}`.trim(), ...rest }, children);
}
