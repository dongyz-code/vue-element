import type { Component, VNode } from 'vue';

export interface FieldRenderConfig {
  component: Component;
  props: Record<string, any>;
  children?: VNode | VNode[];
}

export type FieldRenderContext = Record<string, any> & {
  value: any;
  onChange: (...args: any[]) => void;
  placeholder?: string;
  disabled?: any;
};
