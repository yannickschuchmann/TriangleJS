'use strict';

/**
 * @ngdoc service
 * @name triangleJsApp.verticesService
 * @description
 * # verticesService
 * Service in the triangleJsApp.
 */
angular.module('triangleJsApp')
  .service('verticesService', function () {
    var vertices = [];

    function Triangle(vertices) {
      this.vertices = vertices;
      this.getCenterVertex = function() {
        var x, y = x = 0, length = this.vertices.length;
        this.vertices.forEach(function(v) {
          x += v[0];
          y += v[1];
        });

        return [~~(x / length), ~~(y / length)]
      }
    }

    this.getTriangles = function() {
      var triangles = [], tempTriangles = Delaunay.triangulate(vertices),
        triVertices;

      for (var i = 0; i < tempTriangles.length; i) {
        triVertices = tempTriangles.slice(i, i + 3);
        for (var j = 0; j < triVertices.length; j++) {
          var index = triVertices[j];
          triVertices[j] = [vertices[index][0], vertices[index][1]];
        }
        triangles.push(new Triangle(triVertices));
        i += 3;
      }
      return triangles;
    };

    this.addVertex = function(vertex) {
      vertices.push(vertex);
    };

    this.removeLastVertex = function() {
      vertices.splice(-1);
    };

    this.removeAllVertices = function() {
      vertices = [];
    };


  });
