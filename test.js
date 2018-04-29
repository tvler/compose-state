import React, { Component } from "react";
import renderer from "react-test-renderer";
import composeState from ".";

const t = ({ updaters = [], state } = {}) => () => {
  class TestComponent extends Component {
    state = state;
    render = () => null;
  }

  const withoutCompose = renderer.create(<TestComponent />).getInstance();
  const withCompose = renderer.create(<TestComponent />).getInstance();

  updaters.forEach(updater => {
    withoutCompose.setState(updater);
  });

  withCompose.setState(composeState(...updaters));

  expect(withCompose.state).toEqual(withoutCompose.state);
};

test("no value", t());
test("no value, default state", t({ state: { value: 0 } }));
test("empty object", t({ updaters: [{}] }));
test("empty object, default state", t({ updaters: [{}], state: { value: 0 } }));
test("object", t({ updaters: [{ value: 1 }] }));
test(
  "object, update property",
  t({ updaters: [{ value: 1 }], state: { value: 0 } }),
);
test(
  "object, update other property",
  t({ updaters: [{ value: 1 }], state: { otherValue: 0 } }),
);
test("null function", t({ updaters: [() => null] }));
test(
  "null function, default state",
  t({ updaters: [() => null], state: { value: 0 } }),
);
test("function", t({ updaters: [() => ({ value: 1 })] }));
test(
  "function, default state",
  t({ updaters: [() => ({ value: 1 })], state: { value: 0 } }),
);
test(
  "function, update property",
  t({ updaters: [() => ({ value: 1 })], state: { value: 0 } }),
);
test(
  "function, other property",
  t({ updaters: [() => ({ value: 1 })], state: { otherValue: 0 } }),
);
test(
  "function, update prevState",
  t({
    updaters: [s => ({ value: s.value + 1 })],
    state: { value: 0 },
  }),
);
test(
  "function, update prevState, keep other property",
  t({
    updaters: [s => ({ value: s.value + 1 })],
    state: { value: 0, otherValue: -1 },
  }),
);
test(
  "function, update prevState multiple times",
  t({
    updaters: Array.from(Array(5), () => s => ({ value: s.value + 1 })),
    state: { value: 0 },
  }),
);
test(
  "function, update prevState multiple times, keep other property",
  t({
    updaters: Array.from(Array(5), () => s => ({ value: s.value + 1 })),
    state: { value: 0, otherValue: -1 },
  }),
);
