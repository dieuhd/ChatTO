'use strict';

angular.module('CwPlus',[])
    .directive('pickcolor', function () {
        return {
            restrict: 'A',
            require:'ngModel',
            replace: true,
            link: function (scope, element, attr,ngModel) {
                var color  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(scope.color) ? scope.color : '#ffffff';
                element.ColorPicker({
                    color: color,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        scope.$apply(function(){
                            ngModel.$setViewValue('#'+hex);
                        });
                    }
                });
            }
        };
    })
    .controller('OptionController',function($scope){
        $scope.color = {
            bgColor1  : '#dcecfb',
            bgColor2  : '#bddbfa',
            bgColor3  : '#80b5ea',
            fontColor : '#000000'
        };
        $scope.enable = true;

        chrome.cookies.getAll({},function (cookie){
            for(var i=0;i<cookie.length;i++){
                if(cookie[i].name == 'cwplus'){
                    if(cookie[i].value === 'enabled'){
                        $scope.$apply(function(){
                            $scope.enable = true;
                        });
                    } else {
                        $scope.$apply(function(){
                            $scope.enable = false;
                        });
                    }
                } else if(cookie[i].name == 'bgColor1'){
                    $scope.$apply(function(){
                        $scope.color.bgColor1 = cookie[i].value;
                    });
                } else if(cookie[i].name == 'bgColor2'){
                    $scope.$apply(function(){
                        $scope.color.bgColor2 = cookie[i].value;
                    });
                } else if(cookie[i].name == 'bgColor3'){
                    $scope.$apply(function(){
                        $scope.color.bgColor3 = cookie[i].value;
                    });
                } else if(cookie[i].name == 'fontColor'){
                    $scope.$apply(function(){
                        $scope.color.fontColor = cookie[i].value;
                    });
                }
            }
            if(!$scope.status)
            {
                $scope.$apply(function(){
                    $scope.enable = true;
                    $scope.setCookies ('cwplus','enabled');
                });
            }
        });

        $scope.$watch('color',function(newColor){
            $scope.setCookies('bgColor1',newColor.bgColor1);
            $scope.setCookies('bgColor2',newColor.bgColor2);
            $scope.setCookies('bgColor3',newColor.bgColor3);
            $scope.setCookies('fontColor',newColor.fontColor);
        },true);

        $scope.setCookies = function(name,value){
            chrome.cookies.set({
                name:name,
                value:value,
                url:'https://www.chatwork.com',
                domain:'www.chatwork.com',
                secure : true,
                expirationDate:(new Date(2020,12,31,23,59,59)).getTime()/1000
            },function(cookie){

            });
        };

        $scope.reset = function(){
            $scope.color = {
                bgColor1  : '#dcecfb',
                bgColor2  : '#bddbfa',
                bgColor3  : '#80b5ea',
                fontColor : '#000000'
            };
            $scope.enable = true;
            $scope.setCookies('cwplus','enabled');
            $scope.setCookies('bgColor1',$scope.color.bgColor1);
            $scope.setCookies('bgColor2',$scope.color.bgColor2);
            $scope.setCookies('bgColor3',$scope.color.bgColor3);
            $scope.setCookies('fontColor',$scope.color.fontColor);
        };
        $scope.switchCwTO = function(){
            if($scope.enable){
                $timeout(function(){
                    $scope.setCookies('cwplus','enabled')
                });
            }else{
                $timeout(function(){
                    $scope.setCookies('cwplus','disabled')
                });
            }
        };
    });
