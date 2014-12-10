'use strict';

//angular.module('todoappApp')
app.controller('MainCtrl', function ($scope, localStorageService, todosFactory) {
      
    $scope.isCollapsed = true;
    $scope.todoData = [];
    $scope.currentToDo = [];
    $scope.list = [];

    function init() {
        $scope.todoData = todosFactory.getTodos();
    }
    init();

    /* var todosInStore = localStorageService.get('todos');
    $scope.todos = todosInStore && todosInStore.split('\n') || [];
    $scope.$watch('todos', function () {
        localStorageService.add('todos', $scope.todos.join('\n'));
    }, true);
    $scope.addTodo = function () {
        $scope.todos.push($scope.todo);
        $scope.todo = '';
    }; */

    $scope.removeTodo = function (index) {
        var todDataTemp = $scope.todoData;
        //var index = $scope.currentToDo.id;
       // $scope.$apply(function(){ 
            $scope.todoData = todosFactory.deleteTodo(index, todDataTemp);
      //  });
    };

    $scope.findNodeName = function (id) {
        var i;
        for (i = 0; i < $scope.todoData.nodes.length; i++) {
            if ($scope.todoData.nodes[i].id == id){
                return $scope.todoData.nodes[i].name;
            }
        };
    };
    $scope.findCurrentNodeName = function() {
        console.log("The SourceRefId is" + $scope.currentToDo.sourceRefId);
        for (var i=0;i<$scope.todoData.nodes.length;i++) {
            if ($scope.todoData.nodes[i].id == $scope.currentToDo.sourceRefId){
                return $scope.todoData.nodes[i].name;
            }
        };
    };
    $scope.findParentNodeName = function() {
        for (var i=0;i<$scope.todoData.links.length;i++) {
            if ($scope.todoData.links[i].sourceRefId == $scope.currentToDo.id){
                for (var j=0; j<$scope.todoData.nodes.length;j++)
                {
                    if ($scope.todoData.nodes[j].id == $scope.todoData.links[i].targetRefId)
                    return $scope.todoData.nodes[j].name;
                }
            }
        };
    };    
    
     var addLink = function (source, target, value) {
        $scope.todoData.links.push(
            {   "id":99,
                "value":value,
                "sourceRefId":source,
                "targetRefId":target, 
                "source":0, 
                "target":0});
    };
 
      
      var findNodeIndex = function(id) {
            for (var i=0;i<$scope.todoData.nodes.length;i++) {
                if ($scope.todoData.nodes[i].id==id){
                    return i;
                }
            };
        };  
    
    $scope.updateTarget =  function(id, targetId){
            var i = 0;
            while (i < $scope.todoData.links.length) {
                if ($scope.todoData.links[i]['sourceRefId'] == id)
                {
                        $scope.todoData.links[i]['targetRefId'] = targetId;
                    
                }
                else i++;
            }
    };

    $scope.saveTodo = function(id) {
        
        if ($scope.currentToDo.status == "NEW") {
            alert("this is a new insert event");
            $scope.todoData.nodes.push(
                {"id":$scope.currentToDo.id,"type":"item","name":$scope.currentToDo.name,"status":"Open","group":2, "fixed":false, "x":0, "y":0 });
            addLink(0,$scope.currentToDo.id, 1);
            addLink($scope.currentToDo.id,11, 1);           
            //addLink(
            
            var rav;    //{"id":$scope.currentToDo.id});        
        } else 
        {
            $scope.todoData.nodes[$scope.currentToDo.id].status = $scope.currentToDo.status;
            $scope.todoData.nodes[$scope.currentToDo.id].name   = $scope.currentToDo.name;
        }  
    };   
      
      
  $scope.timeframe;

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);

  };
  $scope.timeframe2;
  $scope.timeframe3;
    
  $scope.log = function(thisTimeFrame) {
      $scope.timeframe = thisTimeFrame;
      //scope.timeframe.$apply();
  };
  $scope.log2 = function(thisTimeFrame) {
      $scope.timeframe2 = thisTimeFrame;
      //scope.timeframe.$apply();
  };    
  $scope.log3 = function(thisTimeFrame) {
      $scope.timeframe3 = thisTimeFrame;
      //scope.timeframe.$apply();
  };       
  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
      
    /*for (var i=0; i < $scope.todoData.nodes.length; i++) 
    {
        if ($scope.todoData.nodes[i].type == "GOAL") 
        $('#childElement').append('<li><a>' + $scope.todoData.nodes[i].name + '</a></li>');
    }*/
    //$scope.currentToDo.possibleTargetRefId = getParentRefIDs(d.id, d.targetRefId);
    $scope.getParentRefIDs = function(id, parentRefId)
    {            
        var mylist = [];
        for (var i=0; i < $scope.todoData.nodes.length; i++) 
        {
            if ($scope.todoData.nodes[i].type == $scope.todoData.nodes[parentRefId].type) 
            {
                mylist.push({"name": $scope.todoData.nodes[i].name, "id": $scope.todoData.nodes[i].id});       
            }
        }
        return mylist;
    };
    for (var i=0; i < $scope.todoData.nodes.length; i++) 
    {
        if ($scope.todoData.nodes[i].type == "GOAL") 
       // $('#childElement').append('<li><a>' + $scope.todoData.nodes[i].name + '</a></li>');
        {$scope.list.push($scope.todoData.nodes[i]);
        console.log( $scope.list[i] +"\n" );}
        
        for (var i=0;i<$scope.todoData.links.length;i++) {
            if ($scope.todoData.links[i].sourceRefId == $scope.currentToDo.id){
                for (var j=0; j<$scope.todoData.nodes.length;j++)
                {
                    if ($scope.todoData.nodes[j].id == $scope.todoData.links[i].targetRefId)
                    return $scope.todoData.nodes[j].name;
                }
            }
        };
    }
      
  });

