import { Player, world } from '@minecraft/server';
import { prefix, commands } from '../CustomCommands/handler';
import Tags from '../Data/Tags';
const PlayersData = new WeakMap();

const config = Aegis.config.get('chat-manager');
const TransKey = 'handler.chat.';
world.beforeEvents.chatSend.subscribe(event => {
  const { sender: player, message } = event;
  event.cancel = true;

  if (message.startsWith(prefix)) {
    const args = parseArgs(message.slice(prefix.length));
    const commandName = args?.shift()?.toLowerCase() || "";

    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      if (hasPermission(player, command.permission)) {
        command.func(player, args);
      } else {
        player.sendMessage("§cYou don't have permission to use this command.");
      }
    } else {
      player.sendMessage("§cUnknown command. Type !help for a list of commands.");
    }
    return;
  }

  if (message.length > config['max-length']) {
    Aegis.sendMessage(Aegis.Trans(TransKey + 'maxLength'));
    return;
  }
  
  if(isMute(player)) return;

  const playerData = PlayersData.get(player) ?? {};
});

function isMute(player) {
  if(!(player instanceof Player)) return;

  if(player.hasTag(Tags.disable.sendMessage)) {
    Aegis.sendMessage(Aegis.Trans(TransKey + 'isMute'))
    return true;
  }

  const data = player.getDynamicProperty('data-mute');
  if(!data) return false;

  const endTime = data.endTime;

  if(typeof endTime == 'number' && endTime < Date.now()) {
    Aegis.sendMessage(Aegis.Trans(TransKey + 'isMuteDate').replace('<endTime>', new Date(endTime).toLocaleString(Aegis.config.get('region')?.area)), player);
    return true;
  }


  return false;
}