var fs = require('fs');
var gulp = require('gulp');
var concat_css = require('gulp-concat-css');
var concat_js = require('gulp-concat');
var minify_css = require('gulp-cssnano');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var minify_js = require("gulp-uglify");
var duration = require('gulp-duration');
var mkdirp = require('mkdirp');
var jsdoc = require('gulp-jsdoc');
var adminlteRoot = 'node_modules/admin-lte/';
var cleancss = new LessPluginCleanCSS({ advanced: true });
var argv = require('yargs').argv;

var cssSources = [ "node_modules/ionicons/dist/css/ionicons.css",
		   "node_modules/font-awesome/css/font-awesome.css",
		   "node_modules/bootstrap/dist/css/bootstrap.css",
		   "node_modules/daterangepicker/daterangepicker-bs3.css",
		   "node_modules/nvd3/build/nv.d3.css",
		   "lib/Styles/*.css",
		   "app/assets/css/*.css" ];

var localJSSources = [ "app/app.js",
		       "app/components/dashboard/*.js",
		       "app/components/topbar/*.js",
		       "app/components/kpis/*.js",
			   "app/components/pipes/*.js",
		       "app/components/widgets/*.js",
		       "app/components/services/*.js",
		       "lib/js/*.js" ];

var externalJSSources = [ 'node_modules/moment/moment.js',
			  'node_modules/lodash/lodash.js',
			  'node_modules/angular/angular.js',
			  'node_modules/angular-route/angular-route.js',
			  'node_modules/jquery/dist/jquery.js',
			  'node_modules/bootstrap/dist/js/bootstrap.js',
			  'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
			  'node_modules/daterangepicker/daterangepicker.js',
			  'node_modules/bootstrap-daterangepicker/daterangepicker.js',
			  'node_modules/angular-daterangepicker/js/angular-daterangepicker.js',
			  'node_modules/d3/d3.js',
			  'node_modules/nvd3/build/nv.d3.js',
			  'node_modules/angular-nvd3/dist/angular-nvd3.js',
			  'node_modules/fastclick/lib/fastclick.js'];

var jsSources = externalJSSources.concat(localJSSources);

mkdirp('docs');
mkdirp('wwwroot/build/fonts');
mkdirp('wwwroot/build/js');
mkdirp('wwwroot/build/css');
mkdirp('wwwroot/build/html');
mkdirp('wwwroot/build/img');

gulp.task('install', [ 'build', 'copy-files' ]);

gulp.task('build', [ 'common', 'prepare-css', 'prepare-js' ]);

gulp.task('release', ['common', 'prepare-css-release', 'prepare-js-release' ]);

gulp.task('common', [ 'lint', 'prepare-assets', 'prepare-html' ]);

gulp.task('docs', function() {
    return gulp.src(localJSSources.concat(['README.md']))
	.pipe(jsdoc('./docs'));
});

gulp.task('lint', function() {
    return gulp.src(localJSSources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('prepare-html', function() {
    return gulp.src([ "app/components/dashboard/*.html",
		      "app/components/topbar/*.html",
		      "app/components/widgets/*.html"
		    ])
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/html/'));
});

gulp.task('prepare-assets', function() {
    return gulp.src([ "node_modules/ionicons/dist/fonts/ionicons*",
		      "node_modules/bootstrap/dist/fonts/glyphicons*",
		      "node_modules/font-awesome/fonts/fontawesome*" ])
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/fonts/'));
});

function buildCSS(files, minify) {
    var g = gulp.src(files)
	.pipe(less({plugins: [cleancss]}))
	.pipe(concat_css('style.min.css',
			 { rebaseUrls: false }));
    if(minify) {
	g = g.pipe(minify_css({zindex: false}));
    }
    return g.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/css/'));
}

function buildJS(files, destName, destDir, minify) {
    var g = gulp.src(files)
	.pipe(concat_js(destName));
    if(minify) {
	g = g.pipe(minify_js());
    }
    return g.pipe(duration('Execution Time: '))
	.pipe(gulp.dest(destDir));
}

gulp.task('prepare-js', function() {
    return buildJS(jsSources, 'lib.min.js', 'wwwroot/build/js/', false);
});

gulp.task('prepare-js-release', function() {
    return buildJS(jsSources, 'lib.min.js', 'wwwroot/build/js/', true);
});

gulp.task('prepare-css', function() {
    return buildCSS(cssSources, false);
});

gulp.task('prepare-css-release', function() {
    return buildCSS(cssSources, true);
});

gulp.task('copy-files', function() {
	if(!argv.dest)
		throw "Missing destionation file; use --dest parameter to indicate the destination folder";

	return gulp.src("wwwroot/**/*")
		.pipe(gulp.dest(argv.dest));
});
