// ==UserScript==
// @name        WordPress.com classic stats
// @namespace   tpenguinltg
// @description Redirects the new stats page to the classic stats page
// @include     https://wordpress.com/stats*
// @version     1.0.2
// @updateURL   https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js
// @homepageURL https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats
// @homepageURL https://github.com/tpenguinltg/wpcom-stats-redirect.user.js
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2015, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @run-at      document-start
// ==/UserScript==

// The old stats page has been taken offline.
// Until a fix can be made (if that's even possible),
// return early to prevent an infinite redirect
return;

var parsedUrl=window.location.pathname.match(/stats(\/([^\/]*))?/);
var blogDomain=parsedUrl[2];

// Function by dystroy. From http://stackoverflow.com/a/14388512
function fetchJSONFile(path, callback, fallback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }//if
            else {
                if(fallback) fallback();
            }//end if
        }//end if
    };//end onreadystatechange()
    httpRequest.open('GET', path);
    httpRequest.send(); 
}//end fetchJSONFile


// if general stats page (i.e. no domain given)
if(!blogDomain) {
  window.location.replace("https://wordpress.com/my-stats/");
}//if
// else stats page for specific blog
else {
  // Redirect to post URL based on API results
  // API docs: https://developer.wordpress.com/docs/api/
  fetchJSONFile("https://public-api.wordpress.com/rest/v1.1/sites/"+blogDomain,
      // attempt to redirect using API
      function(data) {
        window.location.replace("https://wordpress.com/my-stats/?blog="+data.ID);
      },
      // fallback: scrape page for URL
      function() {
        // scrape the edit URL from the page when the DOM has finished loading
        window.onload=function() {
          var classicLink=document.getElementsByClassName("switch-stats")[0].children[0].children[0].href;
          window.location.replace(classicLink);
        }; //end window.onload
      });
}//end if
