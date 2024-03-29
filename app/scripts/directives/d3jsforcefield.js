app.directive('forceFieldChart', function () {
   return {
      restrict: 'EA',//E = element, A = attribute, C = class, M = comment  
      template: '<div></div>',
      link: function ($scope, element, attrs) {
      
        var width = '100%',
            height = 400,
            color = d3.scale.category20(),
            circleRadius = 8,
            radian = 0,
            link, node,cloneData,
            force,
            deg2rad = Math.PI/180,
            rad2deg = 180/Math,
            PIcanvasHeightPx, canvasWidthPx, 
            affectedNodes = [{"ElementType":"Vision", "scalefactor":8.00, "nodes":[]}, 
                             {"ElementType":"Goal",   "scalefactor":40.00, "nodes":[]}];

        var svg = d3.select(".forceFieldChart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "mysvg").style("background-color", "black");
           
        canvasWidthPx   =   $(".mysvg").width();
        canvasHeightPx  =   $(".mysvg").height();
        var a = canvasWidthPx/2;
        var b = canvasHeightPx/2;
        
        var elipse1 = svg.append("ellipse")
                        .attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2)
                        .attr("rx", a).attr("ry", b)
                        .style("fill", "#6600CC").style("stroke-width","1").style("stroke", "white")
                        .on('click', function(d) {
                                $scope.$apply(function(){
                                $scope.currentToDo.id = "999";           // sgmullig: need to calculate the maximum id
                                $scope.currentToDo.status = "NEW";
                                $scope.currentToDo.name = "New Task";
                                $scope.currentToDo.type = "VISION";
                                $scope.currentToDo.description = "";
                            });
                            $('#todoModal2').modal('show');
                        });
          
        var elipse2 = svg.append("ellipse")
                        .attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2)
                        .attr("rx", a-(2*circleRadius)).attr("ry", b-(2*circleRadius))
                        .style("fill", "black").style("stroke-width","1").style("stroke", "white");  
          
        var elipse3 = svg.append("ellipse")
                        .attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2)
                        .attr("rx", a-(4*circleRadius)).attr("ry", b-(4*circleRadius))
                        .style("fill", "#6600CC").style("stroke-width","1").style("stroke", "white")
                        .on('click', function(d) {    
                            $scope.$apply(function(){ 
                                $scope.currentToDo.id = "999";           
                                $scope.currentToDo.status = "New Goal";
                                $scope.currentToDo.title = "New Goal";
                                $scope.currentToDo.type = "GOAL";
                                $scope.currentToDo.description = "";
                            });
                                $('#todoModal2').modal('show');
                            });
          
        var eclipse4 = svg.append("ellipse").attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2)
                        .attr("rx", a-(6*circleRadius)).attr("ry", b-(6*circleRadius))
                        .style("fill", "black").style("stroke-width","1").style("stroke", "white")
                        .on('click', function(d) {
                                $scope.$apply(function(){
                                    $scope.currentToDo.id = "999";           
                                    $scope.currentToDo.status = "NEW";
                                    $scope.currentToDo.title = "New Task";
                                    $scope.currentToDo.type = "item";
                                    $scope.currentToDo.description = "";
                                });
                                $('#todoModal2').modal('show');
                            });
        
        var findNode = function(id) {
            for (var i in $scope.todoData.nodes) {
                if ($scope.todoData.nodes[i]["id"] === id) return $scope.todoData.nodes[i];};
        };         
        var removeNode = function (id) {
            var i = 0;
            var newLinkSource = 0 , newLinkTarget = 0;
           // var n = findNode(id);
            while (i < $scope.todoData.links.length) {
                if (($scope.todoData.links[i]['sourceRefId'] == id)||($scope.todoData.links[i]['targetRefId'] == id))
                {

                    if ($scope.todoData.links[i]['sourceRefId'] == id) {
                        newLinkTarget = $scope.todoData.links[i]['targetRefId'];}
                    if ($scope.todoData.links[i]['targetRefId'] == id) {
                        newLinkSource = $scope.todoData.links[i]['sourceRefId'];}
                    $scope.todoData.links.splice(i,1);
                }
                else i++;
            }
   
            $scope.todoData.nodes.splice(findNodeIndex(id),1);
            $scope.todoData.links.push({"id":37,"value":1,"sourceRefId": newLinkSource,"targetRefId": newLinkTarget, "source":0, "target":0});
            update();
        };
        var findNodeIndex = function(id) {
            for (var i=0;i<$scope.todoData.nodes.length;i++) {
                if ($scope.todoData.nodes[i].id==id){
                    return i;
                }
            };
        };         
        var update =  function () {    
             console.log(JSON.stringify(cloneData)); 
             svg.selectAll('g').remove();
            for(var i=0;i<cloneData.nodes.length;i++){
                for(var j=0;j<cloneData.links.length;j++){
                    if (cloneData.links[j].sourceRefId == cloneData.nodes[i].id)    
                        cloneData.links[j].source=i;
                    if (cloneData.links[j].targetRefId == cloneData.nodes[i].id) 
                        cloneData.links[j].target=i; 
                }
                if (cloneData.nodes[i].fixed == true && cloneData.nodes[i].name == "ROOT")
                {
                    cloneData.nodes[i].x = canvasWidthPx/2;
                    cloneData.nodes[i].y = canvasHeightPx/2;
                } 
                if (cloneData.nodes[i].fixed == true && cloneData.nodes[i].type == "VISION")
                {
                    affectedNodes[0].nodes.push(cloneData.nodes.indexOf( cloneData.nodes[i] ));
                } 
                else if (cloneData.nodes[i].fixed == true && cloneData.nodes[i].type == "GOAL")
                {
                    affectedNodes[1].nodes.push(cloneData.nodes.indexOf( cloneData.nodes[i] ));
                }
            }

            var orderNodeCoord = function(){
                for (z=0; z<affectedNodes.length; z++)
                {
                    for(i=0;i<affectedNodes[z].nodes.length;i++){
                        var a = (canvasWidthPx/2)-affectedNodes[z].scalefactor;
                        var b = (canvasHeightPx/2)-affectedNodes[z].scalefactor;
                        var tanRad = Math.tan(radian);
                        if ( (radian >= 0 && radian < deg2rad*90) || (radian > deg2rad*270 && radian <= deg2rad*360))
                        {
                            cloneData.nodes[affectedNodes[z].nodes[i]].x = canvasWidthPx/2 +
                                                                    (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                            cloneData.nodes[affectedNodes[z].nodes[i]].y = canvasHeightPx/2 +
                                                                    (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        }
                        else{
                            cloneData.nodes[affectedNodes[z].nodes[i]].x = canvasWidthPx/2 -
                                                                    (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));;
                            cloneData.nodes[affectedNodes[z].nodes[i]].y = canvasHeightPx/2 -
                                                                    (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        }
                        radian += (2*Math.PI)/affectedNodes[z].nodes.length;
                       // console.log(radian);
                    }
                } 
            }
            orderNodeCoord();

            force = d3.layout.force()
                        .charge(-320)
                        .linkDistance(30)
                        .size([$(".mysvg").width(), height])
                        .nodes(cloneData.nodes)
                        .links(cloneData.links)
                        .start();
            
            link = svg.append("g").selectAll(".link")
                .data(cloneData.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                .style("stroke", function(d) {
                    //if(d.color !== null) {
                    //    return d.color;
                    //} else return 'red';
                    return 'red';
                });
           // link.exit().remove();
            
            node = svg.append("g").selectAll(".node")
                        .data(cloneData.nodes).enter()  
                        //added
                        .append('g')
                        .classed('gnode', true);
            
            var snode = node
                        .append("circle")
                        .attr("class", "node")
                        .attr("r", 8)
                        .call(force.drag)
                        .on('click', function(d) {
                            $scope.$apply(function(){
                                $scope.currentToDo.id = d.id;
                                $scope.currentToDo.status = d.status;
                                $scope.currentToDo.name = d.name;//"This is a new test";
                                $scope.currentToDo.sourceRefId = d.sourceRefId;//});
                                $scope.currentToDo.targetRefId = d.targetRefId;
                                $scope.currentToDo.target = d.target;
                                $scope.currentToDo.source = d.source;
                                $scope.currentToDo.possibleTargetRefId = getParentRefIDs(d.id, d.type);//d.targetRefId);
                            });
                            $('#todoModal2').modal('show');

                        })
                        .style("fill", "white");
            
            var textnode = node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
                textnode.style("fill", "white");
            
            force.on("tick", function() 
            {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }) ;
               // node.attr("cx", function(d) { return d.x; })
                //    .attr("cy", function(d) { return d.y; });
            }); 
            
            affectedNodes = [{"ElementType":"Vision", "scalefactor":8, "nodes":[]}, 
                             {"ElementType":"Goal",   "scalefactor":40, "nodes":[]}];
            radian = 0;
      };
          
     // console.log(JSON.stringify($scope.todoData));
      cloneData = clone($scope.todoData);
      update();
         // codeChange();
    
      function clearNodes(){
           node = [];
           link = [];
          //cloneData = {};
           force.start();
           d3.timer(force.resume);  
          
      }
          
    function codeChange() {
        selectedCode = this.value;
             
       // cloneData = clone(allData); // added
        clearNodes();
        cloneData = clone($scope.todoData);
        update();
    }
          
    function getParentRefIDs(id, type)
    {            
        var mylist = [];
        for (var i=0; i < $scope.todoData.nodes.length; i++) 
        {
            if ( type == "GOAL" && $scope.todoData.nodes[i].type == "VISION") 
            {
                mylist.push({"name": $scope.todoData.nodes[i].name, "id": $scope.todoData.nodes[i].id});       
            }
            else if ( type == "item" && $scope.todoData.nodes[i].type == "GOAL") {
               mylist.push({"name": $scope.todoData.nodes[i].name, "id": $scope.todoData.nodes[i].id}); 
            }
        }
        return mylist;
    };
      
      $('#todoModal2').on('hidden.bs.modal', function () {
          codeChange();
      });   
          
          function clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }    
          
          
          
          
          
   }        
      
       

       
       
       
       
       
   }
   
 
   
});

