import React, { Component } from "react";
import renderer from "react-test-renderer";
import composeState from ".";

const valueAdd1 = ({ value = 0 }) => ({ value: value + 1 });

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

// test("no value", t());
// test("no value, default state", t({ state: { value: 0 } }));
test("empty object", t({ updaters: [{}] }));
// test("empty object, default state", t({ updaters: [{}], state: { value: 0 } }));
// test("object", t({ updaters: [{ value: 1 }] }));
// test(
//   "object, update property",
//   t({ updaters: [{ value: 1 }], state: { value: 0 } }),
// );
// test(
//   "object, update other property",
//   t({ updaters: [{ value: 1 }], state: { otherValue: 0 } }),
// );
test("null function", t({ updaters: [() => null] }));
// test(
//   "null function, default state",
//   t({ updaters: [() => null], state: { value: 0 } }),
// );
