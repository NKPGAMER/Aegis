import { world, system, GameMode, WeatherType } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "../Modules/CustomUI";
import { ChangeGameMode, isAdmin, isModerator, setActionBar, getAllItemStack, ItemStackToJSON, JsonToItemStack } from '../Assets/Utils';

const main = {
  member: new ActionFormData()
    .title(Aegis.Trans('aegis.ui.main.member'))
    .button(Aegis.Trans('aegis.ui.profile'), 'textures/ui/sidebar_icons/profile_screen_icon', profile.show),

  moderator: new ActionFormData(),

  admin: new ActionFormData()
};

function openUI(player) {
  system.run(() => {
    if (isAdmin(player)) {
      main.admin.show(player);
    } else if (isModerator(player)) {
      main.moderator.show(player);
    } else {
      main.member.show(player);
    }
  });
}

const profile = new ActionFormData()
  .back(openUI)
  .button(Aegis.Trans('aegis.ui.infraction_history'))

const ChangeGameMode = new ActionFormData()
  .back((player) => isAdmin(player) ? Tool : main.moderator(player))
  .button(Aegis.Trans('aegis.gamemode.adventure'), undefined, (player) => player.setGameMode(GameMode.adventure))
  .button(Aegis.Trans('aegis.gamemode.surival'), undefined, (player) => player.setGameMode(GameMode.survival))
  .button(Aegis.Trans('aegis.gamemode.creative'), undefined, (player) => player.setGameMode(GameMode.creative))
  .button(Aegis.Trans('aegis.gamemode.spectator'), undefined, (player) => player.setGameMode(GameMode.spectator));

const Ch