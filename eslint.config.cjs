const globals = require ('globals')
const pluginJs = require ('@eslint/js')
const pluginJest = require('eslint-plugin-jest')

module.exports = [
  {
    files:['**/_test/*.test.js'],
    plugins: { 
      jest: pluginJest
    },
    languageOptions:{
      globals: pluginJest.environments.globals.globals
    },    
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    }
  },{

     ...pluginJs.configs.recommended,
      languageOptions:{
        globals:{
          ...globals.node,
          ...globals.jest
        },
        sourceType : "commonjs"
      },
      linterOptions:{
        noInlineConfig:false
      }

}];

