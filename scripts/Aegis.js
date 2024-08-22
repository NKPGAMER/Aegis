import { world } from '@minecraft/server';
import { Database } from './Assets/Database';
import { MemoryCache } from './Assets/MemoryCache';

globalThis['Aegis'] = (aegis => {
  const AegisPrefix = '§7[§eAegis§7]§r ';

  aegis['sendMessage'] = (value) => {
    const msg = typeof value === 'string'
      ? AegisPrefix + value
      : { rawtext: [{ text: AegisPrefix }, { rawtext: [value] }] };
    world.sendMessage(msg);
  };

  aegis['defaultDimension'] = world.getDimension('overworld');

  aegis['runCommand'] = (command) => aegis['defaultDimension'].runCommand(command);

  aegis['runCommandAsync'] = (command) => aegis['defaultDimension'].runCommandAsync(command);

  aegis['events'] = {
    subscribe: EventSubscribe,
    unsubscribe: EventUnsubscribe
  };

  aegis['ServerType'] = (() => world.getAllPlayers().filter(({ id }) => id === '-4294967295' || id === '-206158430207').length > 0 ? 'local' : 'server')();

  aegis['config'] = new Database('config');

  aegis['Database'] = Database;

  aegis['MemoryCache'] = MemoryCache;

  return aegis;
})({});

function EventSubscribe(EventType, EventId, callback, ...options) {
  const eventType = EventType.startsWith('after')
    ? 'afterEvents'
    : EventType.startsWith('before')
      ? 'beforeEvents'
      : void 0;
  if (!eventType) throw new Error(`Invalid event type: \"${EventType}\"`);

  const event = world?.[eventType]?.[EventId]?.['subscribe'];
  if (!event) throw new Error(`Event id not found: ${EventId}`);
  event(callback, options.length > 0 ? [...options] : void 0);
}

function EventUnsubscribe(EventType, EventId, callback) {
  const eventType = EventType.startsWith('after')
    ? 'afterEvents'
    : EventType.startsWith('before')
      ? 'beforeEvents'
      : void 0;
  if (!eventType) throw new Error(`Invalid event type: \"${EventType}\"`);

  const event = world?.[eventType]?.[EventId]?.['unsubscribe'];
  if (!event) throw new Error(`Event id not found: ${EventId}`);
  event(callback);
}

(async () => {
  await import('./Modules/javascript-extensions');
  await import('./Modules/minecraft-extensions');
  import('./index')
})()