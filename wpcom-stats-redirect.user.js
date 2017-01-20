// ==UserScript==
// @name        WordPress.com classic stats
// @namespace   tpenguinltg
// @description Redirects the new stats page to the classic stats page
// @include     https://wordpress.com/stats*
// @version     2.1.0
// @updateURL   https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js
// @homepageURL https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats
// @homepageURL https://github.com/tpenguinltg/wpcom-stats-redirect.user.js
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2015-2016, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @run-at      document-start
// ==/UserScript==

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

function redirectToClassicStats(baseUrl, statsType) {
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

function doRedirect(uri) {
  var parsedUri = uri.match(/stats(?:\/(insights|day|week|month|year))?(?:\/(countryviews|posts))?(?:\/([^\/]*))?/);
  var statsType = parsedUri[1];
  var viewType = parsedUri[2];
  var blogDomain = parsedUri[3];

  if (blogDomain) {
    // Redirect to post URL based on API results
    // API docs: https://developer.wordpress.com/docs/api/
    fetchJSONFile("https://public-api.wordpress.com/rest/v1.1/sites/" + blogDomain,
      // attempt to redirect using API
      function(data) {
        redirectToClassicStats(data.URL, statsType);
      },

      // fallback: attempt to use the blog domain
      function() {
        // use http instead of https in case the server doesn't support https
        // (e.g. for Jetpack sites)
        redirectToClassicStats('http://' + blogDomain, statsType);
      }
    );
  } else if (statsType != "insights") {
    window.onload = function() {
      // the first blog listed is the user's default blog
      var defaultBlogStatsUrl = document.querySelector("a.is-card-link").href;
      doRedirect(defaultBlogStatsUrl);
    };
  } else {
    window.onload = function() {
      // insights page; get the domain and construct an insights URI
      blogDomain = document.querySelector(".stats-tab a").href
      doRedirect("/stats/insights/" + blogDomain);
    };
  }
}

doRedirect(window.location.pathname);
