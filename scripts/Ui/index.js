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
  .button(Aegis.Trans('aegis.gamemode.survival'), undefined, (player) => player.setGameMode(GameMode.survival))
  .button(Aegis.Trans('aegis.gamemode.creative'), undefined, (player) => player.setGameMode(GameMode.creative))
  .button(Aegis.Trans('aegis.gamemode.spectator'), undefined, (player) => player.setGameMode(GameMode.spectator));

const ChangWeather = (player) => new ModalFormData()
  .title(Aegis.Trans('aegis.ui.change_weather'))
  .dropdown(Aegis.Trans('aegis.ui.change_weather.select'), Object.keys(WeatherType).map(w => Aegis.Trans('aegis.weather.') + w))
  .textField(Aegis.Trans('aegis.ui.change_weather.duration'), 'ticks')
  .show(player)
  .then(res => {
    if(res.canceled) return;

    const weather = WeatherType[Object.keys(WeatherType)[res.formValues[0]]]
    const duration = Number(res.formValues[1]) || Math.randomInt(1200, 36000);

    world.getDimension('overworld').setWeather(weather, duration);
    player.tell('')
  })