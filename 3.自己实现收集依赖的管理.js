const obj = {
  name:'hhh',
  age:18
}

const objProxy = new Proxy(obj,{
  get(target,key,receiver) {
    return Reflect.get(target, key, receiver)
  },
  set(target,key,newValue,receiver){
    Reflect.set(target, key, newValue, receiver)
    const depend = getDepend(target,key)
    console.log(depend)
    depend.notify()
  }
})

class Depend {
  constructor() {
    this.reactiveFns = []
  }
  addDepend(reactiveFn) {
    this.reactiveFns.push(reactiveFn)
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

function watchFn(fn) {
  depend.addDepend(fn)
}

watchFn(() => {
  console.log(objProxy.name)
  console.log('--------函数1被调用--------')
})

watchFn(() => {
  console.log(objProxy.age)
  console.log('--------函数2被调用--------')
})

objProxy.name = 'hehehe'
objProxy.name = 'hihihi'
objProxy.name = 'hahaha'
objProxy.age = 88

