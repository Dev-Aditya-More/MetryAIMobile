module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./",    
            "@/api": "./api",
            "@/components": "./components",
            "@/hooks": "./hooks",
            "@/utils": "./utils",
            "@/types": "./types",
            "@/screens": "./app",  
          },
        },
      ],
    ],
  };
};
