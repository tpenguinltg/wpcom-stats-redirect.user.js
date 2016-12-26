# wpcom-stats-redirect.user.js
[WordPress.com](https://wordpress.com/) is trying to push its new interfaces, including the new stats page. This user script forces a redirect to the classic dashboard stats page when the new stats page is visited.

This script is based on [wpcom-edit-post-redirect.user.js](https://github.com/tpenguinltg/wpcom-edit-post-redirect.user.js).

## Installation
If you don't already have one, install [a browser extension](https://greasyfork.org/en/help/installing-user-scripts) that allows you to run user scripts. Then, install the script from [Greasy Fork](https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats).

Alternatively, visit the URL below:

[https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js](https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js)

## Known Issues
* The new interface may start loading and appear before the redirect occurs
* The redirection will likely fail for Jetpack-enabled sites whose site root is
  different from their installation root 

## Changelog
* **v1.0.0:** Initial release
* **v1.0.1:** Fix redirect for private and Jetpack-enabled blogs
* **v1.0.2:** "Fix" infinite redirect caused by old stats page being taken down.
* **v2.0.0:** Redirect to the classic dashboard stats page instead
* **v2.0.1:** Fix regex to match URLs without a stats type.
* **v2.1.0:** Redirect even when there is no blog domain in the URL
