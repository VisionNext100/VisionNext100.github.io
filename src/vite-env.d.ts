/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID?: string
  /** e.g. https://yourcode.goatcounter.com/count — omit to disable analytics */
  readonly VITE_GOATCOUNTER_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
