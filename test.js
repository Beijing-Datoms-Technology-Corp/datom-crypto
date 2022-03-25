//对datom-crypto包的API的测试

const test = require('brittle')
const b4a = require('b4a')    //b4a包是对输入的字符进行格式转换，否则无法进行加密
const crypto = require('./')
const jws = require('jws')


// test crypto.keyPair function ()
const keyPair = crypto.keyPair()

console.log('测试-----------------------\n')
  
console.log('publicKey is:\n',keyPair.publicKey.toString('hex'))
console.log('secretKey is:\n',keyPair.secretKey.toString('hex'))

  

//验证key

const keyPair1 = crypto.keyPair()
const keyPair2 = crypto.keyPair()

console.log('测试-----------------------\n')

console.log('验证两个key是否一致 Y/N：\n',crypto.validateKeyPair({ publicKey: keyPair1.publicKey, secretKey: keyPair2.secretKey }))
console.log('验证两个key是否一致 Y/N:\n',crypto.validateKeyPair({ publicKey: keyPair1.publicKey, secretKey: keyPair1.secretKey }))


//用keyPair生成的secretkey密钥对message进行签名
const message = b4a.from('hello world')
const sig = crypto.sign(message, keyPair.secretKey)
console.log('sign message using secretKey is\n', sig.toString('hex'))



//hash leaf

const data = b4a.from('hello world')

console.log('测试-----------------------\n')


console.log(`hash ${data} leaf is\n`,crypto.data(data).toString('hex')) 


//hash parent node
const data1 = b4a.from('hello world')

const parent = crypto.parent({
    index: 0,
    size: 11,
    hash: crypto.data(data1)
  }, {
    index: 2,
    size: 11,
    hash: crypto.data(data1)
  })

console.log('测试-----------------------\n')


console.log('两个merkle tree的节点的父节点的hash\n',parent)


  //测试tree 

const roots = [
    { index: 3, size: 11, hash: b4a.alloc(32) },
    { index: 9, size: 2, hash: b4a.alloc(32) }
  ]

console.log('测试-----------------------\n')

console.log('merkle tree的root hash is:\n',crypto.tree(roots).toString('hex'))


//对JSON格式的数据进行签名,使用JWS包里的函数。

rawdata = {
  Id01:{
  'name':'jerry zhang',
  'banks':'ICBC',
  'account':'28289x-229',
  'balance': '72882973'
  },
  Id02:{
  'name':'Chris zhang',
  'banks':'IBC',
  'account':'128289x-229',
  'balance': '728s82973'
  },
  Id03:{
  'name':'jerry zhang',
  'banks':'ICBC',
  'account':'28289x-229',
  'balance': '72882973'
  }
}


const sign_jws = jws.sign({
  header: { alg: 'HS256' },
  payload: rawdata,
  secret: keyPair.secretKey,
});

console.log('JWS sign is :\n',sign_jws)

console.log('verify Y/N?\n',jws.verify(sign_jws,'HS256',keyPair.secretKey))

console.log('decode the JWS signature above:\n', jws.decode(sign_jws))

