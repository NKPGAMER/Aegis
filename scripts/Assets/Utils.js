import { world, system, ItemStack } from '@minecraft/server';
const PlayersData = new WeakMap();

const ChangeGameMode = async function (player, mode) {
  player['Q2hhbmdlckdhbWVNb2Rl'] = true;
  const { successCount } = await player.runCommandAsync(`gamemode ${mode}`);
  player['Q2hhbmdlckdhbWVNb2Rl'] = false;
  
  if (successCount == 0) {
    console.error(`Changing the game mode of ${player.name} failed!`)
  }
}

const setActionBar = function (player, msg, options) {
  const { id = null, prioritize = false } = options || {};
  const currentTime = Date.now();
  if(typeof msg != "string") return;
  const data = (player['YWN0aW9uQmFy'] || []).filter(t => t.expiryTime >= currentTime);
  const expiryTime = currentTime + 1000; /* Message will expire after 1s */
  const newItem = { text, prioritize, id, expiryTime };
  
  if(id) {
    const existingIndex = data.findIndex(t => t.id === id);
    if (existingIndex !== -1) {
      data[existingIndex] = newItem;
    } else {
      data.push(newItem);
    }
  } else {
    newItem['id'] = data.length + 1;
    data.push(newItem);
  }
  
  const actionBarText = data
    .sort((a, b) => (b.prioritize - a.prioritize) || (a.id - b.id))
    .map(i => i.text)
    .join("§r\n");

  player.onScreenDisplay.setActionBar(actionBarText);
  player['YWN0aW9uQmFy'] = data;
}

const flag = (player, module, type, detail, maxVl, punishment) => {
  
}

function getAllItemStack(player) {
  return new Promise((resolve) => {
    const container = player.getComponent("inventory").container;
    
    const itemList = Array.from({ length: container.size })
      .map((_, i) => ({ itemStack: container.getItem(i), slot: i }))
      .filter(item => item.itemStack != null);

    resolve(itemList);
  });
}

function ItemStackToJSON(itemStack) {
  if (!(itemStack instanceof ItemStack)) {
    throw new Error("The parameter must be an instance of ItemStack");
  }

  const newData = {
    name: itemStack.nameTag,
    amount: itemStack.amount,
    typeId: itemStack.typeId,
    lores: itemStack.getLore(),
    enchantments: []
  };

  if (itemStack.hasComponent('minecraft:enchantable')) {
    newData.enchantments = itemStack.getComponent('minecraft:enchantable').getEnchantments();
  }

  return JSON.stringify(newData);
}

function JsonToItemStack(value) {
  try {
    const data = JSON.parse(value);
    const itemStack = new ItemStack(data.typeId, data.amount);

    itemStack.nameTag = data.name;
    itemStack.setLore(data.lores);
    
    if (itemStack.hasComponent('minecraft:enchantable')) {
      itemStack.getComponent('minecraft:enchantable').addEnchantments(data.enchantments);
    }
    
    return itemStack;
  } catch (error) {
    console.error(`Error converting JSON to ItemStack: ${error.message}`);
    return null;
  }
}

export {
  changeGameMode,
  setActionBar,
  getAllItemStack,
  ItemStackToJSON,
  JsonToItemStack
}