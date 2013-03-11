'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('rocketKids', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should automatically redirect to /list when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/list");
  });


  describe('list', function() {

    beforeEach(function() {
      browser().navigateTo('#/list');
    });


    it('should render list view when user navigates to /list', function() {
      expect(element('[ng-view] th:first').text()).
        toMatch(/First Name/);
    });

  });


  describe('add', function() {

    beforeEach(function() {
      browser().navigateTo('#/add');
    });


    it('should render add view when user navigates to /add', function() {
      expect(element('[ng-view] label:first').text()).
        toMatch(/First Name:/);
    });

  });
});
