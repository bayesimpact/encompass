# Contributing
## Install and run locally

```bash
cd frontend
# Install dependencies
yarn
# Recompile when anything changes
yarn watch
```

Then, open [http://localhost:8081]() in your browser.

## Editor

I suggest editing this project using [VSCode](https://code.visualstudio.com/). VSCode will automatically suggest a small set of extensions that will surface type and lint errors directly in your editor. It will also auto-format files on save, reducing the need to manually fix lint errors.

## Tips

- To debug React performance issues:

  1. Install the [React Chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), and check *Highlight Updates* to visualize which components are re-rendering
  2. Add `?react_perf` to the browser URL, run a Performance profile, and expand User Timings to see a flame graph of exactly what work is being done while re-rendering
  3. Yarn install `why-did-you-update` and add it to index.tsx to visualize why components are re-rendering

- To debug data changes in the Babydux store, add the [`withLogger` decorator](https://github.com/bayesimpact/encompass/blob/7c3c91b/src/services/store.ts#L102) to the store and open your devtools console

- To debug tricky unit test failures:
  1. Set a breakpoint in your code with the `debugger` pragma
  2. Run `yarn test:debug`
