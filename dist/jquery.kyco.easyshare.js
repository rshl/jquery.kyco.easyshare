/*
**
**  jquery.kyco.easyshare
**  =====================
**
**  Version 1.2.1
**
**  Brought to you by
**  https://www.kycosoftware.com
**
**  Copyright 2015 Cornelius Weidmann
**
**  Distributed under the GPL
**
*/

'use strict';

var kyco = kyco || {};

kyco.API_PATH = '../api/easyshare.php';

kyco.easyShare = function() {
  var easyshares = [];

  if ($('[data-easyshare]').length > 0) {
    $('[data-easyshare]').each(function(index) {
      easyshares[index] = {};
      easyshares[index].self = $(this);
      easyshares[index].url = easyshares[index].self.data('easyshare-url');
      easyshares[index].countTotal = easyshares[index].self.find('[data-easyshare-total-count]');
      easyshares[index].countFacebook = easyshares[index].self.find('[data-easyshare-button-count="facebook"]');
      easyshares[index].countTwitter = easyshares[index].self.find('[data-easyshare-button-count="twitter"]');
      easyshares[index].countGoogle = easyshares[index].self.find('[data-easyshare-button-count="google"]');
      easyshares[index].loader = easyshares[index].self.find('[data-easyshare-loader]');
      easyshares[index].FORCE_HTTP = typeof easyshares[index].self.data('easyshare-http') !== 'undefined';
      easyshares[index].FORCE_HTTPS = typeof easyshares[index].self.data('easyshare-https') !== 'undefined';
      easyshares[index].SHARE_URL = typeof easyshares[index].url === 'undefined' || easyshares[index].url === '' ? window.location.href : easyshares[index].url;

      // Get share counts for Facebook, Twitter and Google+
      $.ajax({
        url: kyco.API_PATH,
        type: 'GET',
        dataType: 'json',
        data: {
          url: easyshares[index].SHARE_URL,
          http: easyshares[index].FORCE_HTTP,
          https: easyshares[index].FORCE_HTTPS
        },
        success: function(response) {
          easyshares[index].countTotal.html(kyco.easyShareApproximate(response.Total));
          easyshares[index].countFacebook.html(kyco.easyShareApproximate(response.Facebook));
          easyshares[index].countTwitter.html(kyco.easyShareApproximate(response.Twitter));
          easyshares[index].countGoogle.html(kyco.easyShareApproximate(response.Google));
        },
        error: function() {
          easyshares[index].countTotal.html(0);
          easyshares[index].countFacebook.html(0);
          easyshares[index].countTwitter.html(0);
          easyshares[index].countGoogle.html(0);
        },
        complete: function() {
          easyshares[index].loader.fadeOut(500);
        }
      });

      // Facebook share button
      easyshares[index].self.find('[data-easyshare-button="facebook"]').click(function() {
        var width      = 500;
        var height     = 400;
        var leftOffset = ($(window).width() - width) / 2;
        var topOffset  = ($(window).height() - height) / 2;
        var url        = 'https://www.facebook.com/sharer/sharer.php?u=' + easyshares[index].SHARE_URL;
        var opts       = 'width=' + width + ',height=' + height + ',top=' + topOffset + ',left=' + leftOffset;

        window.open(url, 'facebook', opts);
      });

      // Twitter share button
      easyshares[index].self.find('[data-easyshare-button="twitter"]').click(function() {
        var text       = $(this).data('easyshare-tweet-text') || '';
        var width      = 575;
        var height     = 440;
        var leftOffset = ($(window).width() - width) / 2;
        var topOffset  = ($(window).height() - height) / 2;
        var url        = 'https://twitter.com/share?text=' + encodeURIComponent(text);
        var opts       = 'status=1,width=' + width + ',height=' + height + ',top=' + topOffset + ',left=' + leftOffset;

        window.open(url, 'twitter', opts);
      });

      // Google+ share button
      easyshares[index].self.find('[data-easyshare-button="google"]').click(function() {
        var width      = 500;
        var height     = 400;
        var leftOffset = ($(window).width() - width) / 2;
        var topOffset  = ($(window).height() - height) / 2;
        var url        = 'https://plus.google.com/share?url=' + easyshares[index].SHARE_URL;
        var opts       = 'width=' + width + ',height=' + height + ',top=' + topOffset + ',left=' + leftOffset;

        window.open(url, 'google+', opts);
      });
    });
  }
};

/*
**  kyco.easyShareAddCommas, kyco.easyShareFormatDecimals & kyco.easyShareApproximate
**  are adapted from https://github.com/nfriedly/approximate-number
**  Copyright (c) 2014 Nathan Friedly
**  Licensed under the MIT license
**  Modified by Cornelius Weidmann
*/
kyco.easyShareAddCommas = function(num) {
  var out    = [];
  var digits = Math.round(num).toString().split('');

  if (num < 1000) {
    return num.toString();
  }

  digits.reverse().forEach(function(digit, i) {
    if (i && i % 3 === 0) {
      out.push(',');
    }

    out.push(digit);
  });

  return out.reverse().join('');
};

kyco.easyShareFormatDecimals = function(num, base) {
  var workingNum = num / base;

  return workingNum < 10 ? Math.round(workingNum * 10) / 10 : Math.round(workingNum);
};

kyco.easyShareApproximate = function(num) {
  var negative = num < 0;
  var number = num;
  var numString;

  if (negative) {
    number = Math.abs(num);
  }

  if (number < 10000) {
    numString = kyco.easyShareAddCommas(number);
  } else if (number < 1000000) {
    numString = kyco.easyShareFormatDecimals(number, 1000) + 'k';
  } else if (number < 1000000000) {
    numString = kyco.easyShareFormatDecimals(number, 1000000) + 'm';
  } else {
    numString = kyco.easyShareAddCommas(kyco.easyShareFormatDecimals(number, 1000000000)) + 'b';
  }

  if (negative) {
    numString = '-' + numString;
  }

  return numString;
};

$(document).ready(function() {
  kyco.easyShare();
});
