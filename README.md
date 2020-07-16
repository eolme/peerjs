# PeerJS: Simple peer-to-peer with WebRTC <sup>ESNext</sup> #

PeerJS provides a complete, configurable, and easy-to-use peer-to-peer API built on top of WebRTC.


## Warning

This fork only supports data connections and json serialization.


## Setup


**Include the library**

  with npm:
        `npm install peerjs`
    and the usage:
  ```js
  import Peer from 'peerjs-esnext';
  ```


**Create a Peer**  
```javascript
const peer = new Peer('pick-an-id'); 
// You can pick your own id or omit the id if you want to get a random one from the server.
```

## Data connections
**Connect**
```javascript
const conn = peer.connect('another-peers-id');
conn.on('open', () => {
  conn.send('hi!');
});
```
**Receive**
```javascript
peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    // Will print 'hi!'
    console.log(data);
  });
  conn.on('open', () => {
    conn.send('hello!');
  });
});
```

## Running tests

```bash
npm test
```

## FAQ

Q. I have a message ```Critical dependency: the request of a dependency is an expression``` in browser's console

A. The message occurs when you use PeerJS with Webpack. It is not critical! It relates to Parcel https://github.com/parcel-bundler/parcel/issues/2883 We'll resolve it when updated to Parcel V2.


## Links

### [Documentation / API Reference](https://peerjs.com/docs.html)

### [PeerServer](https://github.com/peers/peerjs-server)

### [Discuss PeerJS on our Telegram Channel](https://t.me/joinchat/ENhPuhTvhm8WlIxTjQf7Og)

### [Changelog](https://github.com/peers/peerjs/blob/master/changelog.md)

## License

PeerJS is licensed under the [MIT License](https://tldrlegal.com/l/mit).

