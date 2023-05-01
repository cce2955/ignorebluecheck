// kofi.js
(function() {
  var script = document.createElement('script');
  script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
  script.onload = function() {
    kofiwidget2.init('Support Me on Ko-fi', '#29abe0', 'N4N7KVUMF');
    kofiwidget2.draw();
  };
  document.body.appendChild(script);
})();
