# Frontend

To launch : `npm run dev`

To launch tests : `npm run test`

To get tests coverage : `npm run test:coverage`

To launch docs server : `npm run docs` 

This command will allow to watch dynamic changes in React components. To watch dynamic changes in redux actions/selectors, also run in other shells:

```
documentation build --document-exported src/frontend/modules/\*\*/\*.selectors.js -f md --markdown-toc=false -w > docs/selectors.md 
documentation build --document-exported src/frontend/modules/\*\*/\*.actions.js -f md --markdown-toc=false -w > docs/actions.md
```
(requires module [documentation](http://documentation.js.org/) installed globally : `npm install -g documentation`)

To build static docs : `npm run docs:build`

Docs builder : <https://react-styleguidist.js.org/>
