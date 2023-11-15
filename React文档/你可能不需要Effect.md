# 你可能不需要 Effect

## 什么是副作用

React 中的副作用是指那些不是由组件渲染产生的副作用，比如发起网络请求、添加和删除事件监听、设置定时器等等。

React 中的副作用是一种逃脱 React 编程范式的手段。因为在 React 中，通常建议组件只关注数据和渲染，而不涉及副作用。

但是在某些情况下，比如数据获取、事件监听等，可能需要副作用来实现，React 提供了 `useEffect` 钩子来处理副作用，但同时可能使代码更加难以理解和维护。

React 中的副作用可以让组件与一些外部系统（比如非 React 组件、网络请求、DOM等）同步。如果不涉及外部系统（例如只是想在一些 `props` 或 `state` 改变时更新组件状态），那么就不需要使用 Effect 。如果删除不必要的 Effects，会让代码更易于追踪、运行更快，同时减少出错的可能性。

## 如何移除不必要的副作用

两种常见的不需要的副作用的场景：

1. **在渲染时，不需要使用 Effects 来转换数据**。

   举个例子，假设你想在显示列表之前对其进行过滤。你可能会写一个 Effect，在列表变化时更新 `state`。然而这样做是低效的。当你更新状态时，React 会先调用组件（组件即函数）来计算应该显示什么内容，然后，React 会”提交“这些更改到 DOM。再然后，React 会运行 Effects。如果你的 Effect 也立即更新了 `state`，那么就会重新从头开始整个过程！为了避免不必要的渲染，应该在组件的顶层转换所有数据，在 `props` 或 `state` 发生变化时，（转换）代码会自动重新执行。

2. **不需要使用 Effect 来处理用户事件**。

   举个例子，假设你想在用户购买产品时发送一个`/api/buy`的 POST 请求并显示通知。在“购买”按钮的点击事件处理函数中，你可以确切的知道发生了什么。而当一个 Effect  运行时，你无法知道用户做了什么（例如，点击了哪个按钮）。这就是为什么通常会在相应的事件处理函数中处理用户事件的原因。也就是说，在事件处理函数中处理用户事件比在 Effect 中处理更加直接、简单、准确。

在与外部系统同步时，确实需要使用 Effect。例如，你可以编写一个 Effect 来将一个 jQuery widget 与 React state 同步。

也可以使用 Effects 来获取数据：例如，可以将搜索结果与当前的索索查询同步。需要注意的是，现代的框架提供了更高效的内置数据获取机制，像比如直接在组件中编写 Effects，更加便捷和优秀。

### 根据 `props` 或 `state` 更新状态

假设你有一个组件，其中包含两个状态（`state`）变量：`firstName` 和 `lastName`，你想通过将这两个状态变量连接起来计算出 `fullName`。此外，每当 `firstName` 或 `lastName` 更改时，`fullName` 也会更新。你的第一反应可能是添加一个 `fullName` 状态变量，并在 Effect 中更新它：
```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  
  // 🔴 避免：冗余状态和不必要的 Effect
  // 当 `firstName` 或 `lastName` 发生变化时，组件会重新渲染，
  // 但此时 effect 并未执行，组件使用旧的 `fullName` 值进行整个重新渲染过程，
  // 当重新渲染完成，`effect` 开始执行，更新 `fullName` 的值，由于 state 发生变化，组件又开始重新从头开始渲染
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  
  //...
}
```

这种做法复杂且不够高效：它会使用一个“过时”的 `fullName` 值进行整个渲染，然后立即使用更新后的值进行重新渲染。因此，可以去掉 `fullName` 状态变量和 Effect。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Talor');
  const [lastName, setLastName] = useState('Swift');
  
  // ✅ Good: 在渲染期间计算
  const fullName = firstName + ' ' + lastName;
}
```

**当某个值可以从已有的 `props` 或 `state` 中计算出来时，[就不要将其存储在 `state` 中](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state)，相反，在渲染期间进行计算。** 这样可以是代码更快（避免了额外的“级联”更新），更简单（删除了一下代码），并且更少出错（避免了不同状态变量不同步一起的错误）。

### 缓存昂贵的计算

这个组件通过接收 `props` 中的 `todos` 进行过滤，根据 `filter prop` 计算出 `visibleTodos`。你可能会像之前的例子中一样，将结果存储在 `state` 中，并在 Effect 中更新。这样做是可行的，但通常不建议这样做，因为这样会增加代码的复杂度，并是性能变慢。相反，建议在需要使用 `visibleTodos` 时直接通过 `props` 计算出结果并使用，避免额外的状态管理和更新。

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  
  // 🔴 避免：冗余状态和不必要的 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  });
  // ...
}
```

这个例子中的 `state` 和 Effect 都是不必要且低效的，首先，移除它们：

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  
  // 如果 `getFilteredTodos()` 不慢，那这样就可以了
  const visibleTodos = getFilteredTodos(todos, filter);
}
```

通常情况下，这段代码是没有问题的。但是，如果 `getFilteredTodos()` 很慢，或者你有很多 `todo`，那么当一些不相关的状态变量（例如`newTodo`）改变时，你可能不希望重新计算 `getFilteredTodos()`。

这个时候，你可以通过将这个昂贵的计算包装在 `useMemo Hook` 中来进行缓存（或“记忆化”）。

```jsx
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // 只有在 `todos` 或 `filter` 变化时，才会重新运行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  
  // ...
}
```

或者，写成一行代码：

```jsx
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // 只有在 `todos` 或 `filter` 变化时，才会重新运行
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  
  // ...
}
```

**这段代码告诉 React，只有在 `todos` 或 `filter` 改变时，你才希望内部函数重新运行**。React 会在初始（第一次）渲染时记住 `getFilteredTodos()` 函数的返回值，在下一次渲染中，React 会检查 `todos` 或 `filter` 是否与上一次相同。如果它们与上一次相同，`useMemo` 会返回上一次存储的结果。但如果它们不同，React 会再次调用内部函数（并存储其结果）。

`useMemo` 的回调函数是在渲染期间运行，所以只适用于[纯计算](https://react.dev/learn/keeping-components-pure)。也就是说这个函数不应该有任何副作用，否则可能会导致意外行为。

`useMemo` 不会让第一次渲染更快，它只会帮助你跳过不必要的更新工作。

### 当 `prop` 改变时重置所有 `state`

这是一个 `ProfilePage` 组件，接受一个 `userId prop`。页面包含一个评论输入框，并且你使用一个 `comment` 状态变量来保存它的值。有一天，你发现一个问题：当你从一个用户的个人资料页面导航到另一个时，评论状态没有被重置。结果，很容易在错误的用户个人资料页面上意外发布评论。为了解决这个问题，你希望在每次 `userId` 变化时清除 `comment` 状态变量：

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');
  
  // 🔴 避免：prop 变化时，重置 state
  useEffect(() => {
    setComment('');
  }, [userId]);
  
  // ...
}
```

这种写法是低效的，因为 `ProfilePage` 及其子组件会首先使用“过时”的值进行渲染，然后再次渲染。此外，这也是一种复杂的方法，因为你需要在每个具有 `ProfilePage` 内部状态的组件中这样做。例如，如果评论 UI 是嵌套的，你也需要清除嵌套评论状态。

相反，你可以通过为每个用户的个人资料配置一个独特的键（`key`），来告诉 React 这些资料是概念上不同的。将组件拆分为两个，并从外部组件向内部组件传递一个**键**来实现。

`key` 可以帮助 React 更好的识别组件之间的差异，从而避免不必要的重渲染。

```jsx
export default function ProfilePage({ userId }) {
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  // 当 `key` 改变时，当前组件及其下方组件的任何状态都会自动重置。
  const [comment, setComment] = useState('');
  
  // ...
}
```

通常情况下，当在相同位置渲染相同组件时，React 会保留该组件的状态。**通过将 `userId` 作为 `key` 传递给 `Profile` 组件，就是在要求 React 将具有不同 `userId` 的两个 `Profile` 组件视为两个不共享任何状态的不同组件**。每当 `key` 更改时，React会重新创建 DOM，并重置 `Profile` 组件及其子组件的状态。此时，当在不同用户的个人资料之间导航时，`comment` 状态会自动清除。

需要注意的是，在此示例中，只有外部的 `ProfilePage` 组件被导出，并且对项目中的其他文件可见。渲染 `ProfilePage` 的组件并不需要将 `key` 传递给它：它们将 `userId` 作为常规 `prop` 传递，`ProfilePage` 将 `userId` 作为 `key` 传递给内部的 `Profile` 组件，而对于渲染 `ProfilePage` 的组件并不需要知道这个实现细节。只需要按照约定将 `userId` 作为常规属性传递即可。这种封装让组件之间的通信更加简单和清晰。

### 当 `prop` 改变时调整某些状态

某些时候，你可能想在 `prop` 更改时重置或调整部分状态，而不是全部。

这是一个 `List` 组件，接收一个 `items` 列表作为 `prop`， 并在 `selection` 状态变量中维护选中的项目。你想在 `items prop` 接受到不同数组时，将 `selection` 状态变量重置为 `null`。

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);
  
  // 🔴 避免：当 prop 更改时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null)
  }, [items]);
  
  // ...
}
```

这段代码也不是很理想（低效）。每当 `items` 发生变化时，`List` 组件及其子组件都会先渲染一个“过时”的（旧的）`selection` 值；然后 React 更新 DOM 并运行 Effect；最后，`setSelection(null)` 的调用会导致 `list` 组件及其子组件重新渲染，从而再次启动整个过程。

首先删除 Effect，取而代之，在渲染期间之间调整状态：

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);
  
  // ✅ Better：在渲染期间调整状态
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  
  // ...
}
```

像这样[存储以前渲染信息](https://react.dev/reference/react/useState#storing-information-from-previous-renders)可能很难理解，但是它比在 Effect 中更新相同的状态要好。在上面示例中，在渲染期间直接调用了 `setSelection`。React 在退出 `return` 语句后立即重新渲染 `List` 组件。此时，React 尚未渲染 `List` 子组件或更新 DOM，因此，`List` 子组件得以跳过渲染“过时”的 `selection` 值。

当你在渲染期间更新组件时，React 会丢弃当前的 `jsx` 并立即重新尝试渲染。换句话说，在组件渲染期间更新状态会触发 React 对组件的重新渲染，因此 React 会丢弃当前的渲染结果并开始一个新的渲染周期。这是因为 React 希望确保组件的渲染时可预测和幂等的，以避免长生不必要的副作用和不一致的状态。

这种重新尝试渲染可能会发生连锁反应，为了避免由此产生的性能问题，React 只允许在组件的渲染过程中更新同一组件的状态（组件的内部状态）。如果在渲染过程中更新另一个组件的状态，会导致错误。为了避免出现无限循环的情况，必须使用类似 `items !== prevItems` 这样的条件语句进行判断。

我们可以像这样调整 `state`，但是对于其他的副作用，比如修改 DOM 或者设置定时器，都应该放在事件处理函数或 Effect 中，以[保持组件的纯洁性](https://react.dev/learn/keeping-components-pure)。

尽管这种模式比 Effect 更有效，但是大多数组件并不需要使用这种模式。无论如何操作，基于 `props` 或其他状态来<u>调整状态</u>都会时数据流更加难以理解和调试。始终检查是否可以**<u>使用 `key` 重置所有状态</u>**或者**<u>在渲染过程中计算</u>**。例如，你可以存储所选项的 ID，而不是存储（并重置）所选项本身，这样可以更好地实现该功能。

```jsx
function List({ items }) {
  const [isReverse, setIsResever] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // ✅ Best：在渲染期间计算
  const selection = items.find(item => item.id === selectedId) ?? null;
  
  // ...
}
```

现在根本不需要”调整状态“了。如果具有所选 ID 的项在列表中，则它仍然保持选定状态，如果不在，则在渲染期间计算的 `selection` 值为 `null`，因为没有找到匹配项。这种行为不同，但可以说更好，因为大多数对 `items` 的更改都会保留选中状态。

### 事件处理函数之间共享逻辑

假设你有一个产品页面，页面上有两个按钮（购买和结算），这两个按钮都能让你购买该产品。当用户将产品放入购物车时，你想显示一个通知。在两个按钮的 `click` 事件处理函数中都调用 `showNotification()` 感觉很重复，所以你可能会想把这个逻辑刚在一个 Effect 中。

```jsx
function ProductPage({ product, addToCart }) {
  // 🔴 避免：在 Effect 中处理事件特定的逻辑
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);
  
  function handleBuyClick() {
    addToCart(product);
  }
  
  function handleCheckoutClick() {
    addToCart(production);
    navigateTo('/checkout');
  }
  
  // ... 
}
```

这个 Effect 是不必要的，而且和可能会导致 bug。例如，假设你的应用在页面重新加载时”记住“购物车（本地缓存？）。如果你在添加一个产品到购物车后刷新页面，通知将再次出现。你每次刷新这个产品的页面，通知都会出现。这是因为在页面加载时 `product.isInCart` 的值已经是 `true`（页面”记住了“），所以上面的 `Effect` 会调用 `showNotification()`。

**当你不确定某些代码应该放在 `Effect` 中还是事件处理函数中时，问问自己这段代码为什么需要运行。只将*<u>在组件显示（渲染完成）时运行的</u>*的代码放在 Effect 中。**

在这个例子中，只有当用户按下了按钮才应该出现通知，而不是因为页面被展示给用户。删除 Effect，并将共享逻辑放入一个函数中，在两个事件处理函数中调用这个函数：

```jsx
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCard(product);
    showNotification(`Added ${product.name} to the shopping cart`);
  }
  
  function handleBuyClick() {
    buyProduct();
  }
  
  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  
  // ...
} 
```

这段代码删除了不必要的 Effect，并且修复了 bug。

### 发送 POST 请求

这个 `Form` 组件发送两种请求：

- 当组件挂载时，发送分析一个分析事件请求；
- 当你填写表单并点击提交按钮时，发送一个 POST 请求到 `/api/register` 接口。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // ✅ Good: 组件显示时，运行该逻辑
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);
  
  // 🔴 避免：在 Effect 中处理事件特定的逻辑
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/reigster', jsonToSubmit);
    }
  }, [jsonToSubmit]]);
  
  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  //...
}
```

根据之前的例子，我们可以应用相同的标准。

发送分析 POST 请求应该保持在 Effect 中。这是因为发送分析事件的原因时表单被显示出来了。（在开发中可能会触发两次，但是可以参考[这里](https://react.dev/learn/synchronizing-with-effects#sending-analytics)来解决这个问题。）

然而，`/api/register` 请求并不是由表单被显示引起的。你只想在*用户按下按钮*时发送这个请求。它只会在这个*特定的交互*中发生。删除第二个 Effect 并把 POST 请求移到事件处理函数中。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // ✅ Good: 组件显示时，运行该逻辑
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);
  
  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: 事件特定逻辑运行在事件处理函数中
    post('/api/register', { firstName, lastName });
  }
  //...
}
```

当你选择将某些逻辑放入事件处理函数或 Effect 中时，你需要回答的主要问题是，从用户的角度来看它是什么类型的逻辑。

- 如果这段逻辑是由特定交互引起的，请将其保留在事件处理函数中；

- 如果这段逻辑是由用户在屏幕上看到组件引起的，请将其保留在 Effect 中。

### 计算链（Chains of computations）

有时候你可能会想要链接多个 Effect，每个 Effect 基于其他状态调整一部分状态。

```jsx	
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 避免: 链接多个Effect，这些Effect仅为了互相触发而调整状态。
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

这段代码存在两个问题。

一个问题是它非常低效：在整个链中，每次调用 `set`，组件（及其子组件）都必须重新渲染。在上面例子中，最坏的情况下（`setCard` -> `render` -> `setGoldCardCount` -> `render` -> `setRound` -> render -> `setIsGameOver` -> `render`），组件树有三次不必要的重新渲染。

即使它不慢，当代码发展到一定阶段时，你会遇到你写的“链式”代码符合新需求的情况。想象一下，你正在添加一种方式来查看游戏移动历史记录，通过将每个状态比那辆更新为“过去”的值来实现。然而，将卡牌状态设置为“过去”的值将再次触发 Effect 链并更改正在显示的数据。这种代码通常时刻板和脆弱的。（time travel?)

在这种情况下，最好在*渲染过程中计算出*你能计算的值，并在事件处理函数中调整状态：

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  
  // ✅ 在渲染过程中计算能计算的值
  const isGameOver = round > 5;
  
  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw new Error('Game already ended.');
    }
    
    // ✅ 在事件处理函数中计算下一个状态
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }
  
  // ...
}
```

这种方式更加高效。如果你实现了一个查看游戏历史的功能，那么你就可以将每个状态变量设置为过去的一个动作，而且不会触发其他 Effect 链。如果你需要在事件处理函数之间复用逻辑，可以[提取一个函数](https://react.dev/learn/you-might-not-need-an-effect#sharing-logic-between-event-handlers)，并在事件处理函数中调用它。

需要注意的是，在事件处理函数中，[`state`的行为类似于快照](https://react.dev/learn/state-as-a-snapshot)。例如，即使在调用 `setRound(round + 1)` 之后，`round` 变量的值也还是用户点击按钮时的值。如果你需要使用下一状态的值进行计算，请手动定义它，例如 `const nextRound = round + 1`。

在某些情况下，你可能无法直接在事件处理程序中计算下一个状态。例如，想象一个包含多个下拉菜单的表单，下一个下拉菜单的选项取决于上一个下拉菜单的值，这种情况下，使用 Effect 链时可以的，因为你需要与网络进行同步。

### 初始化应用程序

有些逻辑应该只在应用程序加载时运行一次。

你可能会想把这些逻辑放在最顶层组件（`<App />`）的 Effect 中。

```jsx
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

然而，你很快就会发现，在开发环境中，这段代码会运行两次。这可能会导致一些问题，比如，可能会使身份验证令牌无效，因为这个函数不是被设计为调用两次。通常情况，你的组件应该能够经受得住被重新挂在的考验，这包裹你的顶级 `App` 组件。

尽管在实际生产环境中，它可能永远不会被重新挂载，但是在所有组件中遵循相同的限制，可以让移动和复用代码更容易。如果某些逻辑必须在应用程序每次加载时运行一次，而不是组件每次挂载时运行一次，可以添加一个顶级变量来追踪它是否已经执行过：

```jsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ 只在应用程序加载时运行一次
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

你也可以在模块初始化和应用程序渲染之前运行它：

```jsx
if (typeof window !== 'undefined') { // 检查是否在浏览器中运行
  // ✅ 只在应用程序加载时运行一次
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

位于顶层的代码只会在组件被导入时执行一次，即使该组件最终不被渲染。为了避免在导入任意组件时出现速度减慢或其他意外行为，不要过度使用这种模式。将*应用程序范围*的初始化逻辑保留在根组件模块，例如 `App.js` 或应用程序的入口，这样可以避免出现问题。

### 通知父组件

假设你正在开发一个 `Toggle` 组件，它又一个内部状态 `isOn`，值是 `true` 或 `false`。有几种不同的方法可以进行切换（单击或拖动）。你希望在 `Toggle` 组件内部状态更改时通知父组件，因此你暴露了一个 `onChange` 事件，并在 Effect 中调用了 `onChange`：

```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);
  
  // 🔴 避免: onChange 事件运行时机太迟
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange]);
  
  function handleClick() {
    setIsOn(!isOn);
  }
  
  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }
  // ...
}
```

和之前一样，这段代码并不理想。`Toggle` 组件首先更新其内部状态（`isOn`），然后 React 更新屏幕（渲染 DOM）。接着 React 运行 Effect，调用父组件传递的 `onChange` 函数，此时，父组件将更新自己的内部状态（`state`），并开始另一个渲染过程。整个过程包含了两次渲染，但最好是能在单个渲染过程中完成所有操作。

因此，我们需要删除 Effect，并在同一个事件处理函数中更新两个组件的状态。这样可以避免多次渲染，提高效率：

```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: 在引起更新的事件发生时进行更新操作
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

采用这种方式，`Toggle`组件及其父组件都会在事件执行期间更新它们的状态。React会将来自不同组件的[更新合并在一起](https://react.dev/learn/queueing-a-series-of-state-updates)，因此只会有一次渲染操作。

你也可以删除 `Toggle` 组件的状态，并从父组件接收 `isOn` 的值。

```jsx
// ✅ Also good: 受父组件控制
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

“[状态提升](https://react.dev/learn/sharing-state-between-components)”可以让父组件通过切换器自身状态来完全控制 `Toggle` 组件（受控组件）。这意味着父组件将包含更多的逻辑，但总体上要担心的状态会更少。当你尝试保持两个不同状态变量同步时，可以试试”状态提升“。

### 传递数据给父组件

下面这个例子中，子组件获取了一些数据，然后通过 Effect 将数据传递给父组件。

```jsx
function Parent() {
  const [data, setData] = useState(null);
  //...
  return <Child onFetched={setData} />
}

function Child({ onFetched }) {
  const data = useSomeApi();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data])
  // ...
}
```

在 React 中，数据是从父组件流向它们的子组件的（单向数据流）。当你在屏幕上看到某些不正确的内容时，只要沿着“组件链”一直向上查找，知道找到是哪个组件传递了错误的属性或者具有错误的状态，就可以轻松追踪信息是来自哪个组件。当子组件在 Effect 中更新其父组件的状态时，数据流就变得非常难以追踪（打破了单向数据流）。因为子组件和父组件都需要相同的数据，那么可以在父组件中获取数据，并将其传递给子组件，这样会更容易管理数据流（保持单向数据流）：

```jsx
function Parent() {
  const data = useSomeApi();
  //...
  // ✅ Good: 向下传递数据给子组件
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

这种方式更加简单，也会使数据流更加可预测：数据总是从父组件流向子组件。

### 订阅外部数据源

有时候，你的组件需要订阅 React 状态之外的数据。这些数据可能来自第三方库或者浏览器的内置 API。由于这些数据可能会在 React 不知情的情况下发生更改，因此你需要手动让组件去订阅这些数据。通常可以使用 Effect 来实现，例如：

```jsx
function useOnlineStatus() {
  // 不是最优：在 Effect 中手动订阅数据
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }
    
    updateState();
    
    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    }
  }, []);
  
  return inOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

这段代码中，组件订阅了一个外部数据源（浏览器的 `navigator.onLine` API）。由于改 API 不存在于服务器端（无法用于初始化 HTML），因此初始状态设置为 `true`。每当浏览器中的 `navigator.onLine` 值发生更改时，组件会更新其状态。

虽然使用 Effect 进行这种操作很常见，但 React 专门提供了一个用于订阅外部数据源的 Hook，官方建议使用该 Hook。删除 Effect 并将其替换成 [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)。

```jsx
function subscribe(callback) {
  window.addEventListener('online', updateState);
  window.addEventListener('offline', updateState);
    
  return () => {
    window.removeEventListener('online', updateState);
    window.removeEventListener('offline', updateState);
  }
}

function useOnlineStatus() {
  // ✅ Good: 使用 React 内置 Hook 订阅外部数据源
  return useSyncExternalStore(
  	subscribe, // 只要传递相同的函数，React 就不会重新订阅
    () => navigator.onLine, // 客户端值
    () => true // 服务端值，一般是在服务端渲染中使用，可选
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

这种方法比手动使用 Effect 将可变数据同步到 React 状态中更不容易出错。通常，你会自定义一个 Hook，比如上面的 `useOnlineStatus()`，以便在不同的组件中复用。[更多内容请阅读相关文档](https://react.dev/reference/react/useSyncExternalStore)。

### 从服务器获取数据

很多应用程序使用 Effect 来启动数据获取，常见的方法如下：

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // 🔴 Avoid: 没有清除逻辑
    fetchResults(query, page).then(json => {
      setResult(json);
    });
  }, [query, page]);
  
  function handleNextPageClick() {
    setPage(page + 1);
  }
  //...
}
```

你不需要将这个获取数据的逻辑移到事件处理函数中。

这可能和之前的例子相矛盾，因为之前的例子中需要将表单提交逻辑放在事件处理函数中。但是，在上面这个例子中，获取数据的主要原因并不是“输入事件”。搜索输入框通常根据 URL 来预填充，用户可能在不触碰输入框的情况下向前或向后导航。

`page` 和`query` 的来源并不重要。只要该组件可见（渲染到页面中），就希望将查询结果（根据 `page` 和 `query` 查询结果）与服务器同步。这就是它为什么是 Effect 的原因。

然而，这段代码又一个 bug。如果你快速地输入 `hello`，那么查询条件 `query` 会从 `h` 变为 `he`、`hel`、`hell` 和 `hello`，从而导致浏览器发起多个独立的网络请求，但却无法保证响应的顺序。例如，`hell` 的响应可能在 `hello` 的响应之后到达，然后调用 `setResult()`，这就导致了页面显示错误的搜索结果。这成为”竞态条件[^1]“：即两个不同的请求”竞争“，并以你意想不到的顺序到达。

为了修复这个因为”竞态条件“导致的 bug，需要添加一个清理函数来忽略”过时的“响应。

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
      	setResult(json);  
      }
    });
    return () => {
      ignore = true;
    }
  }, [query, page]);
  
  function handleNextPageClick() {
    setPage(page + 1);
  }
  
  //...
}
```

这样做可以确保 Effect 在获取数据时，除了最后一个请求之外，所有的响应都将被忽略。

处理竞态条件并不是实现数据获取的唯一难点，还需要考虑一下问题：

1. 缓存响应：为了提高应用程序的性能和响应速度，你可能希望缓存从服务器获取的响应。这样，当用户点击”返回“按钮时，他们可以立即看到以前的屏幕，而无需再次向服务器发送请求。你可以使用<u>浏览器的缓存机制</u>或使用<u>内存缓存</u>、<u>本地存储</u>或<u>分布式缓存</u>来实现缓存。
2. 在服务器上获取数据：如果你的应用程序采用了服务器端渲染的方式，你可能需要在服务器上获取数据，以便在渲染初始 HTML 时包含所需的内容。这样可以避免在客户端上等待数据加载的事件，从而提高页面的加载速度。你可以使用服务器端的 API 或 GraphQL 查询来获取数据。
3. 避免网络瀑布：如果你的应用程序有多个组件或页面需要获取数据，你可能希望避免等待所有父组件或页面获取数据后才获取数据。为了实现这一点，你可以使用某些技术，例如在组件中使用 `Suspense` 和 `lazy loading`、使用 React Query 等等。这些技术可以帮助你以最佳的方式处理数据换取和缓存，并在数据可用是立即渲染 UI。

这些问题不仅仅适用于 React，也适用于任何 UI 库。解决它们并不是一件轻松的事情，这也是为什么现代框架提供了比在 Effect 中获取数据更高效的内置数据获取机制。

如果你不使用框架（并且不想构建自己的框架），但希望从 Effect 中获取数据更加符合人类工程学，可以考虑将获取数据的逻辑提取到自定义 Hook 中，就像这个例子一下：

``` jsx
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);
  
  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
    	.then(json => {
      	if (!ignore) {
          setData(json);
        }
    	})；
    return () => {
      ignore = true;
    };
  }, [url]);
}
```

可能你希望再添加一些错误处理逻辑和跟踪 loading 状态的逻辑。你可以自己构建自定义 Hook，也可以使用 React 生态系统中已经提供的许多解决方案。尽管这样做本身不如使用框架内置的数据获取机制高效，但将数据获取逻辑移动到自定义 Hook 中将使未来采用高效的数据获取策略更加容易（方便重构呗）。

一般来说，每当你需要编写 Effect 时，都要留意是否可以将某个功能提取到更具声明性和目的性（原文是 purpose-built API，实在不知道怎么翻译好）的自定义 Hook 中，就像上面的 `useData` 一样。组件中直接调用 Effect 越少，代码越容易维护。

## 回顾

- 如果可以再渲染期间计算，就不要使用 Effect；
- 为了缓存昂贵计算结果，使用 `useMemo` 而不是 `useEffect`；
- 如果要重置整个组件树的状态，请传递不同的 `key`；
- 如果要响应 `prop` 更改而调整部分状态，请在渲染期间设置状态；
- 因为组件被显示而运行的代码应该放在 Effect 中，其余代码应该放在事件中；
- 如果需要更新多个组件的状态，最好在单个事件中进行更新；
- 每当你尝试同步不同组件中的状态变量时，考虑提升状态；
- 可以使用 Effect 获取数据，但是要记得实现清除函数来避免竞态条件。

