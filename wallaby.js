module.exports = function() {
  return{
    files: [
      'src/**/*.js',
    ],
    tests: [
      '__test__/**/*.test.js',
    ],
    env: {
      type: 'node',
    },
    testFramework: 'jest',
  };
};