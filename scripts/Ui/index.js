import { world, system, Player, GameMode, WeatherType } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "../Modules/CustomUI";
import { ChangeGameMode as setGameMode, isAdmin, isModerator, setActionBar, getAllItemStack, ItemStackToJSON, JsonToItemStack } from '../Assets/Utils';

const Aegis = {

};

world.beforeEvents.itemUse.subscribe((event) => {
  if (event.itemStack.typeId === 'aegis:menu' && event.source instanceof Player) {
    event.cancel = true;
    openUI(event.source);
  }
});

const profile = new ActionFormData()
  .back(openUI)
  .button(Aegis.Trans('aegis.ui.infraction_history'));

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


const ChangeGameMode = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.change_gamemode'))
  .back((player) => isAdmin(player) ? Tools : main.moderator(player))
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
      error.function = ChangeWeather.name;
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

const Tools = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.tools'))
  .button(Aegis.Trans('aegis.ui.floating_text'));

const FloatingText = {
  options: {
    type: 'minecraft:egg',
    families: ['aegis', 'floating_text']
  },

  main: new ActionFormData()
    .title(Aegis.Trans('aegis.ui.floating_text'))
    .back(Tools)
    .button(Aegis.Trans('aegis.ui.floating_text.add'), null, this.add.show)
    .button(Aegis.Trans('aegis.ui.floating_text.list'), null, this.list),

  list: function (player) {
    const form = new ActionFormData()
      .title(Aegis.Trans('aegis.ui.floating_text.list'))
      .back(FloatingText.main);

    player.dimension.getEntities(FloatingText.options).forEach((entity) => {
      form.button(`${entity.nameTag || 'Anonymous'}\n${Math.floor(entity.location.x)} ${Math.floor(entity.location.y)} ${Math.floor(entity.location.z)}`, null, () => FloatingText.edit(player, entity));
    });
  },

  add: new ModalFormData(),

  edit: function(player, target) {
    const { nameTag = 'Anonymous', location = {} } = target;
    new ModalFormData()
    .title(Aegis.Trans('aegis.ui.floating_text.edit'))
    .textField(Aegis.Trans('aegis.ui.floating_text.edit.name'), `${nameTag}`, `${nameTag}`)
    .textField(Aegis.Trans('aegis.ui.floating_text.edit.location'), `${location.x} ${location.y} ${location.z}`)
    .submitButton(Aegis.Trans('aegis.ui.floating_text.submit'))
    .show(player).then(res => {
      if(res.canceled) return;

      const name = res.formValues[0];
      const location = res.formValues[1].split(' ', 3).map(pos => Number(pos));

      if(!location.some(l => !l)) return player.sendMessage()
    })
  }
};