# datom-crypto
datom协议中，需要用到的涉及加密的方法和函数。包括非对称加密、对称加密以及JWS。

```js
npm install datom-crypto
```

## 用法

```js
const crypto = require('datom-crypto')

//生成一对新的keyPair: {keyPair.PublicKey, keyPair.secretKey}

const keyPair = crypto.keyPair()
  
console.log('publicKey is ',keyPair.publicKey.toString('hex'))
console.log('secretKey is',keyPair.secretKey.toString('hex'))


//用keyPair生成的secretkey密钥对message进行签名
const message = b4a.from('hello world')
const sig = crypto.sign(message, keyPair.secretKey)
console.log('sign message using mySecretKey is', sig.toString('hex'))


//对JSON格式的数据进行签名
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
  header: { alg: 'HS256' },  //参照JWS规范
  payload: rawdata,  
  secret: keyPair.secretKey,
});

console.log('JWS sign is :\n',sign_jws)

```

## API 
```js
keyPair = crypto.keyPair()
```
返回一个ED25519的keypair，用于后续merkle Tree的签名。

```js
signature = crypto.sign(message, secretKey)
```
用secretKey对message (buffer)签名.

```js
verified = crypto.verify(message, signature, publicKey)
```
对message，验证其签名.

```js
hash = crypto.data(data)
```
对merkle tree的一个node进行hash.

```js
hash = crypto.parent(left, right)
```
对merkle tree的一个父节点hash。树的左、右节点格式要求如下：

```js
{
  index: treeIndex,
  hash: hashOfThisNode,
  size: byteSizeOfThisTree
}
```

```js
hash = crypto.tree(peaks)
```
merkle tree的根节点的hash. 

```js
buffer = crypto.randomBytes(size)
```
返回一个特定大小的,包含随机bytes的buffer.

```js
hash = crypto.discoveryKey(publicKey)
```
从keyPair.publicKey计算出discoveryKey，而无需直接暴露discoverKey.

```js
list = crypto.namespace(name, count)
```
从一个特定公开的name生成一个namespace的清单。

