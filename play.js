var request = require('request');
var net = require('net');
var mdns = require('mdns');

var baseContentLength = 41
var stream = process.argv[2] || "http://devimages.apple.com/iphone/samples/bipbop/gear4/prog_index.m3u8"
var position = process.argv[3] || '0.0'
var streamContentLength = stream.length
var contentLength = baseContentLength + streamContentLength;

var isPlaying = function (host, port, callback) {
  request(`http://${host}:${port}/playback-info`, function (err, res, body) {
    if (err) throw err;
    if (/\<key\>readyToPlay\<\/key\>\s+\<true\/>/g.test(body)) {
      return callback(true);
    } else {
      return callback(false)
    }
  })
}

var body =
  `POST /play HTTP/1.1
User-Agent: MediaControl/1.0
Content-Type: text/parameters
X-Apple-Session-Id: 728239bb-a094-405e-8d90-b443c8f3093d
X-Apple-Device-Id: 0xf3e49ea731ab
Content-Length: ${contentLength}

Content-Location: ${stream}
Start-Position: ${position}


`

var started = false;

var sequence = [
  mdns.rst.DNSServiceResolve(),
  mdns.rst.getaddrinfo({ families: [4] })
];

var browser = mdns.createBrowser(mdns.tcp('airplay'), {resolverSequence: sequence});
browser.on('serviceUp', function (service) {
  console.log(`Found Device: ${service.host}`);
  if (!started) {
    started = true;
    var client = new net.Socket();

    client.connect(service.port, service.host, function () {
      console.log('Connected');
      client.write(body);
    });

    client.on('data', function (data) {
      console.log('Received: ' + data);
      setTimeout(function () {
        // give the stream 10 seconds to load
        setInterval(function () {
          // Check every second if it is still playing
          isPlaying(service.host, service.port, function (stillPlaying) {
            console.log(`Content playing: ${stillPlaying}`)
            if (!stillPlaying) {
              client.end()
            }
          })
        }, 2500);
      }, 10000)
    });

    client.on('close', function () {
      console.log('Connection closed');
      console.log('Exiting!')
      process.exit(0)
    });

  }
});

browser.start();
console.log('Searching for airplay devices....')
