'use strict';

$('#_toList').css('display','none');

var button = document.getElementById("_to");
var dataListUser = document.createElement('div');
dataListUser.id = '_dataListUser';
dataListUser.className = 'toListUser';

dataListUser.setAttribute('ng-app','CwPlus');
dataListUser.innerHTML= '<div class="ng-scope dataListUser" ng-controller="ListUserController" ng-click="stopEvent($event)" >'
+'<div class="header">'
+'<div class="searchUser">'
+'<span class="iconSearchUser icoFontSearch"></span>'
+'<span class="btnCloseSearch icoFontCancel icoSizeLarge ng-hide" ng-show="showCancelSearch" ng-click="clearTextSearch()"></span>'
+'<input class="inputTextSearch ng-valid ng-dirty ng-touched" type="text" ng-model="search" role="search" placeholder="{{placeholder}}">'
+'</div>'
+'<div class="action">'
+'<a ng-click="all()" class="{{!type ? \'a_selected\' : \'\'}}">All</a>'
+'</div>'
+'<div class="action">'
+'<a ng-click="selected()" class="{{type ? \'a_selected\' : \'\'}}">Selected</a>'
+'</div>'
+'<div class="action">'
+'<a ng-click="selectall()">Select All</a>'
+'</div>'
+'<div class="action">'
+'<a ng-click="unselectall($event)">Unselect All</a>'
+'</div>'
+'</div>'
+'<div class="listUser">'
+'<div class="user" style="{{user.style}}" ng-repeat="user in dataUsers | searchUser : search:type" ng-click="select(user.id)" id="user_{{user.id}}">'
+'<img src="{{user.avatar}}">'
+'<span class="name" ng-bind="user.name" style="color: {{user.color}}"></span>'
+'<span class="btnCancelSelect icoFontCancel" ng-click="disselect($event,user.id)" ng-show="user.select === 1"></span>'
+'</div>'
+'</div>'
+'</div>';
var chatArea = document.getElementById('_chatSendArea');
chatArea.insertBefore(dataListUser,chatArea.firstChild);

var dataUsers = [];
var dataUserOfChatContent = [];
var searchPlaceholder = $('input.searchBox').val();
if(searchPlaceholder == ''){
    searchPlaceholder = 'Search by name';
}
button.addEventListener("click", function(event) {
    event.stopPropagation();
    var enabled = (getCookie('cwplus') !== 'disabled');
    var scope = angular.element('[ng-controller="ListUserController"]').scope();
    if(!enabled){
        $('#_toList').css('display','');
        scope.$apply(function(){
            scope.show = false;
        });
        return;
    }

    $('#_toList').css('display','none');
    if(typeof angular == 'undefined') {
        return;
    }
    if(scope.show){
        angular.element('#_dataListUser').css('display','none');
        scope.$apply(function(){
            scope.show = false;
        });
        return;
    }

    // get selected color
    var bgColor1 = getCookie('bgColor1');
    bgColor1  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgColor1) ? bgColor1 : '#dcecfb';
    var bgColor2 = getCookie('bgColor2');
    bgColor2  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgColor2) ? bgColor2 : '#bddbfa';
    var bgColor3 = getCookie('bgColor3');
    bgColor3  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgColor3) ? bgColor3 : '#80b5ea';
    var fontColor = getCookie('fontColor');
    fontColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(fontColor) ? fontColor : '#80b5ea';

    scope.$apply(function(){
        scope.color.fontColor = fontColor;

        scope.styleSelected = 'border: none;'
        +'-moz-box-shadow:inset 0px 1px 0px 0px '+bgColor1+';'
        +'-webkit-box-shadow:inset 0px 1px 0px 0px '+bgColor1+';'
        +'box-shadow:inset 0px 1px 0px 0px '+bgColor1+';'
        +'background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, '+bgColor2+'), color-stop(1, '+bgColor3+'));'
        +'background:-moz-linear-gradient(top, '+bgColor2+' 5%, '+bgColor3+' 100%);'
        +'background:-webkit-linear-gradient(top, '+bgColor2+' 5%, '+bgColor3+' 100%);'
        +'background:-o-linear-gradient(top, '+bgColor2+' 5%, '+bgColor3+' 100%);'
        +'background:-ms-linear-gradient(top, '+bgColor2+' 5%, '+bgColor3+' 100%);'
        +'background:linear-gradient(to bottom, '+bgColor2+' 5%, '+bgColor3+' 100%);'
        +'filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\''+bgColor2+'\', endColorstr=\''+bgColor3+'\',GradientType=0);'
        +'background-color:'+bgColor2+';';
    });

    var listUser = document.querySelectorAll('#_toList ul._cwLTList li');
    dataUsers = [];
    for(var i=0; i < listUser.length ; i++){

        var id = listUser[i].getAttribute('data-cwui-lt-value');
        var img = listUser[i].getElementsByTagName('img')[0].src;
        var name = listUser[i].getElementsByTagName('p')[0].innerHTML;
        dataUsers[''+id] = {
            id:id,
            name:name,
            avatar:img,
            select : 0,
            style : '',
            color: ''
        };
    }
    var chatContent = $('#_chatText').val();
    var chatContentArr = chatContent.split('\n');

    dataUserOfChatContent = [];
    for(i = 0; i < chatContentArr.length; i++){
        var ttt = chatContentArr[i].match(/\[To:\d+\]/i);
        if(ttt){
            var userId = ttt[0].match(/\d+/)[0];
            dataUserOfChatContent[''+userId] = {
                id : userId,
                name : chatContentArr[i].split(ttt)[1],
                status : 1,
                new_elm : 0
            };
            dataUsers[''+userId].select = 1;
            dataUsers[''+userId].style = scope.styleSelected;
            dataUsers[''+userId].color = scope.color.fontColor;
        }
    }
    dataListUser.style.display ='block';

    scope.$apply(function(){
        scope.dataUsers = dataUsers;
        scope.dataUserOfChatContent = dataUserOfChatContent;
        scope.chatContent = chatContent;
        scope.show = true;
    });

}, false);
function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return '';
}

angular.module('CwPlus',[])
    .controller('ListUserController',function($scope){
        $scope.color = {};
        $scope.styleSelected = '';
        $scope.color.fontColor = '';

        $scope.placeholder= searchPlaceholder;
        $scope.type = 0; // type = 0 : all users; type=1: selected users;

        $scope.dataUsers = [];
        $scope.dataUserOfChatContent = []; // list users selected
        $scope.show = false;

        $scope.chatContent = '';
        $scope.search= '';

        // insert text after current posision of cursor
        var insertAtCaret = function(areaId,text) {
            var txtarea = document.getElementById(areaId);
            var scrollPos = txtarea.scrollTop;
            var strPos = 0;
            var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                "ff" : (document.selection ? "ie" : false ) );
            if (br == "ie") {
                txtarea.focus();
                var range = document.selection.createRange();
                range.moveStart ('character', -txtarea.value.length);
                strPos = range.text.length;
            }
            else if (br == "ff") strPos = txtarea.selectionStart;

            var front = (txtarea.value).substring(0,strPos);
            var back = (txtarea.value).substring(strPos,txtarea.value.length);
            txtarea.value=front+text+back;
            strPos = strPos + text.length;
            if (br == "ie") {
                txtarea.focus();
                var range = document.selection.createRange();
                range.moveStart ('character', -txtarea.value.length);
                range.moveStart ('character', strPos);
                range.moveEnd ('character', 0);
                range.select();
            }
            else if (br == "ff") {
                txtarea.selectionStart = strPos;
                txtarea.selectionEnd = strPos;
                txtarea.focus();
            }
            txtarea.scrollTop = scrollPos;
        };

        //if search is not empty,show btn clear search text
        $scope.showCancelSearch = false;
        $scope.$watch('search',function(newVal,oldVal){
            if(newVal !== '')
            {
                $scope.showCancelSearch = true;
            }
            else{
                $scope.showCancelSearch = false;
            }
        });
        $scope.clearTextSearch = function(){
            $scope.search = '';
        };
        $scope.selectall = function(){
            for(var key in $scope.dataUsers)
            {
                $scope.select(key);
            }
        };
        //list users selected
        $scope.selected = function(){
            $scope.type = 1;
        };
        // all users
        $scope.all = function(){
            $scope.type = 0;
        };

        $scope.select = function(key){
            $scope.dataUsers[''+key].select = 1;
            $scope.dataUsers[''+key].style = $scope.styleSelected;
            $scope.dataUsers[''+key].color = $scope.color.fontColor;
            if($scope.dataUserOfChatContent[''+key]){
                if($scope.dataUserOfChatContent[''+key].status === 0)
                {
                    $scope.dataUserOfChatContent[''+key].status = 1;
                    insertAtCaret('_chatText','[To:'+$scope.dataUsers[key].id+'] '+$scope.dataUsers[key].name +'\n');
                }
            } else {
                $scope.dataUserOfChatContent[''+key] = {
                    id : $scope.dataUsers[''+key].id,
                    name : $scope.dataUsers[''+key].name,
                    status : 1,
                    new_elm : 1
                };
                insertAtCaret('_chatText','[To:'+$scope.dataUsers[key].id+'] '+$scope.dataUsers[key].name +'\n');
            }
        };
        $scope.disselect = function(event,key){
            event.stopPropagation();
            $scope.dataUsers[''+key].select = 0;
            $scope.dataUsers[''+key].style = '';
            $scope.dataUsers[''+key].color = '';
            if($scope.dataUserOfChatContent[''+key]){
                $scope.dataUserOfChatContent[''+key].status = 0;
            }
            var reg = new RegExp('\\[To:'+$scope.dataUserOfChatContent[key].id+'\\] [^<\\n>]*\\n','gi');
            var chatText = angular.element('#_chatText').val();
            chatText = chatText.replace(reg,'');
            angular.element('#_chatText').val(chatText);
        };
        $scope.unselectall = function(event){
            for(var key in $scope.dataUsers)
            {
                $scope.disselect(event,key);
            }
        };

        // stop event click parents of element that used this function
        $scope.stopEvent = function(event){
            event.stopPropagation();
        };

        //bind html click, if click outside of area of chatTO and showing chatTO, hide chatTO
        $scope.dataNewUserOfChatContent = '';
        angular.element('body').bind('click',function(event){
            $scope.dataNewUserOfChatContent = '';
            if($scope.show)
            {
                angular.element('#_dataListUser').css('display','none');
                $scope.show = false;
            }
        });

    }).filter('searchUser',function(){
        // filter list users
        return function(items,search,type){
            var out = [];
            if (angular.isArray(items)){
                items.forEach(function (item) {
                    // all users
                    if(type === 0)
                    {
                        if (item.name.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                            out.push(item);
                        }
                    } else if(type === 1){ // selected users
                        if(item.select === 1)
                        {
                            if (item.name.toString().toLowerCase().indexOf(''+search.toLowerCase()) !== -1) {
                                out.push(item);
                            }
                        }
                    } else if (type){
                        ///do something
                    }
                });
            } else {
                out = items;
            }
            return out;
        };
    });