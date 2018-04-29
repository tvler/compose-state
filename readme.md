# `compose-state`

`compose-state` is a function to compose `setState` updaters in React.

```jsx
const add1 = s => ({ value: s.value + 1 });
const times2 = s => ({ value: s.value * 2 });

// This
this.setState(add1);
this.setState(times2);

// Is the same as
this.setState(composeState(times2, add1));
```
