import fetch from 'node-fetch';
import cheerio from 'cheerio';

const getBodyText = $ =>
  $('body').text().replace(/[\s\n]/g, '')

export default url => fetch(url + '?sp_sn=sp000001&dum=' + Date.now() / 1000)
  .then(res => res.text())
  .then(text => cheerio.load(text))
  .then(getBodyText)
  .then(body => {
    const res = /待ち人数(\d*)人待ち\(約(\d*)分\)(本日(\d*)番)?/g.exec(body);
    if (!res) throw 'unexpected_format ' + body;
    return [+res[1], +res[2], res[4] ? +res[4] : 0];
  })
  .then(([numWait, timeWait, totalNum]) => ({ numWait, timeWait, totalNum }))
