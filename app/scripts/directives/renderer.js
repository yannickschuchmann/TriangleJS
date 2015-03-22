'use strict';

/**
 * @ngdoc directive
 * @name triangleJsApp.directive:renderer
 * @description
 * # Renderer
 */
angular.module('triangleJsApp')
  .directive('renderer', function (verticesService, settingsService) {
    var imgCanvas, imgCtx, canvas, canvasCtx, settings;

    var setup = function(element) {
      imgCanvas = document.getElementById("image");
      imgCtx = imgCanvas.getContext("2d");

      canvas = document.getElementById("polygon");
      canvasCtx = canvas.getContext("2d");

      element.find('img').on('load', function() {
        canvas.width = imgCanvas.width = this.width;
        canvas.height = imgCanvas.height = this.height;
        settingsService.set({
          width: this.width,
          height: this.height
        });

        imgCtx.drawImage(this, 0, 0);

        angular.element(this).css('display', 'none');
      });

      settings = settingsService.get();

      setupEvents();
    };

    var setupEvents = function() {
      canvas.addEventListener("mousedown", addVertex, false);
    };

    var addVertex = function(e) {
      e.preventDefault();

      verticesService.addVertex(getPosition(e));
      draw();
    };

    var getPosition = function(e) {
      var xPosition = 0,
        yPosition = 0,
        el = canvas;

      while(el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
      }

      return [
        e.x - xPosition,
        e.y - yPosition
      ];
    };

    var draw = function(customCtx) {
      var ctx = customCtx || canvasCtx;
      ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

      var triangles = verticesService.getTriangles();
      settings = settingsService.get();

      triangles.forEach(function(triangle) {
        var v0 = triangle.vertices[0],
          v1 = triangle.vertices[1],
          v2 = triangle.vertices[2];

        ctx.fillStyle = getVertexColor(triangle.getCenterVertex());
        ctx.beginPath();
        ctx.moveTo(v0[0], v0[1]);
        ctx.lineTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.closePath();
        ctx.fill();
        //ctx.stroke();

      });

      return ctx;
    };

    var getVertexColor = function(vertex) {
      var startY, startX = startY = 0, v = vertex,
        colorRange = settings.colorRange,
        radius = colorRange/ 2,
        colorData,
        result = [0,0,0];

      if (v[0] < radius) {
        startX = 0;
      } else {
        if (v[0] + radius > imgCanvas.width) {
          startX = imgCanvas.width - radius;
        } else {
          startX = v[0] - radius;
        }
      }

      if (v[1] < radius) {
        startY = 0;
      } else {
        if (v[1] + radius > imgCanvas.height) {
          startY = imgCanvas.height - radius;
        } else {
          startY = v[1] - radius;
        }
      }

      startX = ~~startX;
      startY = ~~startY;

      colorData = imgCtx.getImageData(startX, startY, colorRange, colorRange).data;

      for (var i = 0; i < Math.pow(colorRange, 2); i++) {
        result[0] += colorData[4 * i];
        result[1] += colorData[4 * i + 1];
        result[2] += colorData[4 * i + 2];
      }

      return "rgb(" + ~~(result[0]/i) + "," + ~~(result[1]/i) + "," + ~~(result[2]/i) + ")";
    };

    var exportSVG = function() {
      var svgCtx = new C2S(
        settingsService.get('width'), settingsService.get('height')
      );

      svgCtx = draw(svgCtx);
      open("data:image/svg+xml," + encodeURIComponent(svgCtx.getSerializedSvg()));
    };

    return {
      templateUrl: 'scripts/directives/renderer.html',
      restrict: 'E',
      link: function(scope, el) {
        setup(el);
        scope.$on('export', function() {
          exportSVG()
        });
        scope.$on('render', function() {
          draw();
        });
        scope.$watch(function() {
            return settingsService.get();
          },
          function() {
            draw();
          }, true);
      }
    };
  });
