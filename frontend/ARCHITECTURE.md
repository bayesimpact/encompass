# Time Distance Standards (frontend) Architecture

## Design principles

1. **Safety**
  - TypeScript + React give us a high level of compile-time safety and confidence that if the app compiles, it probably works as expected
  - A linter prevents other common errors, stylistic ambiguity
2. **Debuggability**
  - Using CSS classes instead of inline styles makes CSS bugs easy to debug
  - Source maps + [Babydux](https://github.com/bcherny/babydux)'s logger make JavaScript bugs easy to debug
3. **Simplicity**
  - React simplifies the view layer (prefer pure components over stateful ones)
  - Babydux instead of Redux simplifies state management
  - Material-UI provides most CSS out of the box
4. **Reusability**
  - Components have generic APIs, and can be easily reused across projects

## Structure

- src/
  - *components/*
  - *constants/*
  - *services/*
  - *utils/*

## Architecture

- [*services/store.ts*] All global state is stored in the singleton `store`
  - State changes are reactive event streams, folded over the initial state to update it
  - Consumers use the `store.get` and `store.set` APIs
  - React components subscribe to `store` updates with the `withStore` API
  - No explicit Actions, Reducers usually not needed
- [*services/effects.ts*] Responses to state changes outside of components (aka. reducers)
- [*services/api.ts*] All functions that interact with the network
