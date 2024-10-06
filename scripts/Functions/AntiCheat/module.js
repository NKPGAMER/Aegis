import { world, system } from "@minecraft/server";
import { isAdmin, isModerator } from "../../Assets/Utils";

const Modules = new Map();
const ActiveHandlers = new Map();

const registerModule = (id, options = {}, ...events) => {
  const { showError = true, breakOnError = false, skipAdmin = false, skipModerator = false } = options;
  Modules.set(id, {
    id,
    showError,
    breakOnError,
    skipAdmin,
    skipModerator,
    events: events.map(e => ({ ...e, type: e.runInterval ? 'tick' : 'world' }))
  });
};

const handleError = (module, error) => {
  if (module.showError) console.error(`Error in module ${module.id}:`, error);
  if (module.breakOnError) throw error;
};

const shouldSkipEvent = (module, eventData) => {
  const player = eventData.player ?? eventData.source;
  return (module.skipAdmin && isAdmin(player)) || (module.skipModerator && isModerator(player));
};

const setupTickEvent = (module, event) => {
  const intervalId = system.runInterval(() => {
    try {
      event.callback();
    } catch (error) {
      handleError(module, error);
    }
  }, event.interval);
  return () => system.clearRun(intervalId);
};

const setupWorldEvent = (module, event, config) => {
  const eventType = event.type === 'before' ? 'beforeEvents' : 'afterEvents';
  const worldEvent = world?.[eventType]?.[event.event];
  
  if (!worldEvent) throw new Error(`Event ${event.event} does not exist`);

  const handler = eventData => {
    if (shouldSkipEvent(module, eventData)) return;
    try {
      event.callback(eventData);
    } catch (error) {
      handleError(module, error);
    }
  };

  if (config.enable) {
    worldEvent.subscribe(handler);
    return () => worldEvent.unsubscribe(handler);
  }
  return () => {};
};

const setup = () => {
  Modules.forEach((_, id) => {
    try {
      updateModule(id);
    } catch (error) {
      console.error(`Failed to setup module ${id}:`, error);
    }
  });
};

const updateModule = (id) => {
  const module = Modules.get(id);
  if (!module) throw new Error(`Module ${id} not found`);

  const config = Aegis.config.get(id);
  if (!config) throw new Error(`Configuration for module ${id} not found`);

  // Clear existing handlers
  const existingHandlers = ActiveHandlers.get(id) || [];
  existingHandlers.forEach(handler => handler());
  ActiveHandlers.set(id, []);

  // Setup new handlers
  const newHandlers = module.events.map(event => {
    return event.type === 'tick' 
      ? setupTickEvent(module, event) 
      : setupWorldEvent(module, event, config);
  });

  ActiveHandlers.set(id, newHandlers);
  console.log(`Module ${id} updated successfully`);
};

// Example usage:
registerModule("exampleModule",
  { showError: true, breakOnError: false, skipAdmin: true },
  { runInterval: true, interval: 20, callback: () => console.log("Tick event") },
  { event: "playerJoin", callback: (eventData) => console.log("Player joined:", eventData.player.name) }
);

export { Modules, registerModule, setup, updateModule };