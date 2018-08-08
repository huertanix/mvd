var ref = require('ssb-ref')
var client = require('ssb-client')
var sbot = require('./scuttlebot')
var config = require('./config')()

var keys = require('./keys')

module.exports = function () {
  sbot.friends.get({source: sbot.id, dest: keys.id}, (err, follows) => {
    if (follows) return

    var data = ref.parseInvite(config.invite)

    client(keys, {
      remote: data.invite,
      caps: config.caps,
      manifest: {invite: {use: 'async'}, getAddress: 'async'}
    }, (err, remotebot) => {
      if (err) throw err
      remotebot.invite.use({feed: keys.id}, (_, msg) => {
        if (msg) {
          sbot.publish({
            type: 'contact',
            contact: data.key,
            following: true
          })
        }
      })
    })

    // I think this forces a refresh or helps with debugging or something
    setTimeout(() => {
      location.hash = '#' + keys.id
      location.hash = '#'
    }, 100)
  })
}
