module.exports = {
  apps : [
    {
      name      : 'back',
      script    : 'backend'
    },

    {
      name      : 'mid-1',
      script    : 'middleware',
      env       : {
        PORT    : 4000
      }
    },
    {
      name      : 'mid-2',
      script    : 'middleware',
      env       : {
        PORT    : 4001
      }
    },
  ],
};
