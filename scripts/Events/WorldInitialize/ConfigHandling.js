import data from '../../Data/Config.js';

export default function(replace, clearData) {
  const c =  new Aegis.Database('config');
  if(clearData) c.clear();
  for (const [key, value] of c.entries()) {
    if(!c.has(key) || replace) c.set(key, value);
  }
}