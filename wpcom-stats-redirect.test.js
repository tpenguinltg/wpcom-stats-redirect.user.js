var sinon = require("sinon");
var assert = require("chai").assert;
var statsRedirect = require("./wpcom-stats-redirect.user.js");

describe("stats redirect", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("assembleUrl", function() {
    it("should set appropriate unit", function() {
      var url;

      url = statsRedirect.assembleUrl("base", "day");
      assert.include(url, "unit=1");

      url = statsRedirect.assembleUrl("base", "week");
      assert.include(url, "unit=7");

      url = statsRedirect.assembleUrl("base", "month");
      assert.include(url, "unit=31");
    });

    it("should assemble URL", function() {
      var url = statsRedirect.assembleUrl("base", "day", ["a=b"]);

      assert.equal(url, "base/wp-admin/index.php?page=stats&a=b&unit=1");
    });
  });

  describe("parseUri", function() {
    it("should parse the URI path", function() {
      var path = "/stats/day/example.wordpress.com";

      var parsed = statsRedirect.parseUri(path);

      assert.deepEqual(parsed, {
        statsType: "day",
        viewType: undefined,
        blogDomain: "example.wordpress.com"
      });
    });

    it("should parse view types", function() {
      var path = "/stats/day/posts/example.wordpress.com";

      var parsed = statsRedirect.parseUri(path);

      assert.deepEqual(parsed, {
        statsType: "day",
        viewType: "posts",
        blogDomain: "example.wordpress.com"
      });
    });
  });

  describe("doRedirect", function() {
    var blogDomain = "example.wordpress.com";
    var data = {URL: "url"};
    var tokens, apiFetch, oldGlobalCurrentUser;

    beforeEach(function() {
      tokens = {
        statsType: "day",
        blogDomain: blogDomain
      };
      apiFetch = sandbox.stub(statsRedirect.utils, "apiFetch");
      olGlobalCurrentUser = global.currentUser;
      global.currentUser = {
        primarySiteSlug: blogDomain
      }
    });

    afterEach(function() {
      global.currentUser = oldGlobalCurrentUser;
    });

    function assertRedirect(expectedUrl, fetchSuccess, callbackArg) {
      sandbox.assert.calledWith(apiFetch, "/sites/example.wordpress.com", sinon.match.func, sinon.match.func);

      var callback = apiFetch.firstCall.args[(fetchSuccess)? 1 : 2];
      var exampleUrl = "https://example.com/";
      var assembleUrl = sandbox.stub(statsRedirect, "assembleUrl");
      var locationReplace = sandbox.stub(statsRedirect.utils, "locationReplace");
      assembleUrl.returns(exampleUrl);

      callback(callbackArg);

      sandbox.assert.calledWith(assembleUrl, expectedUrl, tokens.statsType);
      sandbox.assert.calledWith(locationReplace, exampleUrl);
    }

    it("should redirect for URLs with a blog domain using the API", function() {
      statsRedirect.doRedirect(tokens);
      assertRedirect(data.URL, true, data);
    });

    it("should redirect for URLs with a blog domain using the blog domain as a fallback", function() {
      statsRedirect.doRedirect(tokens);
      assertRedirect("http://" + tokens.blogDomain, false);
    });

    it("should redirect even without the blog domain on an insights page", function() {
      var registerOnload = sandbox.stub(statsRedirect.utils, "registerOnload");
      tokens.blogDomain = null;
      tokens.statsType = "insights";

      statsRedirect.doRedirect(tokens);

      sandbox.assert.calledWith(registerOnload, sinon.match.func);

      registerOnload.firstCall.args[0]();

      assertRedirect(data.URL, true, data);
    });

    it("should redirect even without the blog domain on a stats page", function() {
      var registerOnload = sandbox.stub(statsRedirect.utils, "registerOnload");
      tokens.blogDomain = null;

      statsRedirect.doRedirect(tokens);

      sandbox.assert.calledWith(registerOnload, sinon.match.func);

      registerOnload.firstCall.args[0]();

      assertRedirect(data.URL, true, data);
    });
  });
});
