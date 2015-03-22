'use strict';

describe('Service: verticesService', function () {

  // load the service's module
  beforeEach(module('triangleJsApp'));

  // instantiate service
  var verticesService;
  beforeEach(inject(function (_verticesService_) {
    verticesService = _verticesService_;
  }));

  it('should do something', function () {
    expect(!!verticesService).toBe(true);
  });

});
