declare namespace React {
  type ReactNode = unknown;
}

declare module 'react' {
  export type ReactNode = unknown;
  export function useCallback<T extends (...args: never[]) => unknown>(callback: T, deps: unknown[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useState<T = undefined>(initial?: T | (() => T)): [T, (value: T | ((current: T) => T)) => void];
  const React: { createElement: (...args: unknown[]) => unknown };
  export default React;
}

declare module 'react-native' {
  export const ActivityIndicator: any;
  export const Pressable: any;
  export const SafeAreaView: any;
  export const ScrollView: any;
  export const StatusBar: any;
  export const StyleSheet: { create: <T>(styles: T) => T };
  export const Switch: any;
  export const Text: any;
  export const TextInput: any;
  export const View: any;
  export function useWindowDimensions(): { width: number; height: number };
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  };
  export default AsyncStorage;
}

declare namespace JSX {
  interface Element {}
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicAttributes { key?: string | number; }
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
