import { world, GameMode } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "../../Modules/CustomUI";
import { ChangeGameMode as setGameMode } from '../../Assets/Utils';

const dimensions = [ 'overworld', 'nether', 'the_end' ]
// Function
const ChangeGameMode = new ModalFormData()
  .title(Aegis.Trans('aegis.ui.change_gamemode'))
  .dropdown(Aegis.Trans('aegis.ui.change_gamemode.select'), Object.keys(GameMode).map(m => Aegis.Trans(`aegis.gamemode.${m}`)))
  .submitButton(Aegis.Trans('aegis.ui.change_gamemode.submit'))

const runCommand = new ModalFormData()
  .title(Aegis.Trans('aegis.ui.runCommand'))
  .dropdown(Aegis.Trans('aegis.ui.runCommand.selectDimension'), [ ...dimensions, 'all' ])
  .textField(Aegis.Trans('aegis.ui.runCommmand.command'), '')
  
  
const worldTools = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.worldTools'))
  .button(Aegis.Trans('aegis.ui.changeWeather'))
  .button(Aegis.Trans('aegis.ui.changeTime'))
  .button(Aegis.Trans('aegis.ui.runCommand'))

// Menu
const memberMenu = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.member'))

const moderatorMenu = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.moderator'))

const adminMenu = new ActionFormData()
  .title(Aegis.Trans('aegis.ui.admin'))


export { ChangeGameMode }