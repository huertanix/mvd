var h = require('hyperscript')
var pull = require('pull-stream')
var sbot = require('./scuttlebot')

var header = require('./rendertools').header
var id = require('./keys').id

var mime = require('simple-mime')('application/octect-stream')
var split = require('split-buffer')

function file_input (onAdded) {
  return h('label.btn', 'Upload file',
    h('input', { type: 'file', hidden: true,
    onchange: function (ev) {
      var file = ev.target.files[0]
      if (!file) return
      var reader = new FileReader()
      reader.onload = function () {
        pull(
          pull.values(split(new Buffer(reader.result), 64*1024)),
          sbot.addblob(function (err, blob) {
            if(err) return console.error(err)
            onAdded({
              link: blob,
              name: file.name,
              size: reader.result.length || reader.result.byteLength,
              type: mime(file.name)
            })
          })
        )
      }
      reader.readAsArrayBuffer(file)
    }
  }))
}

module.exports = function (opts) {
  var files = []
  var filesById = {}

  var composer = h('div.composer')

  var container = h('div.container')
  
  var textarea = h('textarea.compose', {placeholder: 'Write a message' || opts.placeholder})

  var initialButtons = h('span', 
    h('button.btn', 'Preview', {
      onclick: function () {
      
        var msg = {}
        msg.value = {
          "author": id,
          "content": {
            "type": opts.type,
            "root": opts.root
          }
        }
        msg.value.content.text = textarea.value
        console.log(msg)

        var preview = h('div', 
          header(msg), 
          h('div.message__content', msg.value.content.text),
          h('button.btn', 'Publish', {
            onclick: function () {
              sbot.publish(msg.value.content, function (err, msg) {
                if(err) throw err
                console.log('Published!', msg)
                window.location.reload()
                if(cb) cb(err, msg)
              })
            }
          })
        )
        composer.replaceChild(preview, composer.firstChild)
      }
    }),
    file_input(function (file) {
      files.push(file)
      filesById[file.link] = file
      var embed = file.type.indexOf('image/') === 0 ? '!' : ''
      textarea.value += embed + '['+file.name+']('+file.link+')'
    })
  )

  composer.appendChild(container)
  container.appendChild(textarea)
  container.appendChild(initialButtons)

  return composer
} 

