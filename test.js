import React, { Component } from "react";
import renderer from "react-test-renderer";
import { composeState, composeDerivedStateFromProps } from "./index.js";

const setState = ({ name, expected, updaters = [], state, props } = {}) => {
  test(`composeState ${name}`, () => {
    const getInstance = () => {
      class TestComponent extends Component {
        state = state;
        render = () => null;
      }
      return renderer.create(<TestComponent {...props} />).getInstance();
    };

    const withoutCompose = getInstance();
    const withCompose = getInstance();

    [...updaters].reverse().forEach(updater => {
      withoutCompose.setState(updater);
    });

    withCompose.setState(composeState(...updaters));

    expect(withCompose.state).toEqual(expected);
    expect(withCompose.state).toEqual(withoutCompose.state);
  });
};

const deriveState = ({
  name,
  expected,
  updaters = [],
  state = {},
  props,
} = {}) => {
  test(`composeDerivedStateFromProps ${name}`, () => {
    const getInstance = () => {
      class TestComponent extends Component {
        static getDerivedStateFromProps = composeDerivedStateFromProps(
          ...updaters,
        );
        state = state;
        render = () => null;
      }
      return renderer.create(<TestComponent {...props} />).getInstance();
    };

    const withCompose = getInstance();

    expect(withCompose.state).toEqual(expected);
  });
};

setState({
  name: "no value",
  expected: null,
});
setState({
  name: "no value, default state",
  expected: { value: 0 },
  state: { value: 0 },
});
setState({ name: "empty object", expected: {}, updaters: [{}] });
setState({
  name: "empty object, default state",
  expected: { value: 0 },
  updaters: [{}],
  state: { value: 0 },
});
setState({ name: "object", expected: { value: 1 }, updaters: [{ value: 1 }] });
setState({
  name: "object, update property",
  expected: { value: 1 },
  updaters: [{ value: 1 }],
  state: { value: 0 },
});
setState({
  name: "object, update other property",
  expected: { otherValue: 0, value: 1 },
  updaters: [{ value: 1 }],
  state: { otherValue: 0 },
});
setState({ name: "null function", expected: null, updaters: [() => null] });
setState({
  name: "null function, default state",
  expected: { value: 0 },
  updaters: [() => null],
  state: { value: 0 },
});
setState({
  name: "function",
  expected: { value: 1 },
  updaters: [() => ({ value: 1 })],
});
setState({
  name: "function, default state",
  expected: { value: 1 },
  updaters: [() => ({ value: 1 })],
  state: { value: 0 },
});
setState({
  name: "function, update property",
  expected: { value: 1 },
  updaters: [() => ({ value: 1 })],
  state: { value: 0 },
});
setState({
  name: "function, other property",
  expected: { otherValue: 0, value: 1 },
  updaters: [() => ({ value: 1 })],
  state: { otherValue: 0 },
});
setState({
  name: "function, update prevState",
  expected: { value: 1 },
  updaters: [s => ({ value: s.value + 1 })],
  state: { value: 0 },
});
setState({
  name: "function, update prevState, keep other state",
  expected: { value: 1, otherValue: -1 },
  updaters: [s => ({ value: s.value + 1 })],
  state: { value: 0, otherValue: -1 },
});
setState({
  name: "function, update prevState multiple times",
  expected: { value: 5 },
  updaters: Array.from(Array(5), () => s => ({ value: s.value + 1 })),
  state: { value: 0 },
});
setState({
  name: "function, update prevState multiple times, keep other state",
  expected: { value: 5, otherValue: -1 },
  updaters: Array.from(Array(5), () => s => ({ value: s.value + 1 })),
  state: { value: 0, otherValue: -1 },
});
setState({
  name: "function, update multiple times, update other state",
  expected: { value: 5, other: 1 },
  updaters: [
    s => ({ other: s.other + 1 }),
    ...Array.from(Array(5), () => s => ({ value: s.value + 1 })),
  ],
  state: { value: 0, other: 0 },
});
setState({
  name:
    "function, update multiple times, update other state, keep another default state",
  expected: { value: 5, other: 1, another: -1 },
  updaters: [
    s => ({ other: s.other + 1 }),
    ...Array.from(Array(5), () => s => ({ value: s.value + 1 })),
  ],
  state: { value: 0, other: 0, another: -1 },
});
setState({
  name: "function, update other state, update multiple times",
  expected: { value: 5, other: 1 },
  updaters: [
    ...Array.from(Array(5), () => s => ({ value: s.value + 1 })),
    s => ({ other: s.other + 1 }),
  ],
  state: { value: 0, other: 0 },
});
setState({
  name: "object then function",
  expected: { value: 1, otherValue: 1 },
  updaters: [s => ({ value: s.value + 1 }), { otherValue: 1 }],
  state: { value: 0 },
});
setState({
  name: "function then object",
  expected: { value: 1, otherValue: 1 },
  updaters: [{ otherValue: 1 }, s => ({ value: s.value + 1 })],
  state: { value: 0 },
});
setState({
  name: "function then object then function",
  expected: { value: 2, otherValue: 1 },
  updaters: [
    s => ({ value: s.value + 1 }),
    { otherValue: 1 },
    s => ({ value: s.value + 1 }),
  ],
  state: { value: 0 },
});
setState({
  name: "bunch of stuff then null",
  expected: { value: 1, anotherValue: 2, otherValue: 1 },
  updaters: [
    null,
    { otherValue: 1 },
    s => ({ value: s.value + 1 }),
    { anotherValue: 2 },
  ],
  state: { value: 0 },
});
setState({
  name: "null then bunch of stuff",
  expected: { value: 1, anotherValue: 2, otherValue: 1 },
  updaters: [
    { otherValue: 1 },
    s => ({ value: s.value + 1 }),
    { anotherValue: 2 },
    null,
  ],
  state: { value: 0 },
});
setState({
  name: "times2, plus1",
  expected: { value: 2 },
  updaters: [s => ({ value: s.value * 2 }), s => ({ value: s.value + 1 })],
  state: { value: 0 },
});
setState({
  name: "times2, plus1, keep other state",
  expected: { value: 2, otherValue: 420 },
  updaters: [s => ({ value: s.value * 2 }), s => ({ value: s.value + 1 })],
  state: { value: 0, otherValue: 420 },
});
setState({
  name: "null, times2, plus1",
  expected: { value: null },
  updaters: [
    s => ({ value: null }),
    s => ({ value: s.value * 2 }),
    s => ({ value: s.value + 1 }),
  ],
  state: { value: 0 },
});
setState({
  name: "times2, plus1, otherValueTimes2",
  expected: { value: 2, otherValue: 4 },
  updaters: [
    s => ({ value: s.value * 2 }),
    s => ({ value: s.value + 1 }),
    s => ({ otherValue: s.otherValue * 2 }),
  ],
  state: { value: 0, otherValue: 2 },
});
setState({
  name: "props",
  expected: { value: 1 },
  updaters: [(s, p) => ({ value: s.value + p.value })],
  state: { value: 0 },
  props: { value: 1 },
});
setState({
  name: "props multiple times",
  expected: { value: 5 },
  updaters: Array.from(Array(5), () => (s, p) => ({
    value: s.value + p.value,
  })),
  state: { value: 0 },
  props: { value: 1 },
});
setState({
  name: "null updaters, default state",
  expected: { value: 1 },
  updaters: [() => null],
  state: { value: 1 },
});
setState({
  name: "function of one state prop, function of other state prop",
  expected: { value: 2, otherValue: 2 },
  updaters: [
    s => ({ value: s.value + 1 }),
    s => ({ otherValue: s.otherValue + 1 }),
  ],
  state: { value: 1, otherValue: 1 },
});
setState({
  name: "object, function of one state prop, function of other state prop",
  expected: { value: 2, otherValue: 2, anotherValue: 1 },
  updaters: [
    s => ({ value: s.value + 1 }),
    s => ({ otherValue: s.otherValue + 1 }),
    { anotherValue: 1 },
  ],
  state: { value: 1, otherValue: 1 },
});
setState({
  name: "function of one state prop, function of other state prop, object",
  expected: { value: 2, otherValue: 2, anotherValue: 1 },
  updaters: [
    { anotherValue: 1 },
    s => ({ value: s.value + 1 }),
    s => ({ otherValue: s.otherValue + 1 }),
  ],
  state: { value: 1, otherValue: 1 },
});
setState({
  name: "objects",
  expected: { value: 1, otherValue: 1, anotherValue: 1 },
  updaters: [{ anotherValue: 1 }, { value: 1 }, { otherValue: 1 }],
  state: { value: 1, otherValue: 1 },
});
deriveState({ name: "no value", expected: {} });
deriveState({
  name: "no value, default state",
  expected: { value: 0 },
  state: { value: 0 },
});
deriveState({ name: "empty object", expected: {}, updaters: [{}] });
deriveState({
  name: "from state: times2, plus1, otherValueTimes2",
  expected: { value: 2, otherValue: 4 },
  updaters: [
    (p, s) => ({ value: s.value * 2 }),
    (p, s) => ({ value: s.value + 1 }),
    (p, s) => ({ otherValue: s.otherValue * 2 }),
  ],
  state: { value: 0, otherValue: 2 },
});
deriveState({
  name: "object",
  expected: { value: 1 },
  updaters: [{ value: 1 }],
});
deriveState({
  name: "object, other object",
  expected: { value: 1, otherValue: 1 },
  updaters: [{ value: 1 }, { otherValue: 1 }],
});
deriveState({
  name: "from props: times2, times2, plus1, otherValueTimes2",
  expected: { value: 4, otherValue: 4 },
  updaters: [
    (p, s) => ({ value: s.value * 2 }),
    (p, s) => ({ value: s.value * 2 }),
    p => ({ value: p.value + 1 }),
    p => ({ otherValue: p.otherValue * 2 }),
  ],
  props: { value: 0, otherValue: 2 },
});
