# compose-state

`compose-state` is a library to compose multiple `setState` or `getDerivedStateFromProps` updaters in React.

```jsx
const add1 = s => ({ value: s.value + 1 });
const times2 = s => ({ value: s.value * 2 });

// This
this.setState(add1);
this.setState(times2);

// Is the same as
this.setState(composeState(times2, add1));
```

`compose-state` accepts any valid `setState` parameters – objects, functions, or `null` – and executes them in the standard compositional right-to-left order.

# Install

`yarn add compose-state`

`npm install --save compose-state`

# Benefits

## Simplify your updaters and React code

Let's say you want to call `setState` and do two things

1. Increment a score value in your state by 1
2. Log the current time to an array in your state

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

## Easily mix functional and object updaters

`compose-state` accepts both objects and functions, just like `setState`. This allows you to mix static and dynamic updaters without increasing the complexity of any individual parameter.

```jsx
const defaultValue = { value: 0 };
const incrementOther = s => ({ other: s.other + 1 });

this.setState(
  composeState(defaultValue, incrementOther)
);
```

## Compatibility with getDerivedStateFromProps

`compose-state` comes with a `composeDerivedStateFromProps` function to use with React's new [getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops) lifecycle method.

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

# Usage

```jsx
import composeState from 'compose-state';

// or

import {
  composeState,
  composeDerivedStateFromProps,
} from 'compose-state';
```

# Further reading

[Functional setState is the future of React](https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b) by [Justice Mba](https://twitter.com/Daajust)

[Best kept React secret: you can declare state changes separately from the component classes.](https://twitter.com/dan_abramov/status/824308413559668744) by [Dan Abramov](https://twitter.com/dan_abramov)
