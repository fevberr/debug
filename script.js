function 0() {
  var btn = document.querySelector('.bookmarklet-btn');
  if (btn) {
    btn.addEventListener('click', function(e) {
      var href = btn.getAttribute('href');
      if (href && href.startsWith('javascript:')) {
        e.preventDefault();
        eval(href.substring(11));
      }
    });
  }
}

function 1() {
  var imgs = document.querySelectorAll('.markdown-body img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].setAttribute('loading', 'lazy');
  }
}

function 2() {
  var codes = document.querySelectorAll('.markdown-body pre code');
  for (var i = 0; i < codes.length; i++) {
    var html = codes[i].innerHTML;
    codes[i].innerHTML = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

function 3() {
  var links = document.querySelectorAll('.markdown-body a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('target') === null) {
      links[i].setAttribute('target', '_blank');
      links[i].setAttribute('rel', 'noopener noreferrer');
    }
  }
}

function 4() {
  var container = document.querySelector('.markdown-body');
  if (container) {
    var style = document.createElement('style');
    style.textContent = '.markdown-body img[alt="Jade Preview"] { border: 1px solid #2d3748; transition: all 0.2s; } .markdown-body img[alt="Jade Preview"]:hover { box-shadow: 0 0 0 2px #00ff9f40; }';
    container.appendChild(style);
  }
}

function 5() {
  var btn = document.querySelector('.bookmarklet-btn');
  if (btn && !btn.hasAttribute('data-enhanced')) {
    btn.setAttribute('data-enhanced', 'true');
    var originalHtml = btn.innerHTML;
    if (originalHtml.indexOf('✨') === -1) {
      btn.innerHTML = '✨ ' + originalHtml;
    }
  }
}

window.addEventListener('DOMContentLoaded', function() {
  0();
  1();
  2();
  3();
  4();
  5();
});
