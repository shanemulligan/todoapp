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
                deg2rad = Math.PI/180,
                rad2deg = 180/Math,
                PIcanvasHeightPx, canvasWidthPx, 
                affectedNodes = [{"ElementType":"Vision", "scalefactor":1.00, "nodes":[]}, 
                                 {"ElementType":"Goal",   "scalefactor":0.85, "nodes":[]}];

        var svg = d3.select(".forceFieldChart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "mysvg").style("background-color", "lightyellow");
           
        canvasWidthPx   =   $(".mysvg").width();
        canvasHeightPx  =   $(".mysvg").height();
        var a = canvasWidthPx/2.05;
        var b = canvasHeightPx/2.05;
        
        var elipse1 = svg.append("ellipse").attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2).attr("rx", a).attr("ry", b)
                        .style("fill", "darkgrey").style("stroke-width","1").style("stroke", "black");
        var rectangle = svg.append("ellipse").attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2)
                        .attr("rx", a*.85).attr("ry", b*.85)
                        .style("fill", "lightgrey").style("stroke-width","1").style("stroke", "grey")
                        .on('click', function(d) {
                                $scope.currentToDo.id = "999";           // sgmullig: need to calculate the maximum id
                                $scope.currentToDo.status = "NEW";
                                $scope.currentToDo.title = "New Task";
                                $scope.currentToDo.description = "";

                                $('#todoModal2').modal('show');
                                //alert("New Item Alert");
                                //removeNode(d.id);
                                //$scope.$apply();
                                //update();
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
            console.log (newLinkTarget, " ", id);
            console.log (newLinkSource, " ", id);
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
            for(var i=0;i<$scope.todoData.nodes.length;i++){
                for(var j=0;j<$scope.todoData.links.length;j++){
                    if ($scope.todoData.links[j].sourceRefId == $scope.todoData.nodes[i].id) $scope.todoData.links[j].source=i;
                    if ($scope.todoData.links[j].targetRefId == $scope.todoData.nodes[i].id) $scope.todoData.links[j].target=i; 
                }
                if ($scope.todoData.nodes[i].fixed == true && $scope.todoData.nodes[i].name == "ROOT")
                {
                    $scope.todoData.nodes[i].x = canvasWidthPx/2;
                    $scope.todoData.nodes[i].y = canvasHeightPx/2;
                } 
                if ($scope.todoData.nodes[i].fixed == true && $scope.todoData.nodes[i].type == "VISION")
                {
                    affectedNodes[0].nodes.push($scope.todoData.nodes.indexOf( $scope.todoData.nodes[i] ));
                } 
                else if ($scope.todoData.nodes[i].fixed == true && $scope.todoData.nodes[i].type == "GOAL")
                {
                    affectedNodes[1].nodes.push($scope.todoData.nodes.indexOf( $scope.todoData.nodes[i] ));
                }
            }

            var orderNodeCoord = function(nodes, affectedNodes){
                for (z=0; z<affectedNodes.length; z++)
                {
                    for(i=0;i<affectedNodes[z].nodes.length;i++){
                        var a = (canvasWidthPx*affectedNodes[z].scalefactor)/2.05;
                        var b = (canvasHeightPx*affectedNodes[z].scalefactor)/2.05;
                        var tanRad = Math.tan(radian);
                        if ( (radian >= 0 && radian < deg2rad*90) || (radian > deg2rad*270 && radian <= deg2rad*360))
                        {
                            $scope.todoData.nodes[affectedNodes[z].nodes[i]].x = canvasWidthPx/2 +
                                                                    (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                            $scope.todoData.nodes[affectedNodes[z].nodes[i]].y = canvasHeightPx/2 +
                                                                    (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        }
                        else{
                            $scope.todoData.nodes[affectedNodes[z].nodes[i]].x = canvasWidthPx/2 -
                                                                    (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));;
                            $scope.todoData.nodes[affectedNodes[z].nodes[i]].y = canvasHeightPx/2 -
                                                                    (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        }
                        radian += (2*Math.PI)/affectedNodes[z].nodes.length;
                        console.log(radian);
                    }
                } 
            }
            orderNodeCoord($scope.todoData.nodes, affectedNodes);

            var force = d3.layout.force()
                        .charge(-320)
                        .linkDistance(30)
                        .size([$(".mysvg").width(), height])
                        .nodes($scope.todoData.nodes)
                        .links($scope.todoData.links)
                        .start();

            var link = svg.selectAll(".link")
                .data($scope.todoData.links);
            link.enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                .style("stroke", function(d) {
                    //if(d.color !== null) {
                    //    return d.color;
                    //} else return 'red';
                    return 'red';
                });
            link.exit().remove();

            var node = svg.selectAll(".node")
                        .data($scope.todoData.nodes);
                node.enter().append("circle")
                        .attr("class", "node")
                        .attr("r", circleRadius)
                        .style("fill", function(d) { return color(d.group); })
                        .call(force.drag)
                        .on('click', function(d) {
                            $scope.currentToDo.id = d.id;
                            $scope.currentToDo.status = d.status;
                            $scope.currentToDo.name = d.name;"This is a new test";
                            $scope.currentToDo.sourceRefId = d.sourceRefId;//});
                            $scope.currentToDo.targetRefId = d.targetRefId;
                            $scope.currentToDo.target = d.target;
                            $scope.currentToDo.source
                           // $scope.currentToDo.description = d.name;
                            $scope.$apply();
                            $('#todoModal2').modal('show');
                            //removeNode(d.id);
                            //$scope.$apply();
                            //update();
                        });
                node.append("title").text(function(d) { return d.name; });
                node.exit().remove();

            force.on("tick", function() 
            {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });
            console.log ("watch triggered");

            affectedNodes = [{"ElementType":"Vision", "scalefactor":1.00, "nodes":[]}, 
                             {"ElementType":"Goal",   "scalefactor":0.85, "nodes":[]}];
            radian = 0;

      };
      
      update();
      
      $('#todoModal2').on('hidden.bs.modal', function () {
          update();
      });   
   }         
   }
});

