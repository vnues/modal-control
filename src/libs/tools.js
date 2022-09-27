export class Monitor {
    constructor(data,cb) {
        this.cb = cb
        this.methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse','short']
        this.dataType = {
            arr: '[object Array]',
            obj: '[object Object]'
        }
        this.observe(data)
    }
    observe(data,path){
        let _this = this
        if(Object.prototype.toString.call(data)===this.dataType.arr){
            this.rewriteArrayPrototype(data)
        }
        Object.keys(data).forEach(key=>{
            let paths = path && path.slice()
            if(paths){
                paths.push(key)

            }else{
                paths = [key]
            }
            let oldValue = data[key]
            Object.defineProperty(data,key,{
                get:function (){
                    return oldValue
                },
                set:function (newValue){
                    if(newValue!==oldValue){
                        if(Object.values(_this.dataType).includes(Object.prototype.toString.call(newValue))){
                            _this.observe(newValue,paths)
                        }
                        _this.cb(oldValue,newValue,paths)
                        oldValue = newValue
                    }
                }
            })
            if(Object.values(this.dataType).includes(Object.prototype.toString.call(data[key]))){
                this.observe(data[key], paths)
            }
        })
    }
    rewriteArrayPrototype(data,path = []){
        let _this = this
        let originProto = Array.prototype
        let customProto = Object.create(originProto)
        this.methods.forEach(method=>{
            console.log(111)
            customProto[method] = function (){
                console.log(this,'old') //
                let length = originProto[method].apply(this, arguments)
                console.log(length, '新数组的长度')
                console.log(this, 'new')
                _this.cb(this, ...arguments, path)
                _this.observe(this, path) // 监听新长度
                return length // 返回新的数组长度
            }
        })
        data.__proto__ = customProto
    }
}
let obj = {
    level1: {
        name: 'jk'
    },
    level2: []
}
let cb = (...args)=>{
    console.log('change', ...args)
}
new Monitor(obj,cb)
// obj.level2.push([1,2,3])
// obj.level2[0].push(4)
// obj.level1.name = [1,2,3]
// obj.level1.name.push('jkingfirst')
console.log(obj)

