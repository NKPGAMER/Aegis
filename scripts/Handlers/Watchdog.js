import { system } from '@minecraft/server';

const cancel = !!Aegis.config.get('watchdogTerminate') ?? true;

function watchdogTerminate(event) {
  event.cancel = cancel;
  console.warn(Aegis.Trans('event.Handlers.Watchdog')?.replace('<reason>', event.terminateReason))
}

system.afterEvents.watchdogTerminate.subscribe(watchdogTerminate);