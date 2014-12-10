(function () {
    var todosFactory = function () {
//------Variable Declaration     
        var todos = {"nodes":[
                        {"id":0,"type":"ROOT","name":"ROOT","status":"NA","group":1, "fixed":true},
                        {"id":1,"type":"item","name":"To Do Item 1","status":"Open","group":2, "fixed":false},
                        {"id":2,"type":"item","name":"To Do Item 1.2","status":"Open","group":2, "fixed":false},
                        {"id":3,"type":"item","name":"To Do Item 2","status":"Open","group":2, "fixed":false},
                        {"id":4,"type":"item","name":"To Do Item 3","status":"Open","group":2, "fixed":false},
                        {"id":5,"type":"item","name":"To Do Item 4","status":"Open","group":2, "fixed":false},
                        {"id":6,"type":"VISION","name":"Financially Sound","status":"Open","group":4, "fixed":true},
                        {"id":7,"type":"VISION","name":"Happy Family","status":"Open","group":4, "fixed":true},
                        {"id":8,"type":"VISION","name":"Meaningful Career","status":"Open","group":4, "fixed":true},
                        {"id":9,"type":"GOAL","name":"Mortgage Paid","status":"Open","group":3, "fixed":true},
                        {"id":10,"type":"GOAL","name":"Mealtimes together in Sept","status":"Open","group":3, "fixed":true},
                        {"id":11,"type":"GOAL","name":"Fisish Course On Angular","status":"Open","group":3, "fixed":true},
                    ],
                    "links": [
                        {"id":1,"value":1,"sourceRefId":0,"targetRefId":1, "source":0, "target":0},
                        {"id":2,"value":1,"sourceRefId":0,"targetRefId":3, "source":0, "target":0},
                        {"id":3,"value":1,"sourceRefId":0,"targetRefId":4, "source":0, "target":0},
                        {"id":4,"value":1,"sourceRefId":0,"targetRefId":5, "source":0, "target":0},
                        {"id":5,"value":1,"sourceRefId":1,"targetRefId":2, "source":0, "target":0},
                        {"id":6,"value":1,"sourceRefId":5,"targetRefId":9, "source":0, "target":0},
                        {"id":7,"value":1,"sourceRefId":9,"targetRefId":6, "source":0, "target":0},
                        {"id":8,"value":1,"sourceRefId":10,"targetRefId":7, "source":0, "target":0},
                        {"id":9,"value":1,"sourceRefId":11,"targetRefId":8, "source":0, "target":0},
                        {"id":10, "value":1,"sourceRefId":4,"targetRefId":9, "source":0, "target":0},
                        {"id":11,"value":1,"sourceRefId":3,"targetRefId":10, "source":0, "target":0},
                        {"id":12,"value":1,"sourceRefId":2,"targetRefId":11, "source":0, "target":0}
                    ]},
                    
 
            factory = {};
//......Methods        
        factory.getTodos = function(){
           return todos;
        };
        
        var findNodeIndex = function(id, todoList) {
            for (var i=0;i<todoList.nodes.length;i++) {
                if (todoList.nodes[i].id==id){
                    return i;
                }
            };
        }; 
        
        factory.deleteTodo = function(id, todoList){
            var sourceList = [], targetList = [];
            
            for(var j=0;j<todoList.links.length;j++){
                if (todoList.links[j].sourceRefId == id)
                {
                    targetList[targetList.length] = todoList.links[j].targetRefId;
                   // var myLink = todoList.links[j];
                  //  var mindex = todoList.links.indexOf(myindex);
                    //todoList.links.splice(mindex, 1); 
                    todoList.links.splice(j, 1)
                }
                else if (todoList.links[j].targetRefId == id)
                {
                    sourceList[sourceList.length] = todoList.links[j].sourceRefId;
                   // todoList.links.splice(todoList.links.indexOf(todoList.links[j]), 1);
                   todoList.links.splice(j, 1); 
                }
            }
            // Create new links between these identified sources and targets
           for(var j=0;j<sourceList.length;j++){
                for(var k=0;k<targetList.length;k++){
                    todoList.links.push(
                        {"id":27,"value":3,"sourceRefId":sourceList[j],"targetRefId": targetList[k], "source":0, "target":0}
                    );
                }   
            }
            // Remove the node 
            var nodeIndex = findNodeIndex(id, todoList);
            todoList.nodes.splice(nodeIndex, 1);
            return todoList;
        };
        return factory;
    }
    angular.module('todoappApp').factory('todosFactory', todosFactory);
}());