# CustomValidator

基于策略模式的表单验证

## 简单说明

这是一个仿 element ui 表单验证风格的纯 js 库，它的需求在于：非框架使用，而且要求兼容低端设备，体积小，方便使用，是本人参考策略模式的一种实现。

`add`函数的第一个参数：表单元素 dom，比如 input 的 dom 对象

`add`的第二个参数：它是一个 rule 规则数组，数组中每个对象只能处理一种规则，比如最大最小只能作为两个对象传入数组中。

```javascript
[
  { min: 5, message: "最小5位", trigger: "blur" },
  { max: 10, message: "最大10位", trigger: "blur" },
];
```

`trigger`是支持多个事件的，如果需要多个事件，请传入一个数组：

```javascript
[{ min: 5, message: "最小5位", trigger: ["blur", "input"] }];
```

个人目前已知的表单元素支持的事件有：`input、blur、change、focus`。

在使用`add`去添加一个表单元素校验的时候，可以传入第三个参数，它是一个函数，在这个函数里我们可以接受到两个参数：

1. 错误对象（非常经典的 node 系的那种错误判断，第一个参数是 error 对象），不报错则是 undefined
2. 表单元素 dom 本身

我们可以在这个函数里处理一些事情，比如给 dom 加上错误的 class 之类的，因为我希望表单校验的库只做一件事，那就是校验，我只告诉你成功与否，剩下的就交给你了。

## 扩展策略类

目前策略仅支持：required、min、max、email、year、month、date

有需要可以自行扩充策略对象：`strategies`

代码不难，阅读下就明白怎么回事了，都有注释哦。

## 策略模式

策略模式有三个角色：

1. 抽象策略角色
2. 具体策略角色
3. 环境类角色

抽象策略角色定义了接口用于约束具体的策略角色，由于 js 还没有抽象这个东西，所以我这用 ts 来表示一下

```typescript
/** rule类型 */
type Rule = {
  /** 错误的消息 */
  message: string;
  /** 其他参数 */
  [key: string]: any;
};
/** 回调函数 */
type Callback = (error: Error, dom: HTMLElement) => void;

/** 抽象的策略角色 */
abstract class Strategies {
  /** 统一的使用方法 */
  public abstract validate(rule: Array<Rule>, callback: Callback, isManual: boolean): boolean;
}
```

在强类型语言中，比如 java，它的函数不是一等公民，所以它们的写法上会优先使用 class 类去实现，所以你会发现很多设计模式，在 js 上可以通过一个函数就完成了。

所以有时候也不一定非要一模一样照搬，我们要领悟它为什么这么写。

所以在 js 上我们可以不通过类去实现，我们直接定义接口就好了。

```typescript
/** js的统一的使用方法 */
type Validate = (rule: Array<Rule>, callback: Callback, isManual: boolean) => boolean;

/** js的抽象策略角色 */
interface JsStrategies {
  /** 统一的使用方法 */
  [key: string]: Validate;
}
```

这个时候我们可以去尝试写一个具体实现了

```typescript
/** js的策略角色 */
const strategies: JsStrategies = {
  /** 非空 */
  required(rule: Array<Rule>, callback: Callback, isManual: boolean) {
    return true;
  },
};
```

具体实现有了后，我们需要一个环境类角色，它用于外界去调用策略的，策略可以看成是 36 计，环境就是诸葛亮，诸葛亮根据情况去使用对应的计策。

具体实现就不写了，参考源码吧！
