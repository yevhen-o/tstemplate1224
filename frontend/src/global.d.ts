declare module "*?worker" {
  const WorkerFactory: {
    new (): Worker;
  };
  export default WorkerFactory;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
