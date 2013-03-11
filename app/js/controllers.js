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
    $scope.charts = {};
    $scope.charts["worldTempChart"] = {
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                    this.x +': '+ this.y +'°C';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 100,
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    };
}
DataCtrl.$inject = ['$scope', '$http', 'Student']

function getAgeYrs(dob) {
    var today = new Date();
    var ageMs = today - new Date(dob);
    return ageMs / (1000 * 60 * 60 * 24 * 365);
}