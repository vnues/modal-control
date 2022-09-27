// 从 moalMap中读取所有的 modal项
export const getAllModalList = modalInfo => {
  let currentList = []
  if (modalInfo.modalList) {
    currentList = currentList.concat(
      modalInfo.modalList.reduce((t, c) => t.concat(c.name), [])
    )
  }
  if (modalInfo.children) {
    currentList = currentList.concat(
      Object.keys(modalInfo.children).reduce((t, c) => {
        return t.concat(getAllModalList(modalInfo.children[c]))
      }, [])
    )
  }
  return currentList
}
class Monitor {
  constructor(obj, cb) {
    this.OP = Object.prototype
    this.types = {
      obj: '[object Object]',
      array: '[object Array]'
    }
    if (this.OP.toString.call(obj) !== this.types.obj && this.OP.toString.call(obj) !== this.types.array) {
      return false;
    }
    this.OAM = ['push', 'pop', 'shift', 'unshift', 'short', 'reverse', 'splice']
    this._callback = cb;
    this.observe(obj);
  }
    observe(obj, path) {
        if (this.OP.toString.call(obj) === this.types.array) {
            this.overrideArrayProto(obj, path);
        }
        Object.keys(obj).forEach((key)=>{
                let oldVal = obj[key];
                let pathArray = path && path.slice();
                if (pathArray) {
                    pathArray.push(key);
                } else {
                    pathArray = [key];
                }
                Object.defineProperty(obj, key, {
                    get: function() {
                        return oldVal;
                    },
                    set: (function(newVal) {
                            if (oldVal !== newVal) {
                                if (this.OP.toString.call(newVal) === '[object Object]') {
                                    this.observe(newVal, pathArray);
                                }
                                this._callback(newVal, oldVal, pathArray)
                                oldVal = newVal
                            }
                        }
                    ).bind(this)
                })
                if (this.OP.toString.call(obj[key]) === this.types.obj || this.OP.toString.call(obj[key]) === this.types.array) {
                    this.observe(obj[key], pathArray)
                }
            }
            , this)
    }
    overrideArrayProto(array, path) {
        // 保存原始 Array 原型
        var originalProto = Array.prototype, // 通过 Object.create 方法创建一个对象，该对象的原型是Array.prototype
            overrideProto = Object.create(Array.prototype), self = this, result;
        // 遍历要重写的数组方法
        this.OAM.forEach((method)=>{
                Object.defineProperty(overrideProto, method, {
                    value: function() {
                        var oldVal = this.slice();
                        //调用原始原型上的方法
                        result = originalProto[method].apply(this, arguments);
                        //继续监听新数组
                        self.observe(this, path);
                        self._callback(this, oldVal, path);
                        return result;
                    }
                })
            }
        );
        // 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto
        array.__proto__ = overrideProto;

    }
}

class Observe {
    constructor(arr,cb) {
        this.cb = cb
        this.arr = arr
        this.types = ['shift', 'push']
        this.observe()
    }
    observe(){
        let originProto = Array.prototype
        let customProto = Object.create(originProto)
        let self = this
        console.log(self, '_______')
        this.types.forEach(item=>{
            customProto[item] = function () {
                console.log(item)
                console.log(this, '+++++++')
                self.cb()
                return originProto[item].apply(this, arguments)
            }
        })
        this.arr.__proto__= customProto
    }
}
export const MonitorArr = Observe