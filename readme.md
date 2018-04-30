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

## Simplify your updaters and classes

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
    this.setState(updateScore);
  }
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
  }
  // ...
}
```

# Usage

```jsx
import composeState from 'compose-state';

// or

import {
  composeState,
  composeDerivedStateFromProps
} from 'compose-state';
```
