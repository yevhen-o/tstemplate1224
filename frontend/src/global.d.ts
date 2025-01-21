declare module "*?worker" {
  const WorkerFactory: {
    new (): Worker;
  };
  export default WorkerFactory;
}

interface ImportMetaEnv {
  readonly VITE_APP_NEW_RELIC_LICENSE_KEY: string;
  readonly VITE_APP_NEW_RELIC_APP_ID: number;
  readonly VITE_APP_NEW_RELIC_ACCOUNT_ID: number;
  readonly VITE_APP_NEW_RELIC_TRUST_KEY: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
