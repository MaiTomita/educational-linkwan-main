// 「×」ボタンを押したら同ディレクトリの Settings.html に遷移する
(function(){
  const btn = document.querySelector('.close-btn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    // 相対パスで同ディレクトリの Settings.html を開く
    window.location.href = 'Settings.html';
  });
})();
