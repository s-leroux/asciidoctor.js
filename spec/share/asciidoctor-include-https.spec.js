var includeHttpsSpec = function (testOptions, asciidoctor) {
  describe('Include https URI', function () {
    it('should include file with an absolute https URI (base_dir is an absolute https URI)', function () {
      var opts = {
        safe: 'safe',
        base_dir: 'https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master',
        attributes: {'allow-uri-read': true}
      };
      var html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/README.adoc[]', opts);
      expect(html).toContain('Asciidoctor.js');
    });

    it('should partially include file with an absolute https URI (using tag)', function () {
      var opts = {
        safe: 'safe',
        attributes: {'allow-uri-read': true}
      };
      var html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/spec/share/include-tag.adoc[tag=a]', opts);
      expect(html).toContain('tag-a');
      html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/spec/share/include-tag.adoc[tag=b]', opts);
      expect(html).toContain('tag-b');
    });

    it('should partially include file with an absolute https URI (using lines)', function () {
      var opts = {
        safe: 'safe',
        attributes: {'allow-uri-read': true}
      };
      var html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/spec/share/include-lines.adoc[lines=1..2]', opts);
      expect(html).toContain('First line');
      expect(html).toContain('Second line');
      html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/spec/share/include-lines.adoc[lines=3..4]', opts);
      expect(html).toContain('Third line');
      expect(html).toContain('Fourth line');
    });

    it('should include file with an absolute https URI (base_dir is not defined)', function () {
      var opts = {safe: 'safe', attributes: {'allow-uri-read': true}};
      var html = asciidoctor.convert('include::https://raw.githubusercontent.com/HubPress/dev.hubpress.io/gh-pages/README.adoc[]', opts);
      expect(html).toContain('HubPress');
    });
    if (testOptions.platform === 'Node.js') {
      // When running on Node.js, the following exception is thrown:
      // "SecurityError: Jail is not an absolute path: https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master"
    } else {
      it('should include file with a relative https URI (base_dir is an absolute https URI)', function () {
        var opts = {
          safe: 'safe',
          base_dir: 'https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master',
          attributes: {'allow-uri-read': true}
        };
        var html = asciidoctor.convert('include::README.adoc[]', opts);
        expect(html).toContain('Asciidoctor.js');
      });
    }

    if (testOptions.platform !== 'CommonJS' && testOptions.platform !== 'RequireJS') {
      // CommonJS and RequireJS tests suites are executed on a Browser (Chrome Headless).
      // Other tests suites are executed on Node.js (using the xmlhttprequest Node module to emulate the browser XMLHttpRequest)
      // Unlike the browser XMLHttpRequest, the xmlhttprequest node module does not expand path and therefore returns a 404!
    } else {
      it('Should include file with a relative expandable path (base_dir is an absolute https URI)', function () {
        var opts = {
          safe: 'safe',
          base_dir: 'https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master',
          attributes: {'allow-uri-read': true}
        };
        var html = asciidoctor.convert('include::../v1.5.0/README.adoc[]', opts);
        expect(html).toContain('Bower');
      });

      it('Should include file with an absolute expandable https URI (base_dir is not defined)', function () {
        var opts = {safe: 'safe', attributes: {'allow-uri-read': true}};
        var html = asciidoctor.convert('include::https://raw.githubusercontent.com/asciidoctor/asciidoctor.js/master/../v1.5.0/README.adoc[]', opts);
        expect(html).toContain('Bower');
      });
    }
  });
};

if (typeof module !== 'undefined' && module.exports) {
  // Node.
  module.exports = includeHttpsSpec;
} else if (typeof define === 'function' && define.amd) {
  // AMD. Register a named module.
  define('asciidoctor-share-include-https-spec', [''], function () {
    return includeHttpsSpec;
  });
}
