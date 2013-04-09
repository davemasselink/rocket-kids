'use strict';

/* Controllers */

function MainCtrl($scope) {
    $scope.user = {firstName: "Shanam"};
}
MainCtrl.$inject = ['$scope'];

function ListCtrl($scope, Student){
    $scope.students = Student.query(function(response){
        angular.forEach(response, function(student){
            student.ageYrs = getAgeYrs(student.dob);
        });
    });
}
ListCtrl.$inject = ['$scope', 'Student'];

function getAgeYrs(dob) {
    var today = new Date();
    var ageMs = today - new Date(dob);
    return ageMs / (1000 * 60 * 60 * 24 * 365);
}

function AddCtrl($scope, $location, Student, Ethnicity) {
    $scope.newStudent = {};

    $scope.ethnicityChoices = Ethnicity.query();

    $scope.addStudent = function(newStudent){
        //This defaults the enrollment status to enrolled for students who are
        //quick-added.
        if(!newStudent.enrollmentStatus){
            newStudent.enrollmentStatus = "enrolled";
        }
        //Then save the student to DB
        Student.save(newStudent, function(){
            //And re-direct to main page
            $location.path("/").replace();
            $scope.$apply();
        });
    };

    $scope.dobOptions = {
        changeYear: true,
        changeMonth: true,
        defaultDate: '-5y'
    };

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true
    };

    $scope.datesReversedValidator = function(startDate){
        return !($scope.newStudent.endDate < startDate);
    };
}
AddCtrl.$inject = ['$scope', '$location', 'Student', 'Ethnicity'];

function DataCtrl($scope, Student, Ethnicity) {
    var geocoder = new google.maps.Geocoder();
    $scope.mapOptions = {
        center: new google.maps.LatLng(37.381821,-122.046089),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Load Student home map
    $scope.studentHomeMarkers = [];
    Student.query(function(response){
        response.forEach(function(student){
            if(student && student.addr && student.addrCity && student.addrState){
                //Geocode student home addr via Google Maps
                geocoder.geocode({'address': student.addr + ", " + student.addrCity + ", " + student.addrState},
                    function (results, status){
                        results.forEach(function(result){
                            addMarkerToMap(result, status, $scope.studentHomeMarkers, $scope.studentHomeMap);
                        })
                    }
                );
            }
        });
    });
    //Load Guardian work map
    $scope.guardianWorkMarkers = [];
    Student.query(function(response){
        response.forEach(function(student){
            if(student && student.pg1EmployerAddr && student.pg1EmployerCity){
                //Geocode guardian #1's addr via Google Maps
                geocoder.geocode({'address': student.pg1EmployerAddr + ", " + student.pg1EmployerCity},
                    function (results, status){
                        results.forEach(function(result){
                            addMarkerToMap(result, status, $scope.guardianWorkMarkers, $scope.guardianWorkMap);
                        })
                    }
                );
            }
            if(student && student.pg2EmployerAddr && student.pg2EmployerCity){
                //Geocode guardian #2's addr via Google Maps
                geocoder.geocode({'address': student.pg2EmployerAddr + ", " + student.pg2EmployerCity},
                    function (results, status){
                        results.forEach(function(result){
                            addMarkerToMap(result, status, $scope.guardianWorkMarkers, $scope.guardianWorkMap);
                        })
                    }
                );
            }
        });
    });
    //Helper function for adding markers to a map
    function addMarkerToMap(geocodeResult, geocodeStatus, markers, renderToMap){
        if (geocodeStatus == google.maps.GeocoderStatus.OK) {
            markers.push(new google.maps.Marker({
                map: renderToMap,
                position: geocodeResult.geometry.location
            }));
        }
    }

    $scope.studentEthnicityChart = {};
    $scope.studentEthnicityChartSeries = [];
    $scope.getStudentEthnicityChartData = function(){
        var ethnicityMonthlyCount = {};
        //TODO: create a school or facility wide "open date" and use that as default chart start
        var schoolStartDate;
        var students = Student.query(function(){
            students.forEach(function(student){
                var startDate = new Date(student.startDate);
                if (!schoolStartDate || (startDate < schoolStartDate)){
                    schoolStartDate = startDate;
                }
            });
            //Now loop through all the students and for each
            students.forEach(function(student){
                //grab some details
                var ethnicityId = student.ethnicityId;
                //make sure this ethnicity has been seen already
                if(!ethnicityMonthlyCount[ethnicityId]){
                    //and initialize the array if it hasn't
                    ethnicityMonthlyCount[ethnicityId] = [];
                }
                var today = new Date();
                var startDate = new Date(student.startDate);
                //if there is no endDate, assume today is the endDate
                var endDate = student.endDate ? new Date(student.endDate) : today;
                var sampleDate = schoolStartDate;
                var sampleDateIndex = 0;
                var utcYear, utcMonth, utcDate;
                //and then cycle through each month since the chartStartDate
                while(sampleDate < today){
                    //grab a convenient hold of UTC year, month, date
                    utcYear = sampleDate.getUTCFullYear();
                    utcMonth = sampleDate.getUTCMonth();
                    utcDate = sampleDate.getUTCDate();
                    //if this ethnicity/date combo hasn't been touched yet
                    if(!ethnicityMonthlyCount[ethnicityId][sampleDateIndex]){
                        //initialize the count
                        ethnicityMonthlyCount[ethnicityId][sampleDateIndex] = [
                            Date.UTC(utcYear, utcMonth, utcDate), 0];
                    }
                    //if the student was enrolled on the sample date
                    if (startDate <= sampleDate && sampleDate < endDate){
                        //count the student in their ethnicity group
                        //the index of 1 points to the count (as opposed to the date)
                        ethnicityMonthlyCount[ethnicityId][sampleDateIndex][1] += 1;
                    }
                    //then add a month to the sample date and iterate
                    sampleDate = addDaysToDate(sampleDate, 365.25/12);
                    sampleDateIndex += 1;
                }
            });
        });
        var ethnicities = Ethnicity.query(function(){
            //Finally loop through all the ethnicities and for each create a data series
            ethnicities.forEach(function(ethnicity){
                var id = ethnicity._id.$oid;
                if (ethnicityMonthlyCount[id]){
                    $scope.studentEthnicityChartSeries.push({
                        name: ethnicity.displayName,
                        data: ethnicityMonthlyCount[id]
                    });
                }
            });
            $scope.studentEthnicityChart = {
                title: {
                    text: 'Month by Month Student Ethnicity'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%Y-%b-%e',
                        month: '%Y-%b'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Students'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                series: $scope.studentEthnicityChartSeries
            };
        });

    };
    $scope.studentGenderChart = {};
    $scope.studentGenderChartSeries = [];
    $scope.getStudentGenderChartData = function(){
        var genderMonthlyCount = {};
        //TODO: create a school or facility wide "open date" and use that as default chart start
        var schoolStartDate;
        var students = Student.query(function(){
            students.forEach(function(student){
                var startDate = new Date(student.startDate);
                if (!schoolStartDate || (startDate < schoolStartDate)){
                    schoolStartDate = startDate;
                }
            });
            //Now loop through all the students and for each
            students.forEach(function(student){
                //grab some details
                var gender = student.gender;
                //make sure this gender has been seen already
                if(!genderMonthlyCount[gender]){
                    //and initialize the array if it hasn't
                    genderMonthlyCount[gender] = [];
                }
                var today = new Date();
                var startDate = new Date(student.startDate);
                //if there is no endDate, assume today is the endDate
                var endDate = student.endDate ? new Date(student.endDate) : today;
                var sampleDate = schoolStartDate;
                var sampleDateIndex = 0;
                var utcYear, utcMonth, utcDate;
                //and then cycle through each month since the chartStartDate
                while(sampleDate < today){
                    //grab a convenient hold of UTC year, month, date
                    utcYear = sampleDate.getUTCFullYear();
                    utcMonth = sampleDate.getUTCMonth();
                    utcDate = sampleDate.getUTCDate();
                    //if this ethnicity/date combo hasn't been touched yet
                    if(!genderMonthlyCount[gender][sampleDateIndex]){
                        //initialize the count
                        genderMonthlyCount[gender][sampleDateIndex] = [
                            Date.UTC(utcYear, utcMonth, utcDate), 0];
                    }
                    //if the student was enrolled on the sample date
                    if (startDate <= sampleDate && sampleDate < endDate){
                        //count the student in their ethnicity group
                        //the index of 1 points to the count (as opposed to the date)
                        genderMonthlyCount[gender][sampleDateIndex][1] += 1;
                    }
                    //then add a month to the sample date and iterate
                    sampleDate = addDaysToDate(sampleDate, 365.25/12);
                    sampleDateIndex += 1;
                }
            });
            ['male', 'female'].forEach(function(gender){
                if (genderMonthlyCount[gender]){
                    $scope.studentGenderChartSeries.push({
                        name: gender,
                        data: genderMonthlyCount[gender]
                    });
                }
            });
            $scope.studentGenderChart = {
                title: {
                    text: 'Month by Month Student Gender'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%Y-%b-%e',
                        month: '%Y-%b'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Students'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                series: $scope.studentGenderChartSeries
            };
        });
    };
    function addDaysToDate(date, numDays) {
        return new Date(date.getTime() + numDays * 24 * 60 * 60* 1000);
    }
    //Then generate the data
    $scope.getStudentEthnicityChartData();
    $scope.getStudentGenderChartData();
}
DataCtrl.$inject = ['$scope', 'Student', 'Ethnicity'];

function DailyCommCtrl($scope, $location, Student, DailyComm) {
    $scope.students = Student.query(function(response){
        angular.forEach(response, function(student){
            student.ageYrs = getAgeYrs(student.dob);
        });
    });

    $scope.save = function(dailyComm){
        DailyComm.save(dailyComm, function(){
            $location.path("/").replace();
        });
    };
}
DailyCommCtrl.$inject = ['$scope', '$location', 'Student', 'DailyComm'];