'use strict';

/**
 * @ngdoc directive
 * @name ngTransclude
 * @restrict EAC
 *
 * @description
 * Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
 *
 * Existing content of the element that this directive is placed on will be removed before the transcluded content is inserted if transcluded content exists. In other case the content will be saved and used as content by default.
 *
 * @element ANY
 *
 * @example
   <example module="transcludeExample">
     <file name="index.html">
       <script>
         angular.module('transcludeExample', [])
          .directive('pane', function(){
             return {
               restrict: 'E',
               transclude: true,
               scope: { title:'@' },
               template: '<div style="border: 1px solid black;">' +
                           '<div style="background-color: gray">{{title}}</div>' +
                           '<ng-transclude></ng-transclude>' +
                         '</div>'
             };
         })
         .controller('ExampleController', ['$scope', function($scope) {
           $scope.title = 'Lorem Ipsum';
           $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
         }]);
       </script>
       <div ng-controller="ExampleController">
         <input ng-model="title" aria-label="title"> <br/>
         <textarea ng-model="text" aria-label="text"></textarea> <br/>
         <pane title="{{title}}">{{text}}</pane>
       </div>
     </file>
     <file name="protractor.js" type="protractor">
        it('should have transcluded', function() {
          var titleElement = element(by.model('title'));
          titleElement.clear();
          titleElement.sendKeys('TITLE');
          var textElement = element(by.model('text'));
          textElement.clear();
          textElement.sendKeys('TEXT');
          expect(element(by.binding('title')).getText()).toEqual('TITLE');
          expect(element(by.binding('text')).getText()).toEqual('TEXT');
        });
     </file>
   </example>
 *
 */
var ngTranscludeDirective = ngDirective({
  restrict: 'EAC',
  link: function($scope, $element, $attrs, controller, $transclude) {
    if (!$transclude) {
      throw minErr('ngTransclude')('orphan',
       'Illegal use of ngTransclude directive in the template! ' +
       'No parent directive that requires a transclusion found. ' +
       'Element: {0}',
       startingTag($element));
    }

    $transclude(function(clone) {
      if(clone.length) {
        $element.empty();
        $element.append(clone);
      }
    });
  }
});
