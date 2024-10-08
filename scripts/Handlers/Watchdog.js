import { system } from '@minecraft/server';

const cancel = !!Aegis.config.get('watchdogTerminate') ?? true;

function watchdogTerminate(event) {
  event.cancel = cancel;
  console.warn(Aegis.Trans('event.Handlers.Watchdog')?.replace('<reason>', event.terminateReason))
}

system.beforeEvents.watchdogTerminate.subscribe(watchdogTerminate);