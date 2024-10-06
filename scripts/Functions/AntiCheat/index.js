import { setup } from './module'

(async () => {
  await import('./Reach');

  setup();
})