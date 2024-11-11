const globals = require('globals');
const pluginJs = require('@eslint/js');
const pluginJest = require('eslint-plugin-jest');
const pluginStylisticJs = require('@stylistic/eslint-plugin-js');

module.exports = [
  {
    files : ['**/_test/*.test.js'],
    plugins : { 
      jest : pluginJest
    },
    languageOptions : {
      globals : pluginJest.environments.globals.globals
    },    
    rules : {
      'jest/no-disabled-tests' : 'warn',
      'jest/no-focused-tests' : 'error',
      'jest/no-identical-title' : 'error',
      'jest/prefer-to-have-length' : 'warn',
      'jest/valid-expect' : 'error',
    }
  },
  {

    ...pluginJs.configs.recommended,
    languageOptions : {
      globals : {
        ...globals.node,
        ...globals.jest
      },
      sourceType : 'commonjs'
    },
    linterOptions : {
      noInlineConfig : false
    }

  },
  {
    plugins : {
      '@stylistic/js' : pluginStylisticJs
    },
    rules : {
      '@stylistic/js/indent' : ['error', 2],
      '@stylistic/js/block-spacing' : ['warn', 'always'],
      '@stylistic/js/comma-spacing' : ['warn', { before : false, after : true }],
      '@stylistic/js/computed-property-spacing' : ['warn', 'never'],
      '@stylistic/js/brace-style' : ['warn', '1tbs', { 'allowSingleLine' : true }],
      '@stylistic/js/function-call-spacing' : ['warn', 'never'],
      '@stylistic/js/linebreak-style' : ['warn', 'unix'],
      '@stylistic/js/no-extra-semi' : ['warn'],
      '@stylistic/js/no-mixed-spaces-and-tabs' : ['warn'],
      '@stylistic/js/no-multi-spaces' : ['warn'],
      '@stylistic/js/rest-spread-spacing' : ['warn'],
      '@stylistic/js/semi' : ['warn', 'always'],
      '@stylistic/js/semi-spacing' : ['warn', {before : false, after : false}],
      '@stylistic/js/space-before-blocks' : ['warn', 'always'],
      '@stylistic/js/arrow-parens' : ['warn', 'always'],
      '@stylistic/js/arrow-spacing' : ['warn', {before : true, after : true}],
      '@stylistic/js/key-spacing' : ['warn', { beforeColon : true, afterColon : true }],
      '@stylistic/js/quotes' : ['warn', 'single'],
    }
  }
];

