# 1. 简介

## 1.a. 基础知识

svelte 把客户端渲染的工作更多的放在了编译阶段，因此可以抛弃 `虚拟DOM` 直接对 DOM 作精确修改。

svelte 也是基于组件开发的，每一个组件就是一个包含了 `html` `<script>` `<style>` 三种元素的 `.svelte` 文件。

即，如果只需要静态内容，直接在 `.svelte` 文件中加上 html 标签即可。

```html
<h1>Hello world!</h1>
```

## 1.b. 添加数据

在 html 中引入动态内容的方式是，首先添加一个 `script` 标签，并在里面写代码。然后在 `html` 中，使用 `{}` 即可引用代码标签的变量，方法等。并且在 `{}` 中也可以执行一些语句。

```html
<script lang="ts">
  const name = 'world'
</script>

<h1>Hello {name.toLocaleUpperCase()}!</h1>
```

## 1.c. 动态属性

同样的也可以使用 `{}` 用来给元素属性设置动态值。

```html
<script lang="ts">
  const src = '/vite.svg'
</script>

<img src="{src}" />
```

##### 1.c.1: 双引号内使用 `{}`

也可以在属性值的内部使用 `{}`，如：

```html
<img src="{src}" title="link is {src}" />
```

##### 1.c.2: 速记属性

当属性名与变量名相同是，`svelte` 提供了一个速记法：

```html
<img {src} />
```

## 1.d. CSS 样式

与 `HTML` 一样，在组件中添加一个 `<style>` 标签，即可在该标签内添加 CSS 样式了。

```html
<p>This is a paragraph.</p>

<style>
  p {
    color: purple;
    font-family: 'Comic Sans MS', cursive;
    font-size: 2em;
  }
</style>
```

要注意的是，添加的样式作用域将被限定在当前组件中。

## 1.e. 嵌套组件

将整个应用程序都放在一个组件中是不切实际的。`svelte` 允许你在 `script` 标签中 `import` 其他文件中的组件，并直接以 `<Component />` 的形式在 `html` 中使用。

```html
<script lang="ts">
  import DComponent from './1.d.svelte'
</script>

<p>This is my paragraph.</p>
<DComponent />
```

要注意的是如前一节提到，CSS 样式被限定在 `1.d.svelte` 中了，所以并不造成当前组件 `p` 标签的样式被意外地修改。

另外组件首字母大写是一种普遍的约定，主要是为了能够区分自定义组件和普通的 `html` 标签。

## 1.f. `HTML` 标签

通常情况下，字符串是以纯文本的形式插入的，这意味着像 `<` `>` 这样的字符会原样输出。

但如果我们期望将字符串以 HTML 的形式输出时，可以使用 `{@html }` 实现：

```html
<script lang="ts">
  const string = `this string contains some <strong>HTML!!!</strong>`
</script>

<p>{string}</p>

<p>{@html string}</p>
```

第一行会原样输出字符串的内容，而第二行会将 `<strong>` 作为一个 html 标签，显示加粗的 `HTML!!!`。

要**注意**的是，`svelte` 并不会对 `{@html }` 内的输出做任何清理。所以要使用此功能时，切记要手动转换来自不信任源的 `html` 代码，以防止 `XSS` 攻击的风险。

# 2. 反应性 (reactive) 能力

## 2.a. 赋值

`svelte` 的内核是一个强大的 `reactivity` 系统。能够让 DOM 和程序状态保持同步，比如事件响应。

定义一个变量，再定义一个方法用来改变这个变量(重新赋值）：

```html
<script lang="ts">
  let count = 0

  function handleClick() {
    count += 1
  }
</script>
```

注册事件的语法为 `on:event={eventHandler}`，如果要为一个按钮添加鼠标点击事件，可以这样：

```html
<button on:click="{handleClick}">
  Clicked {count}
</button>
```

## 2.b. 反应性声明

当组件的某些状态是需要其他部分计算出来时（例如，`fullname` 就是由 `firstname` 和 `lastname` 组成的），并且一旦其他部分发生更改，自身也需要重新计算时。

`svelte` 提供了 `反应式声明 (reactive declarations)` 它看起来像这样：

```html
<script lang="ts">
  let count = 0

  $: timeStr = count === 1 ? 'time' : 'times'
</script>
```

对于 `svelte` 而言，它将 `$:` 解释为 “只要参考值变化了，就重新运行此代码”

当然我们也可以在 `html` 标签中写类似的 `{ count === 1 ? 'time' : 'times' }` 而不必非得使用反应式声明。但如果你需要多个地方多次引用到它，使用反应式声明就会变得更有用。（可以理解为反应式声明会缓存结果，对于一次改变，代码只需要执行一次）。

## 2.c. 反应式语句

在 `$:` 之后不仅可以提供 `反应式声明` 的值，还可以运行 `反应式语句`。例如，当某个变量的值发生改变时，就输出日志：

```typescript
$: console.log(`the count is ${count}`)
```

当然也可以使用 `{}` 将一组语句合成一个代码块：

```typescript
$: {
  const doubleCount = count * 2
  console.log(`the doubleCount is ${doubleCount}`)
}
```

甚至还可以将 `$:` 放在 `if` 代码块前：

```typescript
$: if (count >= 10) {
  alert('count is dangerously high!')
  count = 9
}
```

## 2.d. 更新数组和对象

由于 `svelte` 的反应性是由赋值语句触发的，因此使用数组的诸如 `push` 和 `splice` 之类的方法就不会触发自动更新，要解决这个问题的一种方法是添加一个多余的赋值语句：

```typescript
<script lang="ts">
    let numbers = [1, 2, 3, 4]

    function addNumber() {
        numbers.push(numbers.length + 1)
        numbers = numbers // 只有这样才会触发自动更新
    }

    $: sum = numbers.reduce((t, n) => t + n, 0)
</script>

<p>{numbers.join(' + ')} = {sum}</p>

<button on:click={addNumber}> Add a number </button>

```

但还有一个更惯用的解决方案：

```typescript
function addNumber() {
  numbers = [...numbers, number.length + 1]
}
```

要注意的是对数组和对象的属性 `例如：obj.foo += 1 或 array[i] = 0` 进行赋值操作并不需要什么特殊的解决自动更新的方案。就和对值本身进行赋值一样的方式即可。

```typescript
// 以下代码都会触发自动更新

numbers[0] = 0

obj.name = 'xxl'
```

一个简单的经验法则是：被更新的变量的名称必须出现在赋值语句的左侧。像下面这个例子，就不会触发自动更新：

```typescript
const foo = obj.foo
foo.bar = 'baz'

// 除非在最后使用了 obj = obj 这种方式，否则 obj.foo.bar 并不会更新
```

# 3. 属性

## 3.a. 声明属性

目前为止，我们只是处理了内部状态 - 即，这些值都只能在当前的组件中被访问到。

实际上，在绝大部分的真实案例中。我们都需要将数据从一个组件传递到另一个组件。最常见的就是将一个值传递给它的子组件。要做到这一点，`svelte` 使用 `export` 关键字
来声明属性。

在子组件中这样写：

```typescript
<script lang="ts">export let answer</script>
```

然后在父组件中就可以给子组件传递数据了：

```typescript
<script lang="ts">
    import Component from './3.a_comp.svelte'
</script>

<Component answer={42} />
```

与 `$:` 类似，在标准的 `JavaScript` 中 `export` 并不是这样工作的，它是 `svelte` 特有的语法。

## 3.b. 默认值

我们可以在子组件中很轻松的给属性设置默认值：

```typescript
export let answer = 'a mystery'
```

此时，如果父组件没有指定 `answer` 属性的值，就将显示默认值。

## 3.c. 属性传递

如果有一组属性需要传递（spread）到一个组件上，可以使用 `...` 语法而不用逐一指定：

```typescript
<Component {...props} />
```

另外如果需要获取到所有传递给组件的属性，包括未使用 `export` 声明的属性。可以使用 `$$props` 关键字。但通常不建议这样做，因为这会让 `svelte` 难以优化。

```typescript
$: console.log('所有传递过来的属性：', $$props)
```

# 4. 逻辑

## 4.a. if 块

在 HTML 标签中是没有表达逻辑的方式的，比如判断，循环等。

在 `svelte` 中使用一些特殊的标签来实现在 HTML 中使用逻辑。

```html
{#if user.loggedIn}
<button on:click="{toggle}">Log out</button>
{/if} {#if !user.loggedIn}
<button on:click="{toggle}">Log in</button>
{/if}
```

如上，在 `svelte` 中使用 `{#if 条件表达式} {/if}` 来实现在 HTML 中的 `if` 语句块。

## 4.b. else 块

在上一个例子中我们使用了二个 `if` 语句块，但实际上在这里，第二个 `if` 语句块我们更习惯于用 `else` 语句块来实现，在 `svelte` 中是这样实现 `else` 语句的：

```html
{#if user.loggedIn}
<button on:click="{toggle}">Log out</button>
{:else}
<button on:click="{toggle}">Log in</button>
{/if}
```

在 `svelte` 中，特殊标记总是以 `#` 开头的标记，并以 `/` 开头的标记作为结尾。像是 `else` 这种在中间出现的标记则是以 `:` 开头。

## 4.c. else-if 块

将多个条件链接在一起请使用 `else if`:

```html
{#if x > 10}
<p>{x} is greater than 10</p>
{:else if x < 5}
<p>{x} is less than 5</p>
{:else}
<p>{x} is between 5 and 10</p>
{/if}
```

## 4.d. each 块

使用 `each` 块遍历数据列表

```typescript
<script lang="ts">
    const cats = [
        { id: '1', name: 'Keyboard Cat' },
        { id: '2', name: 'Maru' },
    ]
</script>

<ul>
    {#each cats as cat}
        <li>
            {cat.name}
        </li>
    {/each}
</ul>
```

所有的 `iterable` 对象都可以通过 `each` 遍历

另外可以指定 `index` 作为第二个参数（key）。

```html
{#each cats as cat, index}
<li>
  {index} : {cat.name}
</li>
{/each}
```

## 4.e. 为 each 添加 key 值

一般情况下，当修改了 `each` 块中的值是，`svelte` 会在尾端进行添加或删除条目，并更新所有变化。但这可能不是你想要的结果。

```html
<script lang="ts">
  import Component from './4.e_comp.svelte'

  let list = [
    { id: 1, color: '#0d0887' },
    { id: 2, color: '#6a00a8' },
    { id: 3, color: '#b12a90' },
    { id: 4, color: '#e16462' },
    { id: 5, color: '#fca636' },
  ]

  function handleClick() {
    list = list.slice(1)
  }
</script>

<button on:click="{handleClick}">Remove first thing</button>

{#each list as item (item.id)}
<Component current="{item.color}" />
{/each}
```

如果在 `each` 块不指定 `(item.id)` 作为 `key`，则列表会从底部删除元素来响应 `list = list.slice(1)` 造成的更新。但这会导致其他所有元素都重新渲染。添加了 `key` 之后等于是告诉了 `svelte` 什么地方需要改变。此时列表中只有被更新/删除的数据对应的元素才会被重新渲染。

另外你可以使用任何对象用作 `key`。这意味着在上面代码中，你也可以直接使用 `(item)` 来代替 `(item.id)` 作为 `key` 值。但是一般使用数字或字符串作为 key 值更安全。例如，使用来自 API 服务器的新数据进行更新时。

## 4.f. await 块

在 `svelte` 中可以直接使用 `await 块` 在 HTML 标签中处理 `promise`。

```html
<script lang="ts">
  async function getRandomNumber() {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(Math.random())
      }, 1000)
    })
  }

  let promise = getRandomNumber()

  function handleClick() {
    promise = getRandomNumber()
  }
</script>

<button on:click="{handleClick}">generate random number</button>

{#await promise}
<p>...waiting</p>
{:then number}
<p>The number is {number}</p>
{:catch error}
<p style="color: red;">{error.message}</p>
{/await}
```

另外 `wait` 阶段和 `cache` 块是可以被忽略的，所以如果只想在 `promise` 正确返回时执行操作，可以简写成这样：

```html
{#await promise then num}
<p>The number is {num}</p>
{/await}
```

# 5. 事件

## 5.a. DOM 事件

大之前的例子中其实已经出现过了，我们可以使用 `on:事件名` 的方式监听 DOM 元素的所有事件。

## 5.b. 内联事件处理

你可以在 `svelte` 的 `html` 中直接定义事件处理函数，就像这样：

```html
<div on:mousemove={(evt) => { m.x = evt.clientX }}>
    The mouse position is {m.x} - {m.y}
</div>
```

注意，你也可以给 `mousemove` 的值加上双引号，就像这样：

```html
<div on:mousemove="{(evt) => { m.x = evt.clientX }}">
  The mouse position is {m.x} - {m.y}
</div>
```

二种方式都是允许的。但在某些环境下，使用双引号对语法突显会有帮助。

注意：在一些其他框架中，会有一些出于性能原因而提出避免使用内联事件处理的建议，特别是在循环中。不过这个建议不适用于 `svelte`，无论你使用哪种形式。`svelte` 的编译器总能够正确的处理。

## 5.c. 事件修饰符

DOM 事件具有额外的修饰符。例如，带 `once` 修饰符表示该事件只处理一次。

```html
<script lang="ts">
  function handleClick() {
    alert('no more alerts')
  }
</script>

<button on:click|once="{handleClick}">Click me</button>
```

所有的修饰符列表：

- `preventDefault`: 调用 `event.preventDefault()`，中止事件的默认处理程序被调用。

- `stopPropagation`: 调用 `event.stopPropagation`，防止事件影响到下一级元素。

- `passive`: 优化了对 `touch` / `wheel` 事件的滚动表现。（`svelte` 会在合适的地方自动添加滚动条）

- `capture`: 在 `capture` 阶段而非 `bubbling` 阶段触发事件处理程序。

- `once`: 运行一次事件处理程序后删除监听。

- `self`: 仅当 `event.target` 是本身时才执行。

以上修饰符可以组合在一起使用，即：`on:click|once|capture={...}`

## 5.d. 组件事件

组件也可以调度事件。

```html
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function sayHello() {
    dispatch('message', { text: 'Hello!' })
  }
</script>

<button on:click="{sayHello}">Click to say hello</button>
```

然后使用这个组件的父组件就可以通过 `on:{type}` 接收到 `CustomEvent` 了。

```html
<script lang="ts">
  import Inner from './5.d_inner.svelte'

  function handleMessage(event: CustomEvent<{ text: string }>) {
    alert(event.detail.text)
  }
</script>

<Inner on:message="{handleMessage}" />
```

要**注意**的是，`createEventDispatcher` 必须在首次实例化组件是就调用，并不支持如 `setTimeout` 之类的回调。否则就会收到一个错误：`Function called outside component initialization`

```js
let dispatch
setTimeout(() => {
  dispatch = createEventDispatcher() // 运行时报错
  console.log('time out finish')
}, 1000)
```

## 5.e. 事件转发

与 DOM 事件不同，组件事件并不会冒泡。如果你想要在某个深层嵌套的组件上监听事件，则中间组件必须转发（forward）事件。

```html
<script lang="ts">
  import Inner from './5.d_inner.svelte'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function forward(event: CustomEvent) {
    dispatch('message', event.detail)
  }
</script>

<p>Outer Start</p>
<Inner on:message="{forward}" />
<p>Outer End</p>
```

但这样写显得太过繁琐，因此 `svelte` 设立了一个简写属性 `on:message`，只要没有给它赋予特定的值，则意味着转发所有 `message` 事件。

```html
<Inner on:message />
<!-- message 事件会被转发给父级 -->
```

## 5.f. DOM 事件转发

事件转发也可以应用到 DOM 事件。

```html
<button on:click>Click me</button>
```

这样父组件就可以接收到子组件的事件并作出响应了。

```html
<script lang="ts">
  import Button from './5.f_button.svelte'

  function handleClick() {
    alert('button clicked')
  }
</script>

<button on:click="{handleClick}" />
```

# 6. 绑定

## 6.a. Text input

通常情况下，`svelte` 的数据流是遵循自顶向下的模式的，即，父组件可以在子组件上设置属性，而组件可以在 `html` 元素标签上设置属性，但反过来就不行。

但在某些情况下，打破这个规则会更好。举一个例子，如果要控制 `input` 标签的值，遵循自顶向下的模式会相当的繁琐，首先要在你的组件的 `input` 标签上添加 `on:input` 事件处理程序，并且在触发事件后将 `event.target.value` 设置一个变量，并将这个变量的值赋给标签的 `value` 属性。类似的元素标签还有不少。

对此，在 `svelte` 中，我们可以使用 `bind:value` 来快速实现上述的需求：

```html
<script lang="ts">
  let name = 'world'
</script>

<input bind:value="{name}" />

<h1>Hello {name}!</h1>
```

这样就实现了双向绑定。

## 6.b. Numeric input

在 DOM 中，所有东西都是字符串类型的。这意味着对于 `input` 标签的 `type=number` 或 `type=range` 而言，在使用 `input.value` 之前，你需要将它们强制转换成数字类型。

而在 `svelte` 中，`bind:value` 会自动帮你转换。

```html
<script lang="ts">
  let a = 1,
    b = 2
</script>

<label name="a">
  <input type="number" bind:value="{a}" min="0" max="10" />
  <input type="range" bind:value="{a}" min="0" max="10" />
</label>

<label name="b">
  <input type="number" bind:value="{b}" min="0" max="10" />
  <input type="range" bind:value="{b}" min="0" max="10" />
</label>

<!-- 数字计算而非字符串连接 -->
<p>{a} + {b} = {a + b}</p>
```

## 6.c. checkbox

不仅可以使用 `bind:value`，也可以将复选框的状态 `input.checked` 绑定起来。

```html
<script lang="ts">
  let checked = false
</script>

<label>
  <input type="checkbox" bind:checked />
  Yes or No ?
</label>

{#if checked} You selected yes!!! {/if}
```

## 6.d 组绑定

如果需要绑定多个值，可以使用 `bind:group` 将 `value` 属性放在一起使用。

在 `bind:group` 中，同一组的单选框的值是互斥的。同一组的复选框则会形成一个数组。

```html
<script lang="ts">
  let scoops = 1
  let flavours = ['Mint choc chip']

  $: flavourStr = flavours.length === 1 ? flavours[0] : flavours.join(', ')
</script>

<h2>Sizes</h2>

{#each ['One scoop', 'Two scoops', 'Three scoops'] as scoop, i (scoop)}
<label>
  <input type="radio" bind:group="{scoops}" value="{i" + 1} />
  {scoop}
</label>
{/each}

<h2>Flavours</h2>

{#each ['Cookies and cream', 'Mint choc chip', 'Raspberry ripple'] as flavour
(flavour)}
<label>
  <input type="checkbox" bind:group="{flavours}" value="{flavour}" />
  {flavour}
</label>
{/each}

<p>
  You ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'} of {flavourStr}
</p>
```

## 6.e textarea

同样的 `<textarea>` 标签也可以使用 `bind:value` 进行绑定：

```html
<textarea bind:value="{value}"></textarea>
```

另外要注意的是，如果绑定的属性名与变量多相同，也可以使用简写形式：

```html
<textarea bind:value></textarea>
```

简写形式适用于所有标签的所有绑定，并不限于 `textarea`。

## 6.e select

同样的 `bind:value` 也可以对 `<select>` 标签进行绑定：

```html
<script lang="ts">
    const questions = [
        { id: 1, text: `Where did you go to school?` },
        { id: 2, text: `What is your mother's name?` },
        {
            id: 3,
            text: `What is another personal fact that an attacker could easily find with Google?`,
        },
    ]

    let selected

    let answer = ''

    function handleSubmit() {
        alert(
            `answered question ${selected.id} (${selected.text}) with "${answer}"`
        )
    }
</script>

<h2>Insecurity questions</h2>

<form on:submit|preventDefault={handleSubmit}>
    <select bind:value={selected} on:change={() => (answer = '')}>
        {#each questions as question (question.id)}
            <option value={question}>
                {question.text}
            </option>
        {/each}
    </select>

    <input bind:value={answer} />

    <button disabled={!answer} type="submit"> Submit</button>
</form>
```

即使 `<option>` 中的值是对象而非字符串，`svelte` 也可以轻松处理。

## 6.g select multiple

如果选择框有属性 `multiple`，则 `svelte` 也会自动将绑定的属性变为数组而非一个单一的值。

## 6.h contenteditable

支持 `contenteditable="true"` 属性的标签，可以使用 `textContent` 和 `innerHTML` 属性的绑定：

```html
<script lang="ts">
  let html = `<p>Write some text!</p>`
</script>

<pre>{html}</pre>

<div contenteditable="true" bind:textContent="{html}" />

<div contenteditable="true" bind:innerHTML="{html}" />
```

## 6.i each

甚至可以对 `each` 块添加绑定。

```html
<script lang="ts">
  let todos = [
    { done: false, text: 'finish Svelte tutorial' },
    { done: false, text: 'build an app' },
    { done: false, text: 'world domination' },
  ]

  function add() {
    todos = todos.concat({ done: false, text: '' })
  }

  function clear() {
    todos = todos.filter((t) => !t.done)
  }

  $: remaining = todos.filter((t) => !t.done).length
</script>

<h1>Todos</h1>

{#each todos as todo}
<div class:done="{todo.done}">
  <input type="checkbox" bind:checked="{todo.done}" />
  <input placeholder="What needs to be done?" bind:value="{todo.text}" />
</div>
{/each}

<p>{remaining} remaining</p>

<button on:click="{add}">Add new</button>

<button on:click="{clear}">Clear completed</button>
```

要注意的是，此时这些 `input` 标签上的属性已经和数组中对应项的数据绑定起来了，这意味着它们会随着数据的变化而变化。如果你需要使用固定的数据，应该避免这种做法，使用事件处理程序。

另外因为 `done` 和 `text` 属性会随着用户操作而变化，所以不能用这二个值来做为 `each` 的 `key`。按情况，使用 `each` 的 `index` 或者 `todo` 值本身，或者添加一个不变的 `id` 做为 `key` 可以避免用户输入导致的整个元素重刷的问题。

## 6.j audio / video

`audio` 和 `video` 标签的部分属性同样支持绑定。

```html
<video
  poster="/vite.svg"
  src="/video.ogm"
  on:mousemove="{handleMousemove}"
  on:mousedown="{handleMousedown}"
  bind:currentTime="{time}"
  bind:duration
  bind:paused
/>
```

通常在网页中，`currentTime` 将被用于对 `timeupdate` 事件的监听与跟踪。但是这些事件很少触发，从而导致 UI 不稳定。 `svelte` 使用 `currentTime` 对 `requestAnimationFrame` 进行查验，进而避免了此问题。

可以对 `audio` 和 `video` 的 6 个 `readonly` 属性进行绑定。

- `duration`：视频的总时长，以秒为单位。

- `buffered`：数组 `{start, end}` 的对象。

- `seekable`：同上。

- `played`：同上。

- `seeking`：布尔值。

- `ended`：布尔值。

以及 4 个双向绑定。

- `currentTime`：视频中的当前点，以秒为单位。

- `playbackRate`：播放视频的倍速，`1` 为正常。

- `paused`：暂停。

- `volume`：音量，0 到 1 之间的值。

另外 `video` 还多出了 2 个具有 `readonly` 的属性 `videoWidth` 和 `videoHeight` 属性的绑定。

## 6.k size

每个块级标签都可以对 `clientWidth`, `clientHeight`, `offsetWidth` 以及 `offsetHeight` 属性进行绑定。

```html
<script lang="ts">
  let w, h
  let size = 42
  let text = 'edit me'
</script>

<input type="range" bind:value="{size}" />
<input bind:value="{text}" />

<p>size: {w}px x {h}px</p>

<div bind:clientWidth="{w}" bind:clientHeight="{h}">
  <span style="font-size: {size}px;">{text}</span>
</div>
```

要注意的是，这些绑定是*只读*的，更改 `w` 和 `h` 的值并不会有任何效果。

对标签的尺寸更改请 [阅读这里](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/)。由于涉及到额外的性能开销，因此不建议在页面中大量的使用。

另外使用 `display: inline` 的标签是无法获得尺寸的。当然包含有其他有尺寸的标签（例如 `canvas`）也不会得到正常的显示。在这种情况下建议对该标签嵌套一层标签或者直接绑定它的父级标签。

## 6.l this

`this` 可以绑定到任何标签（或者组件）并允许你获取对渲染标签的引用。

```html
<canvas bind:this="{canvas}" width="{32}" height="{32}" />
```

要注意的是，`canvas`的值直到组件挂载完毕之前都会是 `undefined`。因此需要在 `onMount` 这个生命函数中才开始对 `canvas` 进行操作。

## 6.m component

正如可以绑定到 DOM 元素的属性一样。你也可以将组件的属性绑定。

```html
<script lang="ts">
  import Keypad from './6.m_keypad.svelte'

  let pin: string

  $: view = pin ? pin.replace(/\d(?!$)/g, '*') : 'enter your pin'

  function handleSubmit() {
    alert(`submitted ${pin}`)
  }
</script>

<h1 style="color: {pin ? '#333' : '#ccc'};">{view}</h1>

<Keypad bind:value="{pin}" on:submit="{handleSubmit}" />
```

请谨慎使用组件绑定。如果你的程序中数据过多，并且是在没有一个统一的数据来源的情况下。此时将很难追踪应用程序的数据流。

# 7. 生命周期

## 7.a onMount

每个组件都有一个生命周期，它们会在组件创建后开始，并在组件销毁后结束。`svelte` 提供了一些钩子允许我们在生命周期的这几个关键时刻运行代码。

最常见使用的是 `onMount`，它在组件首次渲染到 DOM 上后执行。

```html
<script lang="ts">
  import { onMount } from 'svelte'

  let photos = []

  onMount(async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/photos?_limit=20'
    )

    photos = await res.json()
  })
</script>
```

建议将 `fetch` 放在 `onMount` 中，而不是 `<script>` 的顶部是因为服务器端渲染（SSR）的原因。因为除了 `onDestroy` 之外的其他生命周期函数并不会在 SSR 期间运行。这意味着我们可以避免组件在装入 DOM 后去获取那些应该延迟加载的数据。

生命周期函数必须在组件初始化时被调用，以便回调能够被绑定到组件实例上。所以生命周期函数不能在类似 `setTimeout` 中被调用。

如果 `onMount` 的回调函数中返回了一个方法。那么这个方法将在组件销毁时被调用。

## 7.b onDestroy

想在组件销毁时运行程序，可以使用 `onDestroy`。

```html
<script lang="ts">
  import { onDestroy } from 'svelte'
  export let second = 0

  const interval = setInterval(() => {
    second += 1
  }, 1000)

  onDestroy(() => {
    interval && clearInterval(interval)
  })
</script>
```

## 7.c beforeUpdate 和 afterUpdate

顾名思义，`beforeUpdate` 函数会在 DOM 渲染完成前执行。`afterUpdate` 则相反，它一般会在你的异步数据加载完成后执行。

它们一般用于一些需要以状态来驱动的地方，例如，渲染标签的滚动位置等。

要注意的是，`beforeUpdate` 的第一次运行是在组件挂载前运行的。也就是意味着，如果我们进行了 `bind:this` 则需要判断标签是否已经绑定成功了。

```html
<script lang="ts">
  import { onMount, beforeUpdate } from 'svelte'

  let div: HTMLDivElement

  onMount(() => {
    console.log('onMount', div)
  })

  beforeUpdate(() => {
    console.log('beforeUpdate', div)
  })
</script>

<div bind:this="{div}" />
```

打印的顺序为 `beforeUpdate` -> `onMount` -> `beforeUpdate`。并且第一次 `beforeUpdate` 时，`div` 为 `undefined`。

## 7.d tick

`tick` 函数不同于其他生命周期函数，它可以被随时调用，而不用等待组件首次初始化。

它返回一个带有 `resolve` 方法的 `Promise`。每当组件 `pending状态` 变化便会立即体现到 DOM 中。

在 `svelte` 中，每当组件状态失效时，DOM 并不会立即更新。反而会等待下一个 `microtask` 以查看是否还有其他变化的状态或组件需要应用更新。

```html
<script lang="ts">
  import { tick } from 'svelte'

  let text = `Select some text and hit the tab key to toggle uppercase`

  async function handleKeydown(event: KeyboardEvent) {
    if (event.which !== 9) return

    event.preventDefault()

    const { selectionStart, selectionEnd, value } = this as HTMLTextAreaElement

    const selection = value.slice(selectionStart, selectionEnd)

    const replacement = /[a-z]/.test(selection)
      ? selection.toUpperCase()
      : selection.toLowerCase()

    text =
      value.slice(0, selectionStart) + replacement + value.slice(selectionEnd)

    await tick()

    const that = this as HTMLTextAreaElement

    that.selectionStart = selectionStart + 1
    that.selectionEnd = selectionEnd
  }
</script>

<textarea value="{text}" on:keydown="{handleKeydown}" />
```

如果没有 `await tick()` 则，当 `textarea` 的值发生改变后，浏览器会取消选中区域并将光标置于文本末尾。

# 8. Stores

## 8.a writable stores

应用中有各种各样的状态，它们并非只局限于应用的组件中。有时候，也会有一些状态需要被多个组件，甚至纯的 JS 模块访问。

在 `svelte` 中，使用 `store` 来解决上述这种情况。一个 `store` 是一个简单的 JS 对象，并且它拥有一个 `subscribe` 方法，该方法允许其他代码在 `store` 本身发生变化时收到通知。

```typescript
import { writable } from 'svelte/store'

export const count = writable(0)
```

想要修改这个 `store` 的值，可以使用 `update` 或 `set` 方法。

```typescript
import { count } from './8.a_stores'

function reset() {
  count.set(0)
}

function increment() {
  count.update((c) => c + 1)
}
```

最后要显示该 `store` 的最新值可以这样做：

```html
<script lang="ts">
  import { count } from './8.a_stores'
  import Incre from './8.a_incre.svelte'
  import Decre from './8.a_decre.svelte'
  import Reset from './8.a_reset.svelte'

  let count_value: number

  const unsubscribe = count.subscribe((value) => {
    count_value = value
  })
</script>

<h1>The count is {count_value}</h1>

<Incre />
<Decre />
<Reset />
```

上面的代码中，使用 `subscribe` 方法监听 `store` 的更新，并在更新时将最新的值赋给 `count_value`。并在 HTML 中显示。

## 8.b auto subscriptions

在前一节的代码中遗留下了一个 bug。即 `unsubscribe` 并没有被调用，如果该组件被多次初始化和销毁后，会导致内在泄漏。

所以要注意的是在使用 `store.subscribe` 之后，它会返回一个取消订阅的方法，该方法需要在合适的时候去调用。在上一节的例子中，最简单的操作方法就是在组件的销毁生命周期函数中调用：

```typescript
import { onDestroy } from 'svelte'

//...

// const unsubscribe = count.subscribe(...

onDestroy(unsubscribe)
```

但是这样一来其实就显得有些繁琐了，特别是如果要使用多个 `store` 时。`svelte` 提供了一个语法糖可以让你更轻松的使用 `store` 以及自动订阅和销毁 `store` 的监听。使用起来也很简单，就是在你要使用的 `store` 对象名前加一个前缀 `$`。

```html
<script lang="ts">
  import { count } from './8.a_stores'
  import Incre from './8.a_incre.svelte'
  import Decre from './8.a_decre.svelte'
  import Reset from './8.a_reset.svelte'
</script>

<h1>The count is {$count}</h1>

<Incre />
<Decre />
<Reset />
```

要注意的是自动订阅仅仅只能工作在导入的 `store` 是最外层作用域的情况。

另外，除了在 HTML 标签中使用 `$count` 以外，你也可以在 `script` 标签中。

在 `svelte` 中，任何以 `$` 开头的变量名都会被认为是 `store` 的值。所以 `$` 对于 `svelte` 而言会是一个保留字，`svelte` 不允许你在定义普通的变量名时使用 `$` 字符作为开头。

## 8.c readable store

并非所有的 `store` 都需要在其他地方进行写入操作。比如说用户的鼠标位置或者地理位置的 `stores`。这样的 `store` 除了在特定的地方会有写入操作外，在其他大部分使用它们的地方进行写入操作是没有意义的。对于这种情况，可以使用只读（readable）`store`。

```typescript
import { readable } from 'svelte/store'

export const time = readable<Date>(null, function start(set) {
  const interval = setInterval(() => {
    set(new Date())
  }, 1000)

  return function stop() {
    clearInterval(interval)
  }
})
```

当 `store` 被首次 `subscribe` 时，`start` 函数将被调用。当 `store` 最后被 `unsubscribe` 时则会调用返回的 `stop` 函数。

## 8.d stores 派生

你可以创建一个 `store`，其内的值可以派生（derived）于一个或多个其他 `stores`。

```typescript
const start = new Date()

export const elapsed = derived([time], ([t]) => {
  return Math.round((t.getTime() - start.getTime()) / 1000)
})
```

## 8.e 自定义 stores

只要一个对象正确的使用了 `subscribe`，它就可以被称为 `store`。因此要创建一个自定义的 `store` 也非常的简单。

```typescript
import { writable } from 'svelte/store'

function createCount() {
  const { subscribe, set, update } = writable(0)

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  }
}

export const count = createCount()
```

然后在 `svelte` 中就可以和原生的 `store` 一样使用了：

```html
<script lang="ts">
  import { count } from './8.e_store'
</script>

<h1>The count is {$count}</h1>

<button on:click="{count.increment}">+</button>
<button on:click="{count.decrement}">-</button>
<button on:click="{count.reset}">reset</button>
```

注意，`$` 语法糖在这里依然生效。

## 8.f 绑定 store

如果 `store` 是可写入的（即具有 `set` 方法），则可以绑定该值。

```html
<script lang="ts">
  import { name, greeting } from './8.f_store'
</script>

<h1>{$greeting}</h1>
<input bind:value="{$name}" />
```

另外我们也可以直接修改 `store` 的值

```html
<button on:click={() => ($name += '!')}>Add exclamation mark!</button>
```

这里的 `$name += '!'` 相当于 `name.set($name + '!')`。

# 9. 运动

## 9.a Tweened

设置一个值并观察 DOM 根据该值自动更新是一件非常有趣的事。如果能让该值的变化带有动画效果则会更好。`Svelte` 提供了一些工具让你在 UI 上创建动画。

```html
<script lang="ts">
  import { tweened } from 'svelte/motion'

  const progress = tweened(0)
</script>

<progress value={$progress} />

<button on:click={() => progress.set(0)}>0%</button>
<button on:click={() => progress.set(0.25)}>25%</button>
<button on:click={() => progress.set(0.5)}>50%</button>
<button on:click={() => progress.set(0.75)}>75%</button>
<button on:click={() => progress.set(1)}>100%</button>

<style>
  progress {
    display: block;
    width: 100%;
  }
</style>
```

点击按钮可以看到进度条被设置了不同的进度值，并且有一个插值动画的效果。但这个效果目前还是有点死板，通过 `easing` 可以提供更好的动画效果。

```typescript
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

const progress = tweened(0, {
  duration: 400,
  easing: cubicOut,
})
```

`svelte/easing` 模块中包含了 [Penner easing equations](http://robertpenner.com/easing/) 提供的缓动公式。当然你也可以自定义一个缓动方法 `p => t`，`t` 的返回值在 0 到 1 之间。

`tweened` 的第二个参数的完整配置属性为：

- `delay` - 多少毫秒之后开始补间动画。

- `duration` - 动画的持续时间（毫秒为单位）。或者 `(from, to) => milliseconds` 方法来指定。

- `easing` - `p => t` 缓动公式。

- `interpolate` - 一个自定义的 `(from, to) => t => value` 的插值公式，默认情况下，`svelte`会自动对 `number, date` 类型，以及仅包含数字或日期类型的数组或对象进行插值。如果是其他的类型，比如颜色或变换矩阵，则需要提供自定义的插值公式。

另外你可以传递第二个参数给到 `process.set` 和 `process.update`。他们会返回一个 `promise` 并在补间动画结束时 `resolve`。

## 9.b Spring

`spring` 方法和 `tweened` 类似，但一般它被用在值会频繁变化的地方。

```typescript
import { spring } from 'svelte/motion'

let coords = spring({ x: 50, y: 50 }, { stiffness: 0.1, damping: 0.25 })
let size = spring(10)
```

每个 `spring` 都有二个默认参数 `stiffness` 和 `damping`。你也可以在初始化时改变这二个参数。

# 10. 过渡

## 10.a The transition directive

我们可以通过 `transition` 让元素在 DOM 树中出现或消失时有着更有吸引力的表现。`Svelte` 通过 `transition` 模块可以很方便的实现这些效果。

```html
<script lang="ts">
  import { fade } from 'svelte/transition'

  let visible = true
</script>

<label> <input type="checkbox" bind:checked="{visible}" /> visible </label>

{#if visible}
<p transition:fade>Fades in and out</p>
{/if}
```

首先引入包 `import { fade } from 'svelte/transition'`，
然后在需要过渡效果的元素上添加 `<p transition:fade>...</p>`。

## 10.b Adding parameters

`transition` 可以接收一些参数控制过渡的效果，比如持续时间等。

```html
<script lang="ts">
  import { fly } from 'svelte/transition'

  let visible = true
</script>

<label>
  <input type="checkbox" bind:checked={visible} />visible
</label>

{#if visible}
  <p transition:fly={{ y: 200, duration: 2000 }}>Fades in and out</p>
{/if}
```

要注意的是，`transition` 是可逆的，也就是说在上述例子中 out 时会移动到 `y: 200` 的位置，而在 in 时，会从这个位置移回初始位置。

## 10.c 出入

`transition` 属性可以替换为 `in` 或 `out` 属性，它们分别被用来指定过渡效果的入和出。可以只指定其中一个，或两个都指定。

```html
<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  let visible = true
</script>

<label>
  <input type="checkbox" bind:checked={visible} />
</label>

{#if visible}
  <p in:fly={{ y: 200, duration: 2000 }} out:fade>Flies in, fades out</p>
{/if}
```

要注意的是，在这种情况下过渡效果是不可逆的。

## 10.d 自定义 CSS 过渡

`svelte/transition` 模块含有一些内置的过渡效果，你也可以创建自己的过渡效果。这里以自定义一个 `fade` 过渡效果举例：

```html
<script lang="ts">
  let visible = true

  function fade(node, options?) {
    const { delay = 0, duration = 400 } = options
    const o = +getComputedStyle(node).opacity

    return {
      delay,
      duration,
      css: (t) => `opacity: ${t * o}`,
    }
  }
</script>

<label> <input type="checkbox" bind:checked="{visible}" />visible </label>

{#if visible}
<p transition:fade>transitions!</p>
{/if}
```

自定义过渡函数接收两个参数（过渡应用到的节点以及传入的其他任何参数）并返回一个过渡对象，该对象可以具有以下属性：

- `delay` : 过渡开始（毫秒）。

- `duration` : 过渡时长（毫秒）。

- `easing` : `p => t` easing 函数。

- `css` : `(t, u) => css` 函数，`u === 1 - t`。

- `tick` : `(t, u) => {...}` 对节点有一定影响的函数。

当 `t` 为 0 时表示开始，值为 1 时表示结束，根据情况含义可能截然相反。

大多数情况下，应该返回 `css` 而不是 `tick` 属性。因为 CSS animations 会运行在主线程中，以避免出现混淆。`svelte` 会模拟过渡效果并创建 CSS animation，然后才开始运行。

例如，`fade` 过渡会生成如下的 CSS animation :

```css
0% {
  opacity: 0;
}
10% {
  opacity: 0.1;
}
20% {
  opacity: 0.2;
}
/* ... */
100% {
  opacity: 1;
}
```

当然更多的情况下我们可以做出更多定制化的过渡效果：

```typescript
function spin(node, options?) {
  const { duration } = options
  return {
    duration,
    css: (t) => {
      const eased = elasticOut(t)

      return `
            transform: scale(${eased}) rotate(${eased * 1080}deg);
            color: hsl(
            ${~~(t * 360)},
            ${Math.min(100, 1000 - 1000 * t)}%,
            ${Math.min(50, 500 - 500 * t)}%
            );
        `
    },
  }
}
```

## 10.e 自定义 JS 过渡

通常情况下应该尽可能地使用 CSS 进行过渡，但是某些效果如果不借助 Javascript 是无法实现的，比如“逐字打印”效果：

```typescript
function typewriter(node, options?) {
  const { speed = 50 } = options

  const valid =
    node.childNodes.length === 1 && node.childNodes[0].nodeType === 3

  if (!valid) {
    throw new Error(
      `This transition only works on elements with a single text node child`
    )
  }

  const text = node.textContent
  const duration = text.length * speed

  return {
    duration,
    tick: (t) => {
      const i = ~~(text.length * t)
      node.textContent = text.slice(0, i)
    },
  }
}
```

## 10.f 过渡事件

了解过渡事件的开始和结束可能会很有用，`Svelte` 调度监听事件和监听其他 DOM 事件是一样的。

```html
<p
    transition:fly={{ y: 200, duration: 2000 }}
    on:introstart={() => (status = 'intro started')}
    on:introend={() => (status = 'intro ended')}
    on:outrostart={() => (status = 'outro started')}
    on:outroend={() => (status = 'outro ended')}
>
    Flies in and out
</p>
```

## 10.g 局部过渡

添加或销毁任何标签的容器块，过渡都会在标签上播放。举个例子，在一个列表中，针对列表项的过渡效果会在列表切换可见性时也播放过渡效果。如果仅想让过渡效果在标签本身发生切换时播放，可以通过局部（local）过渡来实现。

```html
{#if showItems} {#each items.slice(0, i) as item}
<div transition:slide|local>{item}</div>
{/each} {/if}
```

## 10.h 延时过渡

Svelte 过渡引擎中有一项特别强大的功能就是可以设置延时(delay)过渡，以便多个效果之间协调。

这里使用了 `crossfade` 函数来实现过渡效果，该函数会创建一对名为 `send` 和 `receive` 的函数。当一个标签被 `send` 时，它会寻找一个被 `receive` 的标签，并赋予一个过渡效果，反之亦然。如果没有对应的接收方，过渡效果将会设置为 `fallback`。

# 11. Animations

## 11.a 动画指令

在上一节中，我们使用 `crossfade` 转换实现了元素从一个列表移动到另一个列表的过渡动画。

但是仍然缺少元素在二个列表之间的过渡动画。为此，可以使用 `animate` 指令。

```html
import { flip } from 'svelte/animate' <label in:receive={{ key: todo.id }}
out:send={{ key: todo.id }} animate:flip={{ duration: 200 }} >
```

请注意，所有的过渡和动画都是使用 CSS 而不是 JavaScript 实现的，这意味着它们不会被主线程阻塞。

# 12. Actions

## 12.a 使用指令

`Actions` 本质上是用来操作元素生命周期的方法，一般在以下这些情况下非常有用：

- 作为第三方库的接口。

- 延迟加载图片。

- tooltips。

- 添加自定义事件处理。

在接下来的例子中，我们会尝试让一个元素变成“可拖动”，并且实现三个非原生 DOM 的事件：`panstart`，`panmove` 和 `panend`。

```html
<div
  class="box"
  use:pannable
  on:panstart="{handlePanStart}"
  on:panmove="{handlePanMove}"
  on:panend="{handlePanEnd}"
  style="transform: translate({$coords.x}px,{$coords.y}px) rotate({$coords.x *
    0.2}deg)"
/>
```

要让 `div` 元素拥有 `panstart`，`panmove` 和 `panend` 事件，需要使用 `use:pannable` 指令。然后在 pannable 中在合适的地方派发这三个事件。

```typescript
function handleMousedown(event: MouseEvent) {
  x = event.clientX
  y = event.clientY

  node.dispatchEvent(
    new CustomEvent('panstart', {
      detail: { x, y },
    })
  )

  window.addEventListener('mousemove', handleMousemove)
  window.addEventListener('mouseup', handleMouseup)
}
```

上面的代码片断就是 pannable 库中实现的当元素触发原生 DOM 事件 `mousedown` 后，记录下 x, y 并派发 `CustomEvent`。

## 12.b 添加参数

同过渡和动画一样，`Action` 也可以包含参数。这些参数将会同元素一起被调用。

要注意的是如果参数会在运行时被改变，`Action` 除了返回 `destroy` 方法以外，还需要提供一个更新参数的方法 `update`：

```typescript
export function longpress(node: HTMLElement, duration: number) {
  // ...
  return {
    destroy() {
      // ...
    },
    update(newDuration) {
      duration = newDuration
    },
  }
}
```

# 13. class

## 13.a 样式指令

和其他的属性一样，你也可以在指定样式属性时使用 JavaScript 属性：

```html
<button
  class={current === 'foo' ? 'selected' : ''}
  on:click={() => (current = 'foo')}
>
  foo
</button>
```

这在 UI 开发中会被经常使用，所以 `Svelte` 提供了一个特殊的指令来简化上面的判断。

```html
<button
  class:selected="{current === 'foo'}"
  on:click="{() => (current = 'foo')}"
>
  foo
</button>
```

## 13.b 简写指令

通常情况下，样式的类名往往会和控制他们是否生效的变量名相同：

```html
<script lang="ts">
  let big = false
</script>

<style>
  .big {
    font-size: 4em;
  }
</style>

<label>
  <input type="checkbox" bind:checked="{big}" />
  big
</label>

<div class:big="{big}">
  some {big ? 'big' : 'small'} text
</div>
```

这种情况下 `Svelte` 提供了一个和 JavaScript 类似的简写指令：

```html
<div class:big>
  some {big ? 'big' : 'small'} text
</div>
```

# 14. 组件子级

## 14.a Slots

如果有这么一些元素：

```html
<div>
  <p>I'm a child of the div</p>
</div>
```

如果想将它们插入到自定义组件中时，可以在自定义组件中使用 `<slot>` 作为占位元素，像这样：

```html
<div class="box">
  <slot />
</div>
```

然后就可以这么使用：

```html
<script lang="ts">
  import Box from './14.a_box.svelte'
</script>

<Box>
  <div>
    <p>I'm a child of the div</p>
  </div>
</Box>
```

## 14.b Slot fallbacks

组件可以为没有内容的 `slot` 设置 fallback。具体作法就是在 `<slot>` 元素内插入内容：

```html
<div class="box">
  <slot>
    <em>no content was provided</em>
  </slot>
</div>
```

此时，如果使用这个 `Box` 自定义组件时，没有插入内容，则 `slot` 位置会用 `<em>` 作为 fallback 填充。

## 14.c Named slots

上二章节使用了一个默认插槽（default slot），有时候你可能需要对子级进行更细分的设置（即包含了多个不同层级的插槽），在这种情况下可以使用命名插槽（named slots）。

在 `card` 组件中，给每一个 `slot` 添加 `name` 属性：

```html
<article class="contact-card">
  <h2>
    <slot name="name">
      <span class="missing">Unknow name</span>
    </slot>
  </h2>

  <div class="address">
    <slot name="address">
      <span class="missing">Unknow address</span>
    </slot>
  </div>

  <div class="email">
    <slot name="email">
      <span class="missing">Unknow email</span>
    </slot>
  </div>
</article>
```

然后在使用 `card` 组件的地方，为 `slot` 添加内容时也加上属性 `slot="..."`：

```html
<script lang="ts">
  import ContactCard from './14.c_card.svelte'
</script>

<ContactCard>
  <span slot="name">P. Sherman</span>
  <span slot="address">
    42 Wallaby Way <br />
    Sydney
  </span>
  <span>Hello</span>
</ContactCard>
```

注意你会在浏览器的 `Console` 面板收到一个警告，告诉你接收到了一个不符合预期的 `slot "default"`，此时 `<span>Hello</span>` 就是一个默认插槽的内容，并且它不会被显示。

## 14.d 检查 slot 内容

在某些情况下，我们希望控制组件中的某些部分仅在 slot 有内容的情况下才显示，或者某些样式仅在 slot 有内容的情况下才使用。这个时候我们就需要使用到 `$$slots` 变量。

`$$slots` 是一个对象，它的键是 `slot name`，当父组件传入了指定的 `slot` 的内容时，该对象就会被设置为以 `slot name` 为 key，对应的 value 为 true。（默认插槽的 key 为 'default'）

```html
<article class:has-discussion="{$$slots.comments}">
  <div>
    <h2>{title}</h2>
    <p>{tasksCompleted}/{totalTasks} tasks completed</p>
  </div>
  {#if $$slots.comments}
  <div class="discussion">
    <h3>Comments</h3>
    <slot name="comments" />
  </div>
  {/if}
</article>
```

可以看到我们可以通过 `$$slots.comments` 是否有值来设置 `article` 的样式 `class:has-discussion`。另外我们也可以通过 `{#if $$slots.comments}` 来控制部分元素内容是否启用。

## 14.e Slot 属性

我们还可以将组件中的属性暴露给 `slot`。

```html
<script lang="ts">
  let hovering: boolean

  function enter() {
    hovering = true
  }

  function leave() {
    hovering = false
  }
</script>

<div on:mouseenter="{enter}" on:mouseleave="{leave}">
  <slot {hovering} />
</div>
```

首先在 `hoverable` 组件中，将 `hovering` 作为属性设置给 `slot`，注意这里的 `<slot {hovering} />` 是 `<slot hovering={hovering} />` 的简写。

然后在使用该组件的地方，使用 `let` 来暴露 `<Hoverable>` 组件内的内容：

```html
<Hoverable let:hovering>
  <div class:active="{hovering}">
    {#if hovering}
    <p>I am being hovered upon.</p>
    {:else}
    <p>Hover over me!</p>
    {/if}
  </div>
</Hoverable>
```

这里的 `<Hoverable let:hovering>` 是 `<Hoverable let:hovering={hovering}>` 的简写，另外如果你想给 `hovering` 属性起另一个名字，则可以这样写：`<Hoverable let:hovering={active}>`，这样一来变量名就被命名为 `active` 了。

要注意的是，命名插槽也可以拥有插槽属性，但是 `let` 指令不在是写在组件上，而是写在有 `slot="..."` 的标签上，比如：

```html
<Hoverable let:hovering>
  <!-- ... -->
  <div slot="footer" let:footerID>FooterID: {footerID}</div>
</Hoverable>
```

# 15. Context API

## 15.a setContext and getContext

`Context API` 提供了一种让多个组件之间互相通信的方式，该方式不需要传递属性或者函数，也不需要额外的事件。

在父组件调用 `setContext(key, data)` 后，父组件包含的所有子组件（放置在 `<slot>` 中的组件）都可以通过 `getContext(key)` 获得 `data`。

## 15.b Context keys

要注意的是 `setContext(key, data)` 中的 `key` 可以是任意属性。推荐是 `Object` 或 `Symbol` 类型，并不推荐使用字符串。因为 `context` 对于 `key` 的判断使用的是 `===` ，所以如果使用字符串，可能会因为重名的原因导致一些问题。

## 15.c Contexts vs Stores

二者的作用是非常类似的，它们的不同之处是，`store` 可以用于应用的任何部分，而 `context` 只能用于组件和它的子组件（`setContext` 和 `getContext` 只能在 `svelte` 文件中使用）。

一般情况下，你应该结合二者一起使用，因为 `context` 是不具有反应性的，所以如果值会随时变化，你应该仍然使用 `store`。

# 16. 特殊标签

## 16.a `<svelte:self>`

Svelte 包含了多种特殊标签。

`<svelte:self>` 允许组件访问自己。

举个例子来说明该标签的使用场景，假设有一个文件树的应用，文件夹组件可能会包含其他的文件夹。所以对于文件夹组件而言，可能会出现这样的代码：

```html
{#if file.type === 'folder'}
<Folder {...file} />
{:else}
<File {...file} />
{/if}
```

但是由于组件不能 `import` 自己，所以应该使用 `<svelte:self>` 来代替：

```html
{#if file.type === 'folder'}
<svelte:self {...file} />
{:else}
<File {...file} />
{/if}
```

## 16.b `<svelte:component>`

我们可以通过 `if` 块实现同一位置使用不同类型的组件。

```html
{#if selected.color === 'red'}
<RedThing />
{:else if selected.color === 'green'}
<GreenThing />
{:else if selected.color === 'blue'}
<BlueThing />
{/if}
```

以上代码也可以通过 `<svelte:component>` 来实现。

```html
<svelte:component this="{selected.component}" />
```

`this` 的值可以是任意组件的构造函数，或者假值（falsy）。如果是假值，则该组件将不会渲染。

## 16.c `<svelte:window>`

可以通过 `<svelte:window>` 标签像其他 DOM 标签一样为 `window` 对象添加监听事件。 与 DOM 标签一样也可以添加事件修饰符，比如 `preventDefault`。

```html
<svelte:window on:keydown="{handleKeydown}" />
```

## 16.d `<svelte:window>` 属性绑定

我们还可以将 `window` 事件的某些属性绑定到变量上，比如 `scrollY`。

```html
<svelte:window bind:scrollY="{y}" />
```

可以绑定以下属性：

- `innerWidth`

- `innerHeight`

- `outerWidth`

- `outerHeight`

- `scrollX`

- `scrollY`

- `online` : `window.navigator.onLine` 的别名。

除了 `scrollX` 和 `scrollY` 以外，其他的属性都是只读的。

## 16.e `<svelte:body>`

和 `<svelte:window>` 类似，`<svelte:body>` 标签允许你添加事件监听到 `document.body`。该标签与 `mouseenter` 和 `mouseleave` 事件一起使用时，不会触发 `window` 事件。

```html
<img
  class:curious="{hereKitty}"
  alt="Kitten wants to know what's going on"
  src="vite.svg"
/>
```

## 16.f `<svelte:head>`

`<svelte:head>` 允许你在页面的 `head` 标签内插入内容：

```html
<svelte:head>
  <link rel="stylesheet" href="theme.css" />
</svelte:head>
```

## 16.g `<svelte:options>`

`<svelte:options>` 标签允许你指定编译器选项。

```html
<svelte:options immutable />
```

该标签可以设置的选项有:

- `immutable={true}` : 承诺不会使用可变数据，因此编译器可以通过简单的引用对比检查来确定值是否已经改变了。

- `immutable={false}` : 默认值。

- `accessors={true}` : 为组件的属性添加 `getter` 和 `setter`。

- `accessors={false}` : 默认值。

- `namespace="..."` : 将使用 `namespace` 的组件，最常见的是 `"svg"`。

- `tag="..."` : 指定将此组件编译为自定义标签时使用的名称。

# 17. module context

## 17.a Sharing code

在之前的例子中，所有组件中都是使用的 `<script>` 标签，每个组件实例开始运行时都会执行标签内的代码进行初始化，这对于绝大部分的组件来讲都是合适的。

但在某些情况下，你可能需要在每个组件实例之外运行一些额外的代码。比如说你有五个音频播放器组件实例，如果其中某个实例开始播放了，那最好是能让其他音频播放器实例停止播放。

```html
<script lang="ts" context="module">
  let current: HTMLAudioElement
</script>
```

因为添加的 `current` 是在 `<script context="module">` 中的，所以该变量无论创建了多少个组件实例，`current` 只会有一个。

```html
<audio bind:this="{audio}" bind:paused on:play="{stopOthers}" controls {src} />
```

```typescript
function stopOthers() {
  if (current && current !== audio) {
    current.pause()
  }
  current = audio
}
```

此时可以在音频开始播放的事件中调用 `stopOthers`，用来暂停其他的播放器。

## 17.b Exports

所有从 `context="module"` 的 `script` 标签中导出的内容，都会成为该组件模块导出的一部分。

```html
<script lang="ts" context="module">
  let current: HTMLAudioElement

  const elements = new Set<HTMLAudioElement>()

  export function stopAll() {
    elements.forEach((element) => {
      element.pause()
    })
  }
</script>
```

在其他地方可以导入 `stopAll` 方法：

```typescript
import AudioPlayer, { stopAll } from './17.a_audio.svelte'
```

要注意的是你不能在 `context="module"` 的标签中 `export default`。因为组件本身就是作为 `default` 导出的。

# 18. 调试

## 18.a The @debug tag

一般情况下你可以使用 `console.log(...)` 进行调试。但如果你需要在某一步停止程序运行，则可以使用 `{@debug ...}` 标签。`...` 为你想要查看的变量的列表（以 `,` 分隔）。

