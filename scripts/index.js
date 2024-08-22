const plugins = [
  'Events/WorldInitialize/index'
];

const startTime = Date.now();

Promise.allSettled(plugins.map(plugin => import(plugin))).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.warn(`Plugin ${plugins[index]} loaded successfully.`);
    } else {
      console.error(`Failed to load plugin ${plugins[index]}: ${result?.reason?.toString() ?? result?.reason}`);
    }
  });
});

console.warn(`Done! [Processing time]: ${Date.now() - startTime}`);