/**
 * @author NKPGAMER
 */

/*
 * Array.js
 */

if (!Array.prototype.includesObject) {
  Array.prototype.includesObject = function (value) { return this.some((element) => Object.keys(value).every((key) => element[key] === value[key])); };
}

if (!Array.prototype.delete) {
  Array.prototype.delete = function (index) {
    if (index > -1) {
      this.splice(index, 1);
    }
  };
}

/*
 * Console.js
 */
const Logs = [];
const { log, warn, error, info } = console;

const createLogMethod = (type, originalMethod) => (...msg) => {
  Logs.push({ type, message: msg.join("\n") });
  originalMethod.apply(console, msg);
};

Object.defineProperties(console, {
  log: { value: createLogMethod("log", log) },
  warn: { value: createLogMethod("warn", warn) },
  error: { value: createLogMethod("error", error) },
  info: { value: createLogMethod("info", info) },

  classError: {
    value(className, functionName, error) {
      const stack = `[${className}::${functionName}]`;
      let errorMessage = 'undefined';

      if (error instanceof Error) {
        errorMessage = `${error.message.replace(info, '').trim()} ${error.stack.trim()}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error(`${stack} ${errorMessage}`);
    }
  },

  getLogs: { value: () => Logs }
});

/*
 * Date.js
 */

if (!Date.prototype.isLeapYear) {
  Date.prototype.isLeapYear = function () {
    const year = this.getFullYear();
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
  };
}

if (!Date.prototype.addDay) {
  Date.prototype.addDay = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setDate(this.getDate() + value);
  };
}

if (!Date.prototype.addHours) {
  Date.prototype.addHours = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setHours(this.getHours() + value);
    return this;
  };
}

if (!Date.prototype.addMilliseconds) {
  Date.prototype.addMilliseconds = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setMilliseconds(this.getMilliseconds() + value);
  };
}

if (!Date.prototype.addMinutes) {
  Date.prototype.addMinutes = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setMinutes(this.getMinutes() + value);
    return this;
  };
}

if (!Date.prototype.addMonths) {
  Date.prototype.addMonths = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setMonth(this.getMonth() + value);
    return this;
  };
}

if (!Date.prototype.addSeconds) {
  Date.prototype.addSeconds = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setSeconds(this.getSeconds() + value);
    return this;
  };
}

if (!Date.prototype.addYears) {
  Date.prototype.addYears = function (value) {
    if (typeof value != 'number') throw new TypeError();
    this.setFullYear(this.getFullYear() + value);
    return this;
  };
}

/*
 * Error.js
 */
Object.defineProperties(Error.prototype, {
  toString: {
    value() {
      const name = this.name ?? "Error";
      return `${name}: ${this.message.trim()} ${this.stack.trim()}`;
    }
  }
});

/*
 * Map.js
 */
/**
 * @fileoverview Custom Map prototype methods.
 * @author NKPGAMER
 */

Object.defineProperties(Map.prototype, {
  merge: {
    value: function (map, replaceExisting) {
      const mergedMap = new Map([...this]);
      for (const [key, value] of map) {
        if (!replaceExisting && mergedMap.has(key)) continue;
        mergedMap.set(key, value);
      }
      return mergedMap;
    }
  },
  find: {
    value: function (callback) {
      for (const [key, value] of this) {
        if (callback(value, key, this)) {
          return value;
        }
      }
      return undefined;
    }
  },
  deleteKeyRegex: {
    value: function (regex) {
      this.forEach((value, key) => {
        if (key.match(regex)) this.delete(key);
      });
    }
  },
  shift: {
    value: (function () {
      const firstKey = this.keys().next().value;
      const firstValue = this.get(firstKey);
      this.delete(firstKey);

      return [firstKey, firstValue];
    })
  }
});


/*
 * Math.js
 */
const { floor, hypot, max, min } = Math;

if (!Math.randomInt) {
  Math.randomInt = function (min, max) {
    return floor(Math.random() * (max - min + 1)) + min;
  };
}

if (!Math.average) {
  Math.average = function (numbers) {
    if (!Array.isArray(numbers) || !numbers.length) return;

    return numbers.reduce((sum, num) => sum + (typeof num === 'number' ? num : 0), 0) / numbers.length;
  };
}

if (!Math.tickToSecond) {
  Math.tickToSecond = function (ticks) {
    return ticks / 20;
  };
}

if (!Math.secondToTick) {
  Math.secondToTick = function (seconds) {
    return seconds * 20;
  };
}

Object.defineProperties(Math, {
  floor: {
    value: (data) => {
      if (typeof data === 'number') return floor(data);
      if (typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, floor(v)]));
      console.classError("Math", "floor", "data must be a number or object<number>");
    }
  },
  tickToSecond: {
    value: (tick) => tick * 0.05
  },
  secondToTick: {
    value: (seconds) => seconds * 20
  },
  distance: {
    value: (v1, v2, includeY = true) => {
      const { x: x1, y: y1, z: z1 } = v1;
      const { x: x2, y: y2, z: z2 } = v2;
      return hypot(x1 - x2, z1 - z2, includeY ? y1 - y2 : 0);
    }
  },
  isInRange: {
    value: ({ x, y, z }, { location1, location2 }) => {
      const [xMin, xMax] = [min(location1.x, location2.x), max(location1.x, location2.x)];
      const [yMin, yMax] = [min(location1.y, location2.y), max(location1.y, location2.y)];
      const [zMin, zMax] = [min(location1.z, location2.z), max(location1.z, location2.z)];
      return x >= xMin && x <= xMax && y >= yMin && y <= yMax && z >= zMin && z <= zMax;
    }
  },
  isWithinView: {
    value: (targetPosition, observerPosition, observerRotation, maxViewAngle) => {
      const direction = {
        x: targetPosition.x - observerPosition.x,
        y: targetPosition.y - observerPosition.y,
        z: targetPosition.z - observerPosition.z
      };
      const magnitude = hypot(direction.x, direction.y, direction.z);
      const normalized = {
        x: direction.x / magnitude,
        z: direction.z / magnitude
      };
      const dotProduct = normalized.x * Math.cos(observerRotation.y) + normalized.z * Math.sin(observerRotation.y);
      const angleToTarget = Math.acos(dotProduct) * (180 / Math.PI);
      return angleToTarget < maxViewAngle / 2;
    }
  }
});

/*
 * Number.js
 */

if (!Number.prototype.ticksToSeconds) {
  Number.prototype.ticksToSeconds = function () { return this / 20; };
}

if (!Number.prototype.secondsToTicks) {
  Number.prototype.secondsToTicks = function () { return this * 20; };
}

/*
 * Object.js
 */
if (!Object.prototype.equal) {
  Object.prototype.equal = function (obj) {
    if (!(obj instanceof Object)) return false;
    const props1 = Object.getOwnPropertyNames(this);
    const props2 = Object.getOwnPropertyNames(obj);
    if (props1.length !== props2.length) return false;

    return props1.every(propName => this[propName] === obj[propName]);
  };
}
/*
 * String.js
 */

if (!String.randomColor) {
  String.randomColor = function (str, colors = []) {
    if (typeof str != 'string' || !Array.isArray(colors) || colors.length == 0) return str;
    return this.replace(/§./g, "").split('').map(w => colors[Math.floor(Math.random() * colors.length) || w]).join('');
  };
}

if (!String.isJSON) {
  String.isJSON = function (str) {
    try {
      JSON.parse(str);
      return false;
    } catch {
      return true;
    }
  };
}

if (!String.hexToEmoji) {
  String.hexToEmoji = function (str) {
    const num = parseInt(str, 16);
    if (isNaN(num) || num < 57344 || num > 63743) return "?";
    return String.fromCharCode(num);
  };
}

if (!String.generateRandomString) {
  String.generateRandomString = function (length, allowUpperCase = true, allowNumbers = true, allowSpecialChars = true) {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (allowNumbers) chars += "0123456789";
    if (allowUpperCase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (allowSpecialChars) chars += "!@#$%^&*()_+-=[]{};:'\"\\|,./<>?";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
}

if (!String.generateUUID) {
  String.generateUUID = function () {
    const randomPart = Math.random().toString(16).slice(2);
    const timePart = Date.now().toString(16);
    return `${timePart}-${randomPart}-4${randomPart.slice(0, 3)}-9${randomPart.slice(3, 6)}-${randomPart.slice(6, 12)}`;
  };
}

if (!String.toRegex) {
  String.toRegex = function (str) {
    const regexPattern = /^\/(.*?)\/([gimsuy]*)$/;
    const match = regexString.match(regexPattern);

    if (!match) throw new Error("Invalid regex string format");
    const [_, pattern, flags] = match;
    return new RegExp(pattern, flags);
  };
}

/*
 * function.js
 */

if (!Function.prototype.Empty) {
  Function.prototype.Empty = function () { };
}

if (!Function.prototype.forceType) {
  Function.prototype.forceType = function (...expectedTypes) {
    const originalFunction = this;
    return (...args) => {
      if (!expectedTypes.every((type, i) => checkType(type, args[i]))) {
        throw new TypeError(`Function "${originalFunction.name || "Anonymous"}" receives incorrect parameters.`);
      }
      return originalFunction.apply(null, args);
    };
  };
}


if (!Function.prototype.validateArgs) {
  Function.prototype.validateArgs = function (...ArgumentTypes) {
    const originalFunction = this;
    return (...args) => {
      if (!ArgumentTypes.every((type, i) => args[i] instanceof Type)) throw new TypeError(`Function "${originalFunction.name || "Anonymous"}" receives incorrect parameters.`);
      return originalFunction.apply(null, args);
    };
  };
};

const typeChecks = {
  bigint: v => typeof v === 'bigint',
  string: v => typeof v === 'string',
  number: v => typeof v === 'number',
  boolean: v => typeof v === 'boolean',
  object: v => v && typeof v === 'object',
  function: v => typeof v === 'function',
  symbol: v => typeof v === 'symbol',
  undefined: v => v === undefined,
  array: Array.isArray,
  json: String.isJSON
};

function checkType(type, variable) {
  if (typeof type !== 'string') throw new TypeError('The "type" must be a string');
  if (type.startsWith('?')) return variable == null || checkType(type.slice(1), variable);
  return type.split('|').some(t => checkSingleOrCompound(t, variable));
}

function checkSingleOrCompound(type, variable) {
  return type.endsWith('[]')
    ? Array.isArray(variable) && variable.every(item => checkSingle(type.slice(0, -2), item))
    : checkSingle(type, variable);
}

function checkSingle(type, variable) {
  return typeChecks[type]?.(variable) ?? false;
}