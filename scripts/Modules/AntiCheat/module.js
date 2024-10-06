import { world, system } from "@minecraft/server";
import { isAdmin, isModerator } from "../../Assets/Utils";
const Modules = [];

function registerModule(id, options, ...event) {
  const { showError = true, breakOnError = false, skipAdmin = false, skipModerator = false } = options || {};
  const tickEvents = event.filter(e => e.runInterval);
  const worldEvents = event.filter(e => e.event);

  Modules.push({
    id: id,
    showError,
    breakOnError,
    skipAdmin,
    skipModerator,
    tickEvents: tickEvents.length > 0 ? tickEvents : undefined,
    worldEvents: worldEvents.length > 0 ? worldEvents : undefined
  });
}

function setup() {
  Modules.forEach(module => {
    try {
      const config = Aegis.config.get(module.id);
      if (!config) throw new Error("Configuration not found!");

      if (module.tickEvents) {
        module.tickEvents.forEach(e => {
          const intervalId = system.runInterval(() => {
            try {
              e.callback();
            } catch (error) {
              if (module.showError) {
                console.error(`Error in module ${module.id}:`, error);
              }
              if (module.breakOnError) {
                system.clearRun(intervalId);
              }
            }
          }, e.interval);
        });
      }

      if (module.worldEvents) {
        module.worldEvents.forEach(e => {
          const eventType = e.type == 'before' ? 'beforeEvents' : 'afterEvents';
          const event = world?.[eventType]?.[e.event];

          if (!event) throw new Error("Event does not exist");

          event[config.enable ? 'subscribe' : 'unsubscribe'](eventData => {
            try {
              if ((module.skipAdmin && isAdmin(eventData.player ?? eventData.source))
                || (module.skipModerator && isModerator(eventData.player ?? eventData.source))) return;
              e.callback(eventData);
            } catch (error) {
              if (module.showError) {
                console.error(`Error in module ${module.id}:`, error);
              }
              if (module.breakOnError) {
                throw error;
              }
            }
          });
        });
      }
    } catch (error) {
      console.error(`Failed to setup module ${module.id}:`, error);
    }
  });
}

// Example usage:
registerModule("exampleModule",
  { showError: true, breakOnError: false, skipAdmin: true },
  { runInterval: true, interval: 20, callback: () => console.log("Tick event") },
  { event: "playerJoin", callback: (eventData) => console.log("Player joined:", eventData.player.name) }
);

export { Modules, registerModule, setup };