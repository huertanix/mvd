var ref = require('ssb-ref')
var client = require('ssb-client')
var sbot = require('./scuttlebot')
var config = require('./config')()

var keys = require('./keys')
module.exports = function () {
  sbot.friends.get({dest: keys.id}, (err, follows) => {

    var data = ref.parseInvite(config.invite)

    client(keys, {
      remote: data.invite,
      caps: config.caps,
      manifest: {invite: {use: 'async'}, getAddress: 'async'}
    }, (err, remotebot) => {
      if (follows[remotebot.id]) return

      remotebot.invite.use({feed: keys.id}, (_, msg) => {
        if (msg) {
          sbot.publish({
            type: 'contact',
            contact: data.key,
            following: true
          }, (err, message) => {
            setTimeout(() => {
              location.hash = '#' + keys.id
              location.hash = '#'
            }, 100)
          })
        }
      })
    })
  })
}
