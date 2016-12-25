// ==UserScript==
// @name        WordPress.com classic stats
// @namespace   tpenguinltg
// @description Redirects the new stats page to the classic stats page
// @include     https://wordpress.com/stats/*
// @version     2.0.1
// @updateURL   https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js
// @homepageURL https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats
// @homepageURL https://github.com/tpenguinltg/wpcom-stats-redirect.user.js
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2015-2016, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @run-at      document-start
// ==/UserScript==

var parsedUrl = window.location.pathname.match(/stats(?:\/(insights|day|week|month|year))?(?:\/([^\/]*))?/);
var statsType = parsedUrl[1];
var blogDomain = parsedUrl[2];

// Function by dystroy. From http://stackoverflow.com/a/14388512
function fetchJSONFile(path, callback, fallback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        if (callback) callback(JSON.parse(httpRequest.responseText));
      } else if (fallback) {
        fallback();
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

function redirectToClassicStats(baseUrl) {
  var query = ["page=stats"];

  switch (statsType) {
    case "day":
      query.push("unit=1");
      break;
    case "week":
      query.push("unit=7");
      break;
    case "month":
      query.push("unit=31");
      break;
  }

  window.location.replace(baseUrl + '/wp-admin/index.php?' + query.join("&"));
}

if (blogDomain) {
  // Redirect to post URL based on API results
  // API docs: https://developer.wordpress.com/docs/api/
  fetchJSONFile("https://public-api.wordpress.com/rest/v1.1/sites/" + blogDomain,
    // attempt to redirect using API
    function(data) {
      redirectToClassicStats(data.URL);
    },

    // fallback: attempt to use the blog domain
    function() {
      // use http instead of https in case the server doesn't support https
      // (e.g. for Jetpack sites)
      redirectToClassicStats('http://' + blogDomain);
    }
  );
}
