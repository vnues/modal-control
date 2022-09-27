export class Modal {
    constructor(list) {
        this.list = list
        this.modalQueque ={} // 监听弹框队列
        this.listens = {} // 监听事件队列
    }
    on(key,fn){
        if(!this.listens[key]){
            this.listens[key] = [fn]
        }else{
            this.listens[key].push(fn)
        }
        console.log(this.listens, '++++++')
    }
    emit(){
        console.log(arguments, 'arguments,111')
        let key = Array.prototype.shift.call(arguments) // 取第一个参数
        console.log(key, '----')
        let fns = this.listens[key]
        if(fns&&fns.length===0){
            return false
        }
        for(let i =0;i<fns.length;i++){
            console.log(arguments, 'arguments')
            fns[i].apply(this,arguments)
        }
    }
    addQueue(modalItem, backShow){
        this.modalQueque[modalItem.name]= Object.assign({},modalItem,{backShow})
        console.log(1111)
        this.preCheck()
        return this
    }
    preCheck(){
        if(this.list.length === Object.values(this.modalQueque).length){
            let list = Object.values(this.modalQueque).filter(item=>item.frontShow&&item.backShow)
            this.repeatCheck(list)
        }
    }
    repeatCheck(list){
        if(list&&list.length>0){
            this.postEmit(list)
        }
    }
    postEmit(list){
        console.log(list, '弹框合集')
        let highestLevel = list.reduce((pre,cur)=>{
            return pre.level> cur.level ? pre : cur
        },{level:-1})
        console.log(highestLevel, '最高')
        setTimeout(()=>{
            this.emit(highestLevel.name,list)
        },0)
    }
}
export const createModal = (function(){
    let instance
    return function (list){
        if(!instance){
            instance = new Modal(list)
        }
        return instance
    }
})()
