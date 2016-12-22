# wpcom-stats-redirect.user.js
[WordPress.com](https://wordpress.com/) is trying to push its new interfaces, including the new stats page. This user script forces a redirect to the old stats page when the new stats page is visited.

This script is based on [wpcom-edit-post-redirect.user.js](https://github.com/tpenguinltg/wpcom-edit-post-redirect.user.js).

## Installation
If you don't already have one, install [a browser extension](https://greasyfork.org/en/help/installing-user-scripts) that allows you to run user scripts. Then, visit the URL below:

[https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js](https://github.com/tpenguinltg/wpcom-stats-redirect.user.js/raw/master/wpcom-stats-redirect.user.js)

Also on [Greasy Fork](https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats).

## Known Issues
* The new interface may start loading and appear before the redirect occurs
* Once access to the old stats page has been revoked by WordPress.com staff (which they say they will do eventually), this script will cease to work

## Changelog
* **v1.0.0:** Initial release
* **v1.0.1:** Fix redirect for private and Jetpack-enabled blogs
* **v1.0.2:** "Fix" infinite redirect caused by old stats page being taken down.
