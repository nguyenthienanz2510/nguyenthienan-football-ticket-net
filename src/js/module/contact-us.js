window.onload = function () {
  // handle menu mobile
  document.querySelector('#touchBar').addEventListener('click', function () {
    document.querySelector('.nav-mobile').classList.add('nav-mobile--active');
  });
  document.querySelector('#closeNavMobile').addEventListener('click', function () {
    document.querySelector('.nav-mobile').classList.remove('nav-mobile--active');
  });

  // trustpilot slider
  let slideIndexTrustpilot = 1;
  showDivsTrustpilot(slideIndexTrustpilot);

  function plusDivsTrustpilot(n) {
    showDivsTrustpilot((slideIndexTrustpilot += n));
    console.log('Slider');
  }

  function showDivsTrustpilot(n) {
    var i;
    var x = document.getElementsByClassName('trustpilot__content-item');
    if (n > x.length) {
      slideIndexTrustpilot = 1;
    }
    if (n < 1) {
      slideIndexTrustpilot = x.length;
    }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    x[slideIndexTrustpilot - 1].style.display = 'block';
  }
  window.plusDivsTrustpilot = plusDivsTrustpilot


  //feefo slider
  let slideIndexFeefo = 1;
  showDivsFeefo(slideIndexFeefo);

  function plusDivsFeefo(n) {
    showDivsFeefo((slideIndexFeefo += n));
    console.log('Slider');
  }

  function showDivsFeefo(n) {
    var i;
    var x = document.getElementsByClassName('feefo__content-item');
    if (n > x.length) {
      slideIndexFeefo = 1;
    }
    if (n < 1) {
      slideIndexFeefo = x.length;
    }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    x[slideIndexFeefo - 1].style.display = 'block';
  }

  window.plusDivsFeefo = plusDivsFeefo
};
