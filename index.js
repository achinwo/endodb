"use strict";
const EventEmiter = require("events")

var Enum = require('enum')
const Event = new Enum(['created', 'deleted', 'updated'])

class IEndoDbClient {
    
}

class EndoDbModel {

    constructor(db, kwargs){
        this._db = db
        this.master.emit(Event.created, this)
    }

    destroy(options){
        this.master.emit(Event.deleted, this)
    }

    setValue(key, value){
        this.master.emit(Event.updated, this)
    }

    getValue(key){

    }

    get db() { return this._db }
    get master() { return this.constructor.MASTER }
    get path() { return this.constructor.BASE_PATH }
    get meta() { return this._meta }

    save(){

    }

    static createMaster(){
        let m = new EventEmiter()
        m.val = 'Base'
        return m
    }
}
EndoDbModel.Event = Event
EndoDbModel.MASTER = EndoDbModel.createMaster()

class User extends EndoDbModel {

    static createMaster(){
        let m = EndoDbModel.createMaster()
        m.val = 'User'
        return m
    }
}
User.MASTER = User.createMaster()

class EndoDb extends EventEmiter {
    
    constructor(client, options){
        super()
        this.client = client
    }
    
    new(modelCls, kwargs){
        return new modelCls(this, kwargs || {})
    }
}

if(!module.parent){
    console.log('hello node')
    let c = new EndoDb('CLIENT!!')

    User.MASTER.once(Event.created, ()=>{
        console.log('user created!')
    })

    let m = c.new(User)
    console.log('M:', m.master)
}