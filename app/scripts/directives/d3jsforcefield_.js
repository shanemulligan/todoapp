angular.module('todoappApp').directive('forceFieldChart', ['$compile',  '$parse', '$window', function ($compile, $parse, $window) {
   return{
      restrict:'EA',
      //template:"<svg class='svg-class' width='850' height='200'></svg>",
       link: function(scope, elem, attrs){
          // var exp = $parse(attrs.todoData);
           var exp = $parse("todoData");
           var todoDataToPlot=exp(scope);
           //var padding = 20;
           var pathClass="path";
           
           var rectangle, color, force, node, link, div, width, height;

           var d3 = $window.d3;
           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);
           width = 840, height = 190;
           

           var color = d3.scale.category20();
           //force = d3.layout.force().charge(-120).linkDistance(30).size([width, height]);
           svg = d3.select(".container").append("svg").attr("width", width).attr("height", height).attr("class", "svg-class");
           rectangle = svg.append("rect").attr("x", 25).attr("y", 25).attr("width", 840).attr("height", 190);
           div = d3.select(".container").append("div").attr("class", "tooltip").style("opacity", 0); 

           scope.$watchCollection(exp, function(newVal, oldVal){
               todoDataToPlot=newVal;
               refreshGraph();
           });

           var refreshGraph = function(){
                //force.nodes(todoDataToPlot.nodes).links(todoDataToPlot.links).start();
                 d3.layout.force().charge(-120).linkDistance(30).size([width, height]).nodes(todoDataToPlot.nodes).start();
                //link = svg.selectAll(".link").data(todoDataToPlot.links).enter().append("line").attr("class", "link")
                //     .style("stroke-width", function(d) { return Math.sqrt(d.value); });

                node = svg.selectAll(".node").data(todoDataToPlot.nodes).enter().append("circle")
                      .attr("class", "node")
                      .attr("r", 5)
                      .style("fill", function(d) { return color(d.group); })
                      .call(force.drag)
                      .on('mouseover',function(d) {
                        //div.transition().duration(200).style("opacity", 0.9);
                       // div.html("<span style='color:red'>" + d.name + "</span>")
                        //    .style("left", (d3.event.pageX)+"px")
                        //    .style("top", (d3.event.pageY-28)+"px"); 
                      })  //added for tips
                      .on('mouseout', function(d) {
                        //div.transition().duration(500).style("opacity", 0);
                      })
                      .on('click', function(d) {
                         var the_string = 'todo.id';
                          alert('this is a todoitem');
                         // $('#todoModal2').modal('show');
                      });
            };
           
            for(var i=0;i<todoDataToPlot.nodes.length;i++){
                for(var j=0;j<todoDataToPlot.links.length;j++){
                    if (todoDataToPlot.links[j].sourceRefId == todoDataToPlot.nodes[i].id) todoDataToPlot.links[j].source=i;
                    if (todoDataToPlot.links[j].targetRefId == todoDataToPlot.nodes[i].id) todoDataToPlot.links[j].target=i; 
                }
            }   

            refreshGraph();

            node.append("title").text(function(d) { return d.name; });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });  
            });
            elem.removeAttr("force-field-chart");
            $compile(elem)(scope);
       }
   };
}]);