import {
    assert,
    ByteString,
    method,
    prop,
    toByteString,
    SmartContract,
} from 'scrypt-ts'

class Demo extends SmartContract {
    @prop()
    x: ByteString
    @prop()
    y: ByteString
  
    constructor(x: ByteString, y: ByteString) {
        super(x, y)
        this.x = x
        this.y = y
    }
  
    @method()
    public helloworld() {
        console.log(this.x + this.y)
        assert(this.x + this.y == toByteString('helloworld', true))
    }
}
