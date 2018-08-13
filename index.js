var h = require('hyperscript')

// var $ = require('jquery');
// window.$ = $;
//require('bootstrap') 

var route = require('./views')
var avatar = require('./avatar')

var compose = require('./compose')

var id = require('./keys').id

document.head.appendChild(h('title', 'Baculus Chat'))
document.head.appendChild(h('link', {rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico'}))
//document.head.appendChild(h('link', {rel: 'stylesheet', href: '/css/bootstrap.min.css'}))
document.head.appendChild(h('meta', {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'}))
// workaround to get bootstrap working
document.head.appendChild(h('style', require('./bootstrap.min.css.json')))

document.head.appendChild(h('style', require('./style.css.json')))

var screen = h('div#screen')

var search = h('input.search', {type: 'search', placeholder: 'Search'})

var nav = h('div.navbar.navbar-default.navbar-fixed-top',
  h('div.container',
    // h('div.row',
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-12', h('a', {href: '#' + id}, h('span.avatar--small', avatar.image(id)), h('span', avatar.name(id)))),
      // h('li.col-xl-1.col-lg-1.col-md-1.col-sm-6', h('a', {href: '#' + id}, avatar.name(id))),
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-6#new-post-link', h('a#new-post-link', 'New Post', {
        onclick: function () {
          if (document.getElementById('composer')) { return }
          else {
            var currentScreen = document.getElementById('screen')
            var opts = {}
            opts.type = 'post'
            var composer = h('div.content#composer', h('div.message', compose(opts)))
            if (currentScreen.firstChild.firstChild) {
              currentScreen.firstChild.insertBefore(composer, currentScreen.firstChild.firstChild)
            } else {
              currentScreen.firstChild.appendChild(composer)
            }
            scroll(0,0)
          }
        }
      })),
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-6', h('a#new-wiki-link', 'New Wiki', {
        onclick: function () {
          if (document.getElementById('composer')) { return }
          else {
            var currentScreen = document.getElementById('screen')
            var opts = {}
            opts.type = 'wiki'
            var composer = h('div.content#composer', h('div.message', compose(opts)))
            if (currentScreen.firstChild.firstChild) {
              currentScreen.firstChild.insertBefore(composer, currentScreen.firstChild.firstChild)
            } else {
              currentScreen.firstChild.appendChild(composer)
            }
            scroll(0,0)
          }
        }
      })),
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-4', h('a', {href: '#' }, 'All')),
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-4', h('a', {href: '#private' }, 'Private')),
      h('li.col-xl-1.col-lg-1.col-md-4.col-sm-4', h('a', {href: '#mentions' }, 'Mentions')),
      //h('li.col-xl-1.col-lg-1.col-md-1.col-sm-12', h('a', {href: '#key' }, 'Key')), // TODO: Move this to profile page
      //h('li.col-xl-1.col-lg-1.col-md-1.col-sm-6', h('a.help-link', {href: '#about'}, '?')),
      // h('li.col-xl-1.col-lg-1.col-md-12.col-sm-12.col-xl-offset-1.col-lg-offset-1', h('form.search', { 
      //   onsubmit: function (e) {
      //     if (search.value[0] == '#')
      //       window.location.hash = '#' + search.value
      //     else
      //       window.location.hash = '?' + search.value
      //     e.preventDefault()
      //   }},
      //   search)
      // ) // this shit was already broken
    //)
  )
)

document.body.appendChild(nav)
document.body.appendChild(screen)
route()

window.onhashchange = function () {
  var oldscreen = document.getElementById('screen')
  var newscreen = h('div#screen')
  oldscreen.parentNode.replaceChild(newscreen, oldscreen)
  route()
}

