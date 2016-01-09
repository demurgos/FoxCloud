var fs = require('fs');
var gulp = require('gulp');
var concat_css = require('gulp-concat-css');
var concat_js = require('gulp-concat');
var minify_css = require('gulp-cssnano');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var minify_js = require("gulp-uglify");
var duration = require('gulp-duration');
var mkdirp = require('mkdirp');
var adminlteRoot = 'node_modules/admin-lte/';
var cleancss = new LessPluginCleanCSS({ advanced: true });

mkdirp('wwwroot/build/fonts');
mkdirp('wwwroot/build/js');
mkdirp('wwwroot/build/css');
mkdirp('wwwroot/build/html');

gulp.task('build', ['prepare-css', 'prepare-assets', 'prepare-js', 'prepare-html']);

gulp.task('prepare-css', function() {
    return gulp.src([ adminlteRoot + "plugins/ionicons/css/ionicons.min.css",
		      adminlteRoot + "node_modules/font-awesome/css/font-awesome.min.css",
		      adminlteRoot + "node_modules/bootstrap/dist/css/bootstrap.css",
		      adminlteRoot + "dist/css/AdminLTE.min.css",
		      adminlteRoot + "dist/css/skins/_all-skins.min.css",
		      adminlteRoot + "plugins/iCheck/flat/blue.css",
		      adminlteRoot + "plugins/morris/morris.css",
		      adminlteRoot + "plugins/jvectormap/jquery-jvectormap-1.2.2.css",
		      adminlteRoot + "plugins/datepicker/datepicker3.css",
		      adminlteRoot + "plugins/daterangepicker/daterangepicker-bs3.css",
		      adminlteRoot + "plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css",
		      "lib/Styles/*.css" ])
	.pipe(less({plugins: [cleancss]}))
        .pipe(minify_css())
	.pipe(concat_css('style.min.css',
			 { rebaseUrls: false }))
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/css/'));
});

gulp.task('prepare-assets', function() {
    return gulp.src([ adminlteRoot + "plugins/ionicons/fonts/ionicons*",
		      adminlteRoot + "node_modules/bootstrap/dist/fonts/glyphicons*",
		      adminlteRoot + "node_modules/font-awesome/fonts/fontawesome*" ])
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/fonts/'));
});

gulp.task('prepare-js', function() {
    return gulp.src([ adminlteRoot + 'node_modules/moment/moment.js',
		      adminlteRoot + 'node_modules/raphael/raphael-min.js',
		      adminlteRoot + 'node_modules/angular/angular.min.js',
		      adminlteRoot + 'node_modules/angular-route/angular-route.min.js',
		      adminlteRoot + 'plugins/jQuery/jQuery-2.1.4.min.js',
		      adminlteRoot + 'plugins/jQueryUI/jquery-ui.min.js',
		      adminlteRoot + 'node_modules/bootstrap/dist/js/bootstrap.min.js',
		      adminlteRoot + 'plugins/morris/morris.min.js',
		      adminlteRoot + 'plugins/sparkline/jquery.sparkline.min.js',
		      adminlteRoot + 'plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
		      adminlteRoot + 'plugins/jvectormap/jquery-jvectormap-us-mill.js',
		      adminlteRoot + 'plugins/knob/jquery.knob.js',
		      adminlteRoot + 'plugins/daterangepicker/daterangepicker.js',
		      adminlteRoot + 'plugins/datepicker/bootstrap-datepicker.js',
		      adminlteRoot + 'plugins/slimScroll/jquery.slimscroll.min.js',
		      adminlteRoot + 'plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
		      adminlteRoot + 'plugins/fastclick/fastclick.js',
		      adminlteRoot + 'dist/js/app.min.js',
		      adminlteRoot + 'dist/js/demo.js',
		  	  "app/app.js",
		  	  "app/components/dashboard/dashboardController.js",
		      "lib/js/*.js" ])
	.pipe(concat_js('lib.min.js'))
	.pipe(minify_js())
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/js/'));    
});


gulp.task('prepare-html', function() {
    return gulp.src([ "app/components/dashboard/dashboardView.html" ])
	.pipe(duration('Execution Time: '))
	.pipe(gulp.dest('wwwroot/build/html/'));
});
