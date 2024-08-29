import { Player } from '@minecraft/server';
import * as MinecraftUI from '@minecraft/server-ui';

class ActionFormData {
  #buttons;
  #form;
  #hande;
  constructor(jsonData) {
    this.#buttons = [];
    this.#form = new MinecraftUI.ActionFormData();

    if (jsonData) {
      this.parseJSON(jsonData);
    }
  }

  parseJSON(json) {
    try {
      const data = JSON.parse(json);
      if (typeof data.title == 'string') {
        this.#form.title = data.title;
      }
      if (typeof data.body == 'string') {
        this.#form.body = data.body;
      }
      if (Array.isArray(data.buttons)) {
        this.#buttons = [...this.#buttons, ...data.button];
      }
    } catch (error) {
      console.error(error?.toString() ?? error);
    }
  }

  button(label, icon, callback, show) {
    this.#buttons.push({
      label: typeof label == 'string' ? label : "",
      icon: typeof icon == 'string' ? icon : void 0,
      callback: typeof callback == 'function' ? callback : Function.Empty,
      show: typeof show == 'boolean' ? show : true
    });
    return this;
  }

  title(value) {
    this.#form.title = typeof value == 'string' ? value : void 0;
    return this;
  }

  body(value) {
    this.#form.body = typeof value == 'string' ? value : void 0;
    return this;
  }

  show(player, options) {
    if (!(player instanceof Player)) throw new Error("");
    for (const button of this.#buttons) {
      if (button.show) {
        this.#form.button(button.label, button.icon);
      }
    }

    if (options.wait) {
      this.#form.waitShow(player).then(this.#hande);
    } else {
      this.#form.show(player).then(this.#hande);
    }

    return this;
  }

  #hande(result) {
    if (result.canceled) return;
    this.#buttons[result.selection]?.callback(player);
  }
}