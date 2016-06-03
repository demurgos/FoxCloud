/**
 * @class SiteEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaSiteEditor", function () {
	return {
            restrict: 'E',
            scope : {
		site: '=' ,
		isNew: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
	    controller: [
		'$scope',
		function(
		    $scope
		) {

		    $scope.editor = undefined;
		    $scope.forceRefresh = false;
		    $scope.codeValid = true;
		    
		    $scope.editorOptions = {
			lineWrapping: true,
			lineNumbers: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			mode: "application/json",
			//gutters: ["CodeMirror-lint-markers"],
			lint: false
		    };

		    $scope.currentSite = $scope.site;
		    
		    $scope.isDirty = function () {
			return !angular.equals($scope.currentSite, $scope.site);
		    };	

		    $scope.isCodeValid = function() {
			return $scope.codeValid;
		    };
		    
		    function setEditorValue(site) {
			if($scope.editor !== undefined) {
			    if(site !== undefined && site.siteInfo !== undefined) {
				$scope.editor.setValue(angular.toJson(site.siteInfo, true));
			    } else {
				$scope.editor.setValue("{}");
			    }
			}
		    }
		    
		    $scope.codemirrorLoaded = function(_editor) {
			$scope.editor = _editor;

			$scope.editor.on("change", function() {
			    // fab: angular pb with dom event must eval or compile
			    try {
				jsonlint.parse($scope.editor.getValue());
				$scope.codeValid = true;
				console.log("Code valid");
			    } catch(err) {
				$scope.codeValid = false;
				console.log("Invalid code");
			    }
			});
			
			setEditorValue($scope.currentSite);
		    };		    

		    $scope.$watch("site", function (newVal) {
			if(newVal) {
			    $scope.currentSite = angular.copy(newVal);
			    setEditorValue($scope.currentSite);
			    $scope.forceRefresh = true;
			}
		    });
		    
		    $scope.submit = function () {
			angular.copy($scope.currentSite, $scope.site);
			// check for JSON syntax 
			$scope.site.siteInfo = angular.fromJson($scope.editor.getValue());
			if($scope.signal_submit) {
			    $scope.signal_submit();
			}
			$scope.close();
		    };
		    
		    $scope.close = function () {
			if($scope.signal_close) {
			    $scope.signal_close();
			}
		    };

		}],	    
            templateUrl: "build/html/SiteEditor.html"
	};
    });
