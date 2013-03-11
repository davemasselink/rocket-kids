'use strict';

/* Controllers */

function MainCtrl($scope, Student) {
    $scope.user = {firstName: "Shanam"};

    $scope.students = Student.query(function(response){
        angular.forEach(response, function(student){
            student.ageYrs = getAgeYrs(student.dob);
        });
    });
}
MainCtrl.$inject = ['$scope', 'Student'];

function AddCtrl($scope, $location, Student) {
    $scope.newStudent = {};

    $scope.dobOptions = {
        changeYear: true,
        changeMonth: true,
        defaultDate: '-5y'
    };

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true
    };

    $scope.addStudent = function(newStudent){
        Student.save(newStudent);
        $location.path("/list")
    };
}
AddCtrl.$inject = ['$scope', '$location', 'Student'];

function DataCtrl($scope, $http, Student) {
    var geocoder = new google.maps.Geocoder();
    $scope.studentHomeMarkers = [];

    $scope.studentHomeMapOptions = {
        center: new google.maps.LatLng(37.381821,-122.046089),
        //https://maps.google.com/maps?q=Windsor+Preschool+Academy,+South+Mary+Avenue,+Sunnyvale,+CA&hl=en&ll=37.381821,-122.046089&spn=0.046309,0.090294&sll=37.269174,-119.306607&sspn=11.863113,23.115234&oq=windsor+preschool&hq=Windsor+Preschool+Academy,&hnear=S+Mary+Ave,+Sunnyvale,+California&t=m&z=14&iwloc=A
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    Student.query(function(response){
        angular.forEach(response,
            function(student){
                geocoder.geocode({'address': student.addr + ", " + student.addrCity + ", " + student.addrState},
                    function (results, status){
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.studentHomeMarkers.push(new google.maps.Marker({
                                map: $scope.studentHomeMap,
                                position: results[0].geometry.location
                            }));
                        }
                    }
                );
            }
        );
    });
}
DataCtrl.$inject = ['$scope', '$http', 'Student']

function ChartCtrl($scope){
    $scope.chartData = [1,4,9,16,25];
}
ChartCtrl.$inject = ['$scope']

function getAgeYrs(dob) {
    var today = new Date();
    var ageMs = today - new Date(dob);
    return ageMs / (1000 * 60 * 60 * 24 * 365);
}