const obj = {
  name:'hhh',
  age:18
}

// 对proxy进行重构
function reactiveProxy(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const depend = getDepend(target, key)
      // depend.addDepend(activeFn)
      depend.depend()
      return Reflect.get(target, key, receiver)
    },
    set(target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver)
      const depend = getDepend(target, key)
      // console.log(depend)
      depend.notify()
    }
  })
}

const objProxy = reactiveProxy(obj)

class Depend {
  constructor() {
    // this.reactiveFns = []
    this.reactiveFns = new Set() // 如果一个依赖中某个属性被调用两次，就会造成函数的重复执行，使用Set可以解决这个问题
  }
  // addDepend(reactiveFn) {
  //   this.reactiveFns.push(reactiveFn)
  // }
  // 优化，直接在depend类中对这个方法进行执行
  depend() {
    if(activeFn){
      this.reactiveFns.add(activeFn)
    }
  }
  notify() {
    this.reactiveFns.forEach((fn) => {
      fn()
    })
  }
}

const depend = new Depend()


// 每个对象都要对应一个depend对象

// 封装一个获取depend函数
const targetMap = new WeakMap()
function getDepend(target,key) {
  // 根据target对象获取map
  // debugger
  let map = targetMap.get(target)
  // console.log(map)
  if(!map){
    map = new Map()
    targetMap.set(target,map)
  }
  // 根据key获取
  let depend = map.get(key)
  if(!depend) {
    depend = new Depend()
    map.set(key,depend)
  }
  return depend
}

// 定义一个全局对象，把依赖函数传入
let activeFn = null
function watchFn(fn) {
  activeFn = fn
  // depend.addDepend(fn)
  fn()
  activeFn = null
}

// watchFn(() => {
//   console.log(objProxy.name)
//   console.log('--------函数1被调用--------')
// })

// watchFn(() => {
//   console.log(objProxy.age)
//   console.log('--------函数2被调用--------')
// })

// objProxy.name = 'hehehe'
// objProxy.name = 'hihihi'
// objProxy.name = 'hahaha'
// objProxy.age = 88

const infoProxy = reactiveProxy({
  address: "广州市",
  height: 1.88
})
watchFn(() => {
  console.log(infoProxy.address)
})

infoProxy.address = "北京市"
