const obj = {
  name:'hhh',
  age:18
}

// 1.原本使用数组来收集需要响应的函数，但是数组不方便管理
// let reactiveFns = []
// 封装响应式函数
// function watchFn(fn) {
//   reactiveFns.push(fn)
// }

// 2.改成使用类来收集需要相应的函数，收集依赖的类
/**
 *之后的每个属性都会有对应的对象，方便进行管理
 *
 * @class Depend
 */
class Depend {
  constructor() {
    this.reactiveFns = []
  }
  addDepend(reactiveFn) {
    this.reactiveFns.push(reactiveFn)
  }
  notify() {
    this.reactiveFns.forEach((item) => {
      item()
    })
  }
}

const depend = new Depend()

function watchFn(fn) {
  depend.addDepend(fn)
}

watchFn(() => {
  console.log('--------函数1被调用--------')
})

watchFn(() => {
  console.log('--------函数2被调用--------')
})

obj.name = 'hehehe'
// 自动执行，不应该，应该监听属性变化自动调用
depend.notify()
