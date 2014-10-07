angular.module('todoappApp').directive('forceFieldChart', function ($compile, $parse, $window) {
   return {
      restrict:'EA', 
      //template:"<svg class='svg-class' width='850' height='200'></svg>",     
      link: function (scope, element, apply) 
      {
            var width = '100%',
                height = 400,
                color = d3.scale.category20(),
                countOfVisionElements = 0,
                visionElementIds = [],
                countOfGoalElements = 0,
                goalElementIds = [], 
                radian = 0,
                deg2rad = Math.PI/180,
                rad2deg = 180/Math,
                PIcanvasHeightPx, canvasWidthPx;
            scope.$watch("todoData", function (todoData) {
                var svg = d3.select(".container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "mysvg").style("background-color", "lightyellow");
                
                canvasWidthPx   =   $(".mysvg").width();
                canvasHeightPx  =   $(".mysvg").height();
                var a = canvasWidthPx/2.05;
                var b = canvasHeightPx/2.05;
                
                for(var i=0;i<todoData.nodes.length;i++){
                    for(var j=0;j<todoData.links.length;j++){
                        if (todoData.links[j].sourceRefId == todoData.nodes[i].id) scope.todoData.links[j].source=i;
                        if (scope.todoData.links[j].targetRefId == scope.todoData.nodes[i].id) scope.todoData.links[j].target=i; 
                    }
                    if (scope.todoData.nodes[i].fixed == true && scope.todoData.nodes[i].name == "ROOT")
                    {
                        scope.todoData.nodes[i].x = canvasWidthPx/2;
                        scope.todoData.nodes[i].y = canvasHeightPx/2;
                    } 
                    if (scope.todoData.nodes[i].fixed == true && scope.todoData.nodes[i].type == "VISION")
                    {
                        countOfVisionElements++; 
                        visionElementIds[visionElementIds.length] = scope.todoData.nodes[i].id;
                    } 
                    else if (scope.todoData.nodes[i].fixed == true && scope.todoData.nodes[i].type == "GOAL")
                    {
                        countOfGoalElements++; 
                        goalElementIds[goalElementIds.length] = scope.todoData.nodes[i].id;
                    }
                }
                console.log(countOfVisionElements, visionElementIds);
                console.log(countOfGoalElements, goalElementIds);

                
                for(var i=0;i<visionElementIds.length;i++){
                    var tanRad = Math.tan(radian);
                   
                    if ( (radian >= 0 && radian < deg2rad*90) || (radian > deg2rad*270 && radian <= deg2rad*360))
                    {
                        scope.todoData.nodes[visionElementIds[i]].x = canvasWidthPx/2 +
                                                                (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        scope.todoData.nodes[visionElementIds[i]].y = canvasHeightPx/2 +
                                                                (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                    }
                    else{
                        scope.todoData.nodes[visionElementIds[i]].x = canvasWidthPx/2 -
                                                                (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));;
                        scope.todoData.nodes[visionElementIds[i]].y = canvasHeightPx/2 -
                                                                (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                    }
                    radian += (2*Math.PI)/countOfVisionElements;
                    console.log(radian);
                }
                var elipse1 = svg.append("ellipse").attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2).attr("rx", a).attr("ry", b)
                                 .style("fill", "darkgrey").style("stroke-width","1").style("stroke", "black");
                a=a*.85;
                b=b*.85;
                for(var i=0;i<goalElementIds.length;i++)
                {
                    var tanRad = Math.tan(radian);                  
                    if ( (radian >= 0 && radian < deg2rad*90) || (radian > deg2rad*270 && radian <= deg2rad*360))
                    {
                        scope.todoData.nodes[goalElementIds[i]].x = canvasWidthPx/2 +
                                                                (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                        scope.todoData.nodes[goalElementIds[i]].y = canvasHeightPx/2 +
                                                                (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                    }
                    else{
                        scope.todoData.nodes[goalElementIds[i]].x = canvasWidthPx/2 -
                                                                (a*b)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));;
                        scope.todoData.nodes[goalElementIds[i]].y = canvasHeightPx/2 -
                                                                (a*b*tanRad)/(Math.sqrt( (b*b)+(a*a*tanRad*tanRad)));
                    }
                    radian += (2*Math.PI)/countOfGoalElements;
                    console.log(radian);
                }

                
                var force = d3.layout.force()
                            .charge(-120)
                            .linkDistance(30)
                            .size([$(".mysvg").width(), height])
                            .nodes(scope.todoData.nodes)
                            .links(scope.todoData.links)
                            .start();
                var rectangle = svg.append("ellipse").attr("cx", canvasWidthPx/2).attr("cy", canvasHeightPx/2).attr("rx", a).attr("ry", b)
                            .style("fill", "lightgrey").style("stroke-width","1").style("stroke", "grey");
                var link = svg.selectAll(".link")
                            .data(scope.todoData.links)
                            .enter().append("line")
                            .attr("class", "link")
                            .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                            .style("stroke", function(d) {
                                return 'red';
                            });

                var node = svg.selectAll(".node")
                            .data(scope.todoData.nodes)
                            .enter().append("circle")
                            .attr("class", "node")
                            .attr("r", 5)
                            .style("fill", function(d) { return color(d.group); })
                            .call(force.drag)
                            .on('click', function(d) {
                                scope.currentToDo.id = d.id;
                                scope.currentToDo.status = d.status;
                                scope.currentToDo.title = d.name;"This is a new test";
                                scope.currentToDo.description = d.name;
                                $('#todoModal2').modal('show');
                                scope.removeTodo(d.id);
                                scope.$apply();
                            });
                node.append("title").text(function(d) { return d.name; });

                
            });
      }
   };
});