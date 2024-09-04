const startTime = Date.now();
console.warn('Preparing...');

import { world, Player } from '@minecraft/server';
import { Database } from './Assets/Database';
import { MemoryCache } from './Assets/MemoryCache';

globalThis.Aegis = (() => {
  const AegisPrefix = '§7[§eAegis§7]§r ';
  const localOpId = new Set([ '-4294967295', '-206158430207' ]);
  const aegis = {};

  const formatMessage = value =>
    typeof value === 'string'
      ? AegisPrefix + value
      : { rawtext: [{ text: AegisPrefix }, { rawtext: [value] }] };

  aegis.sendMessage = (value, target) => {
    const msg = formatMessage(value);

    if (!target) {
      world.sendMessage(msg);
    } else if (target instanceof Player) {
      target.sendMessage(msg);
    } else if (typeof target === 'function') {
      world.getAllPlayers().filter(target).forEach(player => player.sendMessage(msg));
    } else if (Array.isArray(target)) {
      target.forEach(p => p instanceof Player && p.sendMessage(msg));
    }
  };

  aegis.defaultDimension = world.getDimension('overworld');

  aegis.runCommand = command => aegis.defaultDimension.runCommand(command);

  aegis.runCommandAsync = command => aegis.defaultDimension.runCommandAsync(command);

  aegis.events = { subscribe: EventSubscribe, unsubscribe: EventUnsubscribe };

  aegis.ServerType = (() => {
    
  })() //world.getAllPlayers().some(({ id }) => ['-4294967295', '-206158430207'].includes(id)) ? 'local' : 'server';

  aegis.config = new Database('config');

  aegis.Database = Database;

  aegis.MemoryCache = MemoryCache;

  return aegis;
})();

function EventSubscribe(EventType, EventId, callback, ...options) {
  const eventType = EventType.startsWith('after') ? 'afterEvents' : EventType.startsWith('before') ? 'beforeEvents' : null;
  if (!eventType) throw new Error(`Invalid event type: "${EventType}"`);

  const event = world?.[eventType]?.[EventId]?.subscribe;
  if (!event) throw new Error(`Event id not found: ${EventId}`);
  event(callback, options.length > 0 ? options : undefined);
}

function EventUnsubscribe(EventType, EventId, callback) {
  const eventType = EventType.startsWith('after') ? 'afterEvents' : EventType.startsWith('before') ? 'beforeEvents' : null;
  if (!eventType) throw new Error(`Invalid event type: "${EventType}"`);

  const event = world?.[eventType]?.[EventId]?.unsubscribe;
  if (!event) throw new Error(`Event id not found: ${EventId}`);
  event(callback);
}

console.log(`Done... Total: ${Date.now() - startTime}ms`);

(async () => {
  const startImport_modules = Date.now();
  console.warn('Import Modules...');
  await Promise.all([
    import('./Modules/javascript-extensions'),
    import('./Modules/minecraft-extensions'),
    import('./Modules/loadConfig'),
  ]);
  console.warn(`Done... Total: ${Date.now() - startImport_modules}ms`);
  console.warn('Getting started...');
  import('./index');
})();