# Super simple airplay client

This is a minimalist airplay client that plays a given HLS stream on the first Airplay device that it finds on the local network.

## Installation:

### Requirements
- [node.js](https://nodejs.org) v6 or higher
- multicast DNS support - see [mdns](https://www.npmjs.com/package/mdns) for additional dependencies you will need to satisfy if on Linux or Windows.

```
git clone git@github.com:neufeldtech/super-simple-airplay.git
cd super-simple-airplay
npm install
```
## Usage

```
npm start HLS_URL [START_POSITION]
```

## Examples
To run the demo stream: (http://devimages.apple.com/iphone/samples/bipbop/gear4/prog_index.m3u8)

```
npm start
```

To play a given stream:

```
npm start http://yourdomain.com/hls/index.m3u8
```

To play a given stream starting at 55% through the stream

```
npm start http://yourdomain.com/hls/index.m3u8 0.55
```