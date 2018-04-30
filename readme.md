# compose-state

`compose-state` is a library to compose `setState` or `getDerivedStateFromProps` updaters in React.

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

# Usage

```
import composeState from 'compose-state';

// or

import {
  composeState,
  composeDerivedStateFromProps
} from 'compose-state';
```
