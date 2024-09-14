import { world, GameMode } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "../../Modules/CustomUI";
import { ChangeGameMode as setGameMode } from '../../Assets/Utils';

function selectPlayer(target, callback, back, players = world.getAllPlayers().filter(p => p != target)) {
  const form = new ActionFormData()
    .title(Aegis.Trans('aegis.ui.selectPlayer'))
    .button()

  if (players.length == 0) {
    form.body(Aegis.Trans('aegis.ui.selectPlayer.notFound'))
  } else {

  if (typeof back == 'function') {
    form.back(back);
  }
  
  }
}

function findPlayer(player, callback) {
  const form = new ModalFormData()
  
  //callback.call({ players: [] }, player, )
}