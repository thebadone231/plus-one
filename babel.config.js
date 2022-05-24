module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // resolver: {
    //   sourceExts: ['jsx', 'js', 'ts', 'tsx'], //add here
    // },
  };
};
