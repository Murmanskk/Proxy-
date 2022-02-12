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
  console.log(objProxy.name)
  console.log('--------函数1被调用--------')
})

watchFn(() => {
  console.log(objProxy.age)
  console.log('--------函数2被调用--------')
})

//现在当name发生改变的时候，调用age的函数也会被执行，这样是错误的
objProxy.name = 'hehehe'
objProxy.name = 'hihihi'
objProxy.name = 'hahaha'

