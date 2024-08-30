import { world, system, Player, GameMode, WeatherType } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "../Modules/CustomUI";
import { ChangeGameMode as setGameMode, isAdmin, isModerator, setActionBar, getAllItemStack, ItemStackToJSON, JsonToItemStack } from '../Assets/Utils';

world.beforeEvents.itemUse.subscribe((event) => {
  if (event.itemStack.typeId === 'aegis:menu' && event.source instanceof Player) {
    event.cancel = true;
    openUI(event.source);
  }
});

const main = {
  member: new ActionFormData()
    .title(Aegis.Trans('aegis.ui.main.member'))
    .button(Aegis.Trans('aegis.ui.profile'), 'textures/ui/sidebar_icons/profile_screen_icon', profile.show),

  moderator: new ActionFormData(),

  admin: (player) => {
    const form = new ActionFormData();

  }
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
  .button(Aegis.Trans('aegis.ui.infraction_history'));

const ChangeGameMode = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.change_gamemode'))
  .back((player) => isAdmin(player) ? Tool : main.moderator(player))
  .button(Aegis.Trans('aegis.gamemode.adventure'), undefined, (player) => setGameMode(player, GameMode.adventure))
  .button(Aegis.Trans('aegis.gamemode.survival'), undefined, (player) => setGameMode(player, GameMode.survival))
  .button(Aegis.Trans('aegis.gamemode.creative'), undefined, (player) => setGameMode(player, GameMode.creative))
  .button(Aegis.Trans('aegis.gamemode.spectator'), undefined, (player) => setGameMode(player, GameMode.spectator));

const _ChangeWeather = new ModalFormData()
  .title(Aegis.Trans('aegis.ui.change_weather'))
  .dropdown(Aegis.Trans('aegis.ui.change_weather.select'), Object.keys(WeatherType).map(w => Aegis.Trans('aegis.weather.') + w))
  .textField(Aegis.Trans('aegis.ui.change_weather.duration'), 'ticks');

function ChangeWeather(player) {
  _ChangeWeather.show(player)
    .then(res => {
      if (res.canceled) return;
      const weather = WeatherType[Object.keys(WeatherType)[res.formValues[0]]];
      const duration = Number(res.formValues[1]) || Math.randomInt(1200, 36000);

      world.getDimension('overworld').setWeather(weather, duration);
      player.tell(Aegis.Trans('aegis.ui.change_weather.complete')?.replace('<weather>', Aegis.Trans('aegis.weather.' + weather)));
    })
    .catch((error) => {
      error.function = ChangWeather.name;
      console.error(error?.toString() || error);
    });
}

const timeType = ['sunrise', 'day', 'noon', 'sunset', 'night', 'midnight'];
const _ChangeTime = new ModalFormData()
  .title(Aegis.Trans('aegis.ui.change_time'))
  .dropdown(Aegis.Trans('aegis.ui.change_time.select'), timeType.map(t => Aegis.Trans(`aegis.time.${t}`)));

function ChangeTime(player) {
  _ChangeTime.show(player)
    .then(res => {
      if (res.canceled) return;
      world.getDimension('overword').runCommand(`time set ${timeType[res.formValues[0]]}`);
      player.tell(Aegis.Trans('aegis.change_time.complete')?.replace('<time>', Aegis.Trans(`aegis.time.${timeType[res.formValues[0]]}`)));
    });
}

const worldTool = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.world_tool'))
  .back(openUI)
  .button(Aegis.Trans('aegis.ui.change_gamemode'), null, ChangeGameMode.show)
  .button(Aegis.Trans('aegis.ui.change_weather'), null, ChangeWeather)
  .button(Aegis.Trans('aegis.ui.change_time'), null, ChangeTime);