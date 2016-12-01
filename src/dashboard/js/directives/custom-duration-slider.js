/**
* @ngdoc directive
* @name customDurationSlider
* @module enplug.sdk.utils
*
* @param ratio {String Duration}
*/
angular.module('enplug.sdk.utils').directive('customDurationSlider', function ($document) {
    return {
        restrict: 'E',
        scope: {
            ratio: '=ratio'
        },
        templateUrl: 'sdk-utils/custom-duration-slider.tpl',

        link: function (scope, element, attrs, arg) {

            var startX = 0,
            padding = 2,
            $barWidth = angular.element(element[0].querySelector('.slider')),
            barWidth = $barWidth.prop('clientWidth'),
            $cursor = angular.element(element[0].querySelector('.slider-cursor')),
            cursorWidth = $cursor.prop('clientWidth'),
            scrollLength = barWidth - cursorWidth - padding,
            offset = 0;

            // Scope variable if user has made change on manual input
            scope.manualDuration = false;
            // Handling input keydown event, setting manual duration to true
            scope.handleKeyDown = function(event) {
                scope.manualDuration = true;
            }
            // Assigning ratio to prevent zero from being saved
            scope.checkRatioValue = function() {
                scope.ratio = preventFalseDuration();
            }
            // Watching changes on ratio. Moving cursor to reflect manual changes
            scope.$watch('ratio', function() {
                if(scope.manualDuration) {
                    offset = compareOffsetValue();
                    $cursor.css('transition', 'margin-left 0.5s ease-in');
                    $cursor.css('margin-left', offset+'px');
                }
            });
            // Prevents false value from being saved. Must be at least 1 sec duration
            function preventFalseDuration() {
                if(scope.ratio == "" || scope.ratio == 0) {
                    scope.ratio = 1;
                }
                return scope.ratio;
            }
            // Function comparing offset to padding and scrollLength. Prevent cursor from overflowing slider
            function compareOffsetValue() {
                var difference = scope.ratio * scrollLength / 60;
                if ( difference < padding ) {
                    difference = padding;
                } else if ( difference > scrollLength )  {
                    difference = scrollLength;
                }
                return difference;
            }
            // Setting default values for slider on mousedown
            function setDefaultValues() {
                scope.manualDuration = false;
                $cursor.css('transition', 'none')
                startX = event.pageX;
                scope.ratio = preventFalseDuration();
            }
            // Immediately invoked to set margin when directive is instantiated
            (function() {
                offset = compareOffsetValue();
                $cursor.css('margin-left', offset+'px');
            })();

            return $cursor.on('mousedown', function(event) {
                var mousemove, mouseup;

                mousemove = function(event) {
                    return scope.$apply(function() {
                        offset += (event.pageX - startX);
                        if ( offset < padding ) {
                            offset = padding;
                        } else if ( offset > scrollLength )  {
                            offset = scrollLength;
                        } else {
                            startX = event.pageX;
                        }
                        scope.ratio = Math.round(offset/scrollLength * 60);
                        if(scope.ratio == 0 || scope.ratio == '0') {
                            scope.ratio = 1
                        }
                        $cursor.css('margin-left', offset+'px')
                    })
                };
                mouseup = function() {
                    $document.unbind('mousemove', mousemove);
                    return $document.unbind('mouseup', mouseup);
                };
                event.preventDefault();
                setDefaultValues();
                $document.on('mousemove', mousemove);
                return $document.on('mouseup', mouseup);
            });
        }
    };
});
