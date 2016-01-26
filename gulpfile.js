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

var cssSources = [ adminlteRoot + "plugins/ionicons/css/ionicons.min.css",
		   adminlteRoot + "node_modules/font-awesome/css/font-awesome.css",
		   adminlteRoot + "node_modules/bootstrap/dist/css/bootstrap.css",
		   adminlteRoot + "dist/css/AdminLTE.css",
		   adminlteRoot + "dist/css/skins/_all-skins.css",
		   adminlteRoot + "plugins/iCheck/flat/blue.css",
		   adminlteRoot + "plugins/morris/morris.css",
		   adminlteRoot + "plugins/jvectormap/jquery-jvectormap-1.2.2.css",
		   adminlteRoot + "plugins/datepicker/datepicker3.css",
		   adminlteRoot + "plugins/daterangepicker/daterangepicker-bs3.css",
		   adminlteRoot + "plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.css",
		   "lib/Styles/*.css",
		   "app/assets/css/*.css" ];

var localJSSources = [ "app/app.js",
		       "app/components/dashboard/*.js",
		       "app/components/topbar/topBarController.js",
		       "app/components/mainmenu/mainMenuController.js",
		       "app/components/widgets/*.js",
		       "app/components/services/*.js",
		       "lib/js/*.js" ];

var externalJSSources = [ adminlteRoot + 'node_modules/moment/moment.js',
			  adminlteRoot + 'node_modules/raphael/raphael.js',
			  adminlteRoot + 'node_modules/angular/angular.js',
			  adminlteRoot + 'node_modules/angular-route/angular-route.js',
			  adminlteRoot + 'plugins/jQuery/jQuery-2.1.4.js',
			  adminlteRoot + 'plugins/jQueryUI/jquery-ui.js',
			  adminlteRoot + 'plugins/datatables/jquery.dataTables.js',
			  adminlteRoot + 'plugins/datatables/dataTables.bootstrap.js',
			  adminlteRoot + 'node_modules/bootstrap/dist/js/bootstrap.js',
			  adminlteRoot + 'plugins/chartjs/Chart.js',
			  adminlteRoot + 'plugins/sparkline/jquery.sparkline.js',
			  adminlteRoot + 'plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
			  adminlteRoot + 'plugins/jvectormap/jquery-jvectormap-us-mill.js',
			  adminlteRoot + 'plugins/knob/jquery.knob.js',
			  adminlteRoot + 'plugins/daterangepicker/daterangepicker.js',
			  adminlteRoot + 'plugins/datepicker/bootstrap-datepicker.js',
			  adminlteRoot + 'plugins/slimScroll/jquery.slimscroll.js',
			  adminlteRoot + 'plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.js',
			  adminlteRoot + 'plugins/fastclick/fastclick.js'];

var jsSources = externalJSSources.concat(localJSSources);

mkdirp('docs');
mkdirp('wwwroot/build/fonts');
mkdirp('wwwroot/build/js');
mkdirp('wwwroot/build/css');
mkdirp('wwwroot/build/html');
mkdirp('wwwroot/build/img');

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
		      "app/components/topbar/topBarView.html",
		      "app/components/mainmenu/mainMenuView.html",
		      "app/components/widgets/*.html"
		    ])
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/html/'));
});

gulp.task('prepare-assets', function() {
    return gulp.src([ adminlteRoot + "plugins/ionicons/fonts/ionicons*",
		      adminlteRoot + "node_modules/bootstrap/dist/fonts/glyphicons*",
		      adminlteRoot + "node_modules/font-awesome/fonts/fontawesome*" ])
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

