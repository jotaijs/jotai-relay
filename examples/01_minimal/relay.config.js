module.exports = {
  language: 'typescript',
  src: `${__dirname}/src`,
  schema: `${__dirname}/data/schema.graphql`,
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
};
