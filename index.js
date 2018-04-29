const composeStateFactory = stateIndex => (...updaters) =>
  updaters
    .map(updater => (updater instanceof Function ? updater : () => updater))
    .reduceRight(
      (accumulator, current) => (...args) => {
        const accumulatedState = accumulator(...args);
        const currentState = current(
          ...args.slice(0, stateIndex),
          { ...args[stateIndex], ...accumulatedState },
          ...args.slice(stateIndex + 1),
        );

        return currentState
          ? { ...args[stateIndex], ...accumulatedState, ...currentState }
          : null;
      },
      () => null,
    );

export const composeState = composeStateFactory(0);
export const composeDerivedStateFromProps = composeStateFactory(1);
export default composeState;
