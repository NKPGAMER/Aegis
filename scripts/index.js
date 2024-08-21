import './Events/WorldInitialize/index';

const Plugins = [
  'Events/WorldInitialize/index'
]

Plugins.forEach(importPlugin);

function importPlugin(path) {
  try {
    import(path);
    console.info(`Import ${path}....success`);
  } catch (error) {
    console.error(`Import ${path}....fail.\nError: ${error?.toString() ?? error}`);
  };
}

console.warn("§aOK");