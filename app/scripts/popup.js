'use strict';
angular.module('CwPlus',[])
.controller('PopupController', function ($scope,$timeout) {
        $scope.status = false;
        $scope.selected_color1 = '#dcecfb'; // default
        $scope.selected_color2 = '#bddbfa'; //default
        $scope.selected_color3 = '#80b5ea'; //default
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
                    $scope.status = true;
                } else if(cookie[i].name == 'bgColor1'){
                    $scope.$apply(function(){
                        $scope.selected_color1 = cookie[i].value;
                    });
                } else if(cookie[i].name == 'bgColor2'){
                    $scope.$apply(function(){
                        $scope.selected_color2 = cookie[i].value;
                    });
                } else if(cookie[i].name == 'bgColor3'){
                    $scope.$apply(function(){
                        $scope.selected_color3 = cookie[i].value;
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
        $scope.initPopup = function(){
            chrome.cookies.get({
                url  : 'https://www.chatwork.com',
                name : 'cwplus'
            },function(obj){
                $scope.value = 'aaaaa';
                if(angular.isUndefined(obj)){
                    if(obj.value === 'enabled'){
                        $scope.enable = true;
                    } else {
                        $scope.enable = false;
                    }
                }
                else{
                    $scope.enable = true;
                    $scope.setCookies ('cwplus','enabled');
                }
            });
        };
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
        $scope.gotoOptions = function(){
            window.open(chrome.extension.getURL('index.html'),'_blank');
        };
});
