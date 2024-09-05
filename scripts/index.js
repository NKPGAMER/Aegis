const plugins = [
  'Events/WorldInitialize/index'
];

const startTime = Date.now();

const loadPlugins = async () => {
  const results = await Promise.allSettled(plugins.map(plugin => import(plugin)));
  
  results.forEach((result, index) => {
    const pluginName = plugins[index];
    if (result.status === 'fulfilled') {
      console.warn(`Plugin ${pluginName} loaded successfully.`);
    } else {
      console.error(`Failed to load plugin ${pluginName}: ${result.reason?.message ?? result.reason}`);
    }
  });
  
  console.warn(`Modules are ready. Total: ${(Date.now() - startTime).toFixed(2)}ms`);
};

loadPlugins();