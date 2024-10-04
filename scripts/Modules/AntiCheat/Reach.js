import { world, Player, GameMode } from "@minecraft/server";
import { flag } from "../../Assets/Utils";

const config = Aegis.config.get('anti-reach');

function reach(event) {
  if (event.player.getGameMode() != GameMode.survival) return;
  const distance = Math.distanceVector3(event.player.location, event.block.location);

  if (distance > config.maxDistance) {
    flag(event.player, 'anti-reach', 'A',);
    event.cancel = true;
  }
}

export default {
  enable: () => {
    world.beforeEvents.playerBreakBlock.subscribe(reach);
    world.beforeEvents.playerPlaceBlock.subscribe(reach);
  },
  disable: () => {
    world.beforeEvents.playerBreakBlock.unsubscribe(reach);
    world.beforeEvents.playerPlaceBlock.unsubscribe(reach);
  }
}