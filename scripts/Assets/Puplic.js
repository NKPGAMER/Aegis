import { world, system } from "@minecraft/server";
import AegisTag from "../Data/Tags";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (!event.player.hasTag(AegisTag.disable.breakBlock)) return;

  event.cancel = true;
  Aegis.sendMessage(Aegis.Trans('aegis.permission.break_block.warn'), event.player);
});

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
  if (!event.player.hasTag(AegisTag.disable.placeBlock)) return;

  event.cancel = true;
  Aegis.sendMessage(Aegis.Trans('aegis.permission.place_block.warn'), event.player);
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  if (!event.player.hasTag(AegisTag.disable.interactBlock)) return;

  event.cancel = true;
  Aegis.sendMessage(Aegis.Trans('aegis.permission.interact_block.warn'), event.player);
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
  if (!event.player.hasTag(AegisTag.disable.interactBlock)) return;

  event.cancel = true;
  Aegis.sendMessage(Aegis.Trans('aegis.permission.interact_entity.warn'), event.player);
});