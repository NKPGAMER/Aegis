import { system } from '@minecraft/server';

system.afterEvents.watchdogTerminate.subscribe((eventData) => {
  eventData.cancel = true;
  console.warn(`Server Crasher!\nReason: ${eventData.terminateReason}`);
});