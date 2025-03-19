module.exports = {
  // Line length
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Quotes and strings
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',

  // Semicolons
  semi: true,

  // Trailing commas
  trailingComma: 'es5',

  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',

  // Object properties
  proseWrap: 'preserve',

  // HTML, JSX, and Vue
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,

  // End of line
  endOfLine: 'lf',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Overrides for specific file types
  overrides: [
    {
      files: '*.md',
      options: {
        tabWidth: 2,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.html', '*.jsx', '*.tsx'],
      options: {
        printWidth: 120,
      },
    },
  ],

  // Plugins
  plugins: [],
};