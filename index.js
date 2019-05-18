const composeStateFactory = stateIndex => (...updaters) =>
  updaters.reduceRight(
    (accumulator, current) => (stateOrProps1, stateOrProps2) => {
      const accumulatedState = accumulator(stateOrProps1, stateOrProps2);
      const currentState =
        current instanceof Function
          ? stateIndex === 0
            ? current({ ...stateOrProps1, ...accumulatedState }, stateOrProps2)
            : current(stateOrProps1, { ...stateOrProps2, ...accumulatedState })
          : current;

      return currentState || accumulatedState
        ? { ...accumulatedState, ...currentState }
        : null;
    },
    () => null
  );

export const composeState = composeStateFactory(0);
export const composeDerivedStateFromProps = composeStateFactory(1);
export default composeState;
