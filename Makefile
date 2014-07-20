BROWSERIFY = node ./node_modules/browserify/bin/cmd.js
MOCHA = ./node_modules/.bin/mocha
UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = "/*! webmotely.js - v0.1 - MIT License - https://github.com/webmotely/webmotely.js */"

define release
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		var j = require('./package.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./package.json', s);" && \
	node -e "\
		var j = require('./bower.json');\
		j.version = \"$$NEXT_VERSION\";\
		var s = JSON.stringify(j, null, 2);\
		require('fs').writeFileSync('./bower.json', s);" && \
	git commit -am "release $$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION" -m "Version $$NEXT_VERSION"
endef

define replace
	node -e "\
		var fs = require('fs'); \
		var os = require('os-shim'); \
		var str = fs.readFileSync('./injecty.js').toString(); \
		str = str.split(os.EOL).map(function (line) { \
		  return line.replace(/^void 0;/, '') \
		}).filter(function (line) { \
		  return line.length \
		}) \
		.join(os. EOL) \
		.replace(/(var _ns_ = \{\n((.*)\n(.*)\n\s+\}\;(\n)?))+/g, '') \
		.replace(/(\{(\s+)?\n(\s+)?\}\n)/g, ''); \
		fs.writeFileSync('./injecty.js', str)"
endef

default: all
all: test browser
browser: cleanbrowser test banner browserify replace uglify
test: mocha

mkdir:
	mkdir -p lib

banner:
	@echo $(BANNER) > webmotely.js

browserify:
	$(BROWSERIFY) \
		--exports require \
		--standalone webmotely \
		--entry ./src/webmotely.js >> ./webmotely.js

replace:
	@$(call replace)

uglify:
	$(UGLIFYJS) injecty.js --mangle --preamble $(BANNER) > injecty.min.js

clean:
	rm -rf lib/*

cleanbrowser:
	rm -f *.js

mocha:
	$(MOCHA) --reporter spec --ui tdd 

loc:
	wc -l src/*

release:
	@$(call release, patch)

release-minor:
	@$(call release, minor)

publish: browser release
	git push --tags origin HEAD:master
	npm publish
