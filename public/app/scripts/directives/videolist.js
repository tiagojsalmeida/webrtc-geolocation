'use strict';

/**
 * @ngdoc directive
 * @name publicApp.directive:VideoList
 * @description
 * # VideoPlayer
 */
angular.module('publicApp')
	.directive('videoList', function ($sce) {
		return {
			template: '<div></div>',
			restrict: 'E',
			replace: true,
			scope: {
				vidSrc: '@'
			},
			link: function (scope) {

			}
		};
	});
