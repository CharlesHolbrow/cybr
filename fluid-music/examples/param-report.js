const fluid = require('../');

const client = new fluid.Client(9999);

const m1 = [
  fluid.global.activate("deleteme.tracktionedit", true),
  fluid.audiotrack.select('hi'),
  fluid.pluginTStereoDelay.select(),
  {
    address: '/plugin/param/report',
  }
]

client.send(m1)
.then((data) => {
  console.dir(data, {depth:null})

  for (const oscMsg of data.elements) {
    console.log(oscMsg.address);
    if (oscMsg.address !== '/plugin/param/report/reply') continue;

    const details = oscMsg.args[1];
    const jsonStr = oscMsg.args[2];

    console.log('details:', details && details.value);
    console.log('json:', jsonStr && jsonStr.value);

    if (jsonStr && jsonStr.type === 'string')
      console.log(JSON.parse(jsonStr.value));
  }
});
