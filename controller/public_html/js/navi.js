function showNotify(info = '') {
  new Noty({
    text: info,
    timeout: 3000
  }).show();
}
