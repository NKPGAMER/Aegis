console.warn('Getting started...');

const paths = [
  'Events/System/index',
  'Events/ItemUse/index',
  //'test.js',
  'ai.js',
  'CustomCommands/index'
];

const startTime = Date.now();

(async () => {
  paths.forEach(path => import(path).catch(err => console.error(err.message, err.stack)))
  console.warn(`Done... Total: ${(Date.now() - startTime).toFixed(2)}ms`)
})();