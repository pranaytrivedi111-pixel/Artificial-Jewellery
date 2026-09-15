/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

interface Window {
  fbq?: {
    (...args: any[]): void;
    callMethod?: (...args: any[]) => void;
    queue?: any[];
    loaded?: boolean;
    version?: string;
    push?: (...args: any[]) => void;
  };
  _fbq?: any;
}
