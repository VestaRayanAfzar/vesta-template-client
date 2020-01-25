const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const postCss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");
const csswring = require("csswring");
const mqpacker = require("css-mqpacker");
const { src, dest, watch } = require("gulp");

module.exports = function(setting) {
  const dir = setting.dir;

  function compileSass() {
    const genMap = !setting.production;
    let stream = src(getEntries());
    if (genMap) {
      stream = stream.pipe(sourcemaps.init());
    }
    stream = stream.pipe(sass());
    const preprocessors = [autoPrefixer({})];
    preprocessors.push(mqpacker);
    preprocessors.push(csswring);
    stream = stream.pipe(postCss(preprocessors));
    if (genMap) {
      stream = stream.pipe(sourcemaps.write());
    }
    return stream.pipe(dest(`${dir.build}/css`));
  }

  function watches() {
    watch(`${dir.src}/**/*.scss`, compileSass);
  }

  function getEntries() {
    return [`${dir.src}/index.scss`, `${dir.src}/rtl.scss`, `${dir.src}/ltr.scss`];
  }

  return {
    tasks: compileSass,
    watch: watches,
  };
};
