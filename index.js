const composeStateFactory = stateIndex => (...updaters) =>
  updaters
    .map(updater => (updater instanceof Function ? updater : () => updater))
    .reduceRight(
      (accumulator, current) => (...args) => {
        const accumulatedState = {
          ...args[stateIndex],
          ...accumulator(...args),
        };

        const nulledAccumulatedState =
          args[stateIndex] && accumulator(...args) ? accumulatedState : null;

        const currentState = {
          ...accumulatedState,
          ...current(
            ...args.slice(0, stateIndex),
            accumulatedState,
            ...args.slice(stateIndex + 1),
          ),
        };

        const nulledCurrentState =
          nulledAccumulatedState ||
          current(
            ...args.slice(0, stateIndex),
            accumulatedState,
            ...args.slice(stateIndex + 1),
          )
            ? currentState
            : null;

        const currentTestState = current(
          ...args.slice(0, stateIndex),
          accumulatedState,
          ...args.slice(stateIndex + 1),
        );

        console.log("static state", args[stateIndex]);
        console.log("accumulator", accumulator(...args));
        console.log("accumulatedState", accumulatedState);
        console.log("nulledAccumulatedState", nulledAccumulatedState);
        console.log(
          "current",
          current(
            ...args.slice(0, stateIndex),
            accumulatedState,
            ...args.slice(stateIndex + 1),
          ),
        );
        console.log(currentState, "currentState");
        console.log("nulledCurrentState", nulledCurrentState);
        console.log("");

        // return currentState;
        // return Object.keys(currentState).length ? currentState : null;
        return nulledAccumulatedState || currentTestState
          ? {
              ...nulledAccumulatedState,
              ...currentTestState,
            }
          : null;
      },
      () => null,
    );

export const composeState = composeStateFactory(0);
export const composeDerivedStateFromProps = composeStateFactory(1);
export default composeState;
