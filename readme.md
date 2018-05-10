# ✍️ compose-state

`compose-state` is a library that composes multiple state updaters in React.

<img width="488" src="https://user-images.githubusercontent.com/4934193/39415633-8ed13b02-4bfa-11e8-9e0e-b706ae68fdbc.png" alt="example" />

`compose-state` works with the standard `setState` parameters – objects or functions – so you don’t have to learn any new syntax. It’s also compatible with React’s new [`getDerivedStateFromProps`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops) lifecycle method.

## Use

### Install

`yarn add compose-state` or `npm install compose-state`

### Import

```jsx
import composeState from 'compose-state';

// or

import {
  composeState,
  composeDerivedStateFromProps,
} from 'compose-state';
```

### API

#### `composeState([updaters])`

Returns an updater that can be used with `setState`. Calling this produces the same result as calling or accessing each given updater from right to left, merging each partial state. If a given updater is a function, its `prevState` value is the previous state merged with the current partial state.

##### Arguments

| Name | Type | Description |
| - | - | - |
| `[updaters]` | `(...Updater)` | Functions that can be used with `setState`, or partial state objects |

##### Example

```jsx
// Current state: { value: 0 }

const add1 = s => ({ value: s.value + 1 });

this.setState(composeState(add1, add1, add1));

// This is the same as
// this.setState(add1);
// this.setState(add1);
// this.setState(add1);

// New state: { value: 3 }
```

#### `composeDerivedStateFromProps([updaters])`

Returns an updater that can be set as a component's `getDerivedStateFromProps` static value. Calling this produces the same result as calling or accessing each given updater from right to left, merging each partial state. If a given updater is a function, its `prevState` value is the previous state merged with the current partial state.

##### Arguments

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| `[updaters]` | `(...Updater)` | Functions that can be set as a component's `getDerivedStateFromProps` static value, or partial state objects |

## Benefits

### Simplify your updaters and React code

Let's say you want to call `setState` and do two things

1. Increment a score value by 1
2. Log the current time to an array

Both of these updaters need to be functional, since they rely on the previous state for their return values.

```jsx
const updateScore = s => ({ score: s.score + 1 });
const logTime = s => ({ log: [...s.log, Date.now()] });
```

Normally, we would need to call `setState` for both of these functions

```jsx
class Game extends Component {
  onScore = () => {
    this.setState(updateScore);
    this.setState(logTime);
  };
  // ...
}
```

...or we rewrite the two updaters into one larger function.

```jsx
const updateScoreLogTime = s => ({
  score: s.score + 1,
  log: [...s.log, Date.now()],
});
```

But with `compose-state`, we can keep these two updaters independent, _and_ we won't have to bulk up our component code with more `setState` calls.

```jsx
const updateScoreLogTime = composeState(updateScore, logTime);

class Game extends Component {
  onScore = () => {
    this.setState(updateScoreLogTime);
  };
  // ...
}
```

`compose-state` isn't dependent on React at all, it's just a big reducer function. This allows you to build and compose as many updaters as you want while keeping your actual component code simple and maintainable.

### Easily mix functional and object updaters

`compose-state` accepts both objects and functions, just like `setState`. This allows you to mix static and dynamic updaters without increasing the complexity of any individual parameter.

```jsx
const defaultValue = { value: 0 };
const incrementOther = s => ({ other: s.other + 1 });

this.setState(
  composeState(defaultValue, incrementOther)
);
```

### Compatibility with getDerivedStateFromProps

`compose-state` comes with a `composeDerivedStateFromProps` function to use with React's new [`getDerivedStateFromProps`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops) lifecycle method.

```jsx
const updater1 = (nextProps, prevState) => {
  // ...
}
const updater2 = (nextProps, prevState) => {
  // ...
}

class App extends Component {
  static getDerivedStateFromProps = composeDerivedStateFromProps(
    updater1, updater2
  )
  // ...
}
```

### It's just normal, [boring](https://twitter.com/jevakallio/status/987062864002342912) React

While more formal state managers push developers away from controlling state in React, `compose-state` simply enhances state control methods that are primitive to the platform.

`compose-state` is a lot like [Classnames](https://github.com/JedWatson/classnames). It's a helper function that makes `setState` calls more declarative and easier to construct, just like how Classnames is a helper function that makes `className` values more declarative and easier to construct.

## Further reading

[Functional setState is the future of React](https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b) by [Justice Mba](https://twitter.com/Daajust)

[Best kept React secret: you can declare state changes separately from the component classes.](https://twitter.com/dan_abramov/status/824308413559668744) by [Dan Abramov](https://twitter.com/dan_abramov)
