'use strict';

/* jasmine specs for controllers go here */

describe('MainCtrl', function(){
  var mainCtrl;
  var scope = {};
  var Student = {query: function(){}};

  beforeEach(function(){
    mainCtrl = new MainCtrl(scope, Student);
  });

  it('should have the username of Shanam', function() {
    expect(scope.user.firstName).toBe("Shanam");
  });
});


describe('AddCtrl', function(){
  var addCtrl;
  var scope = {};
  var Student = {query: function(){}};


  beforeEach(function(){
    addCtrl = new AddCtrl(scope, Student);
  });

  it('should ....', function() {
    //spec body
  });
});
