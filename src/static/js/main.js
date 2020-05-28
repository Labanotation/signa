$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
  $('.toast').toast({
    autohide: false
  })
  checkAdBlocker()
})

function checkAdBlocker () {
  var test = document.createElement('div')
  test.innerHTML = '&nbsp;'
  test.className = 'adsbox'
  document.body.appendChild(test)
  window.setTimeout(() => {
    if (test.offsetHeight === 0) {
      document.body.classList.add('adblocked')
      $('#toast-adblocker').toast('show')
    }
    test.remove()
  }, 100)
}