import { setup } from './AntiCheat/module'

(async () => {
  await import('./AntiCheat/Reach');

  setup();
})