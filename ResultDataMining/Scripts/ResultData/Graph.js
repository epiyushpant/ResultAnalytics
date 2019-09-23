
 function GraphViewModel() {
     var self = this;

     $("#divSemester").hide();
     self.SelectedFaculty = ko.observable();
     self.SelectedReportType = ko.observable();
     self.SelectedBatch = ko.observable();
     self.SelectedGender = ko.observable();
     self.Faculties = ko.observableArray([]);
     self.Batchs = ko.observableArray([]);
     self.Result = ko.observableArray([]);
     self.SelectedRank = ko.observable();
     self.Ranks = ko.observableArray([]);
     self.Genders = ko.observableArray([]);
     var chart1;
     var chart2;
     var chart3;
     var chart4;
     var chart5;
     var chart6;

     self.Semesters = ko.observableArray([
         { Sem: "ONE" },
         { Sem: "TWO" },
         { Sem: "THREE" },
         { Sem: "FOUR" },
         { Sem: "FIVE" },
         { Sem: "SIX" },
         { Sem: "SEVEN" },
         { Sem: "EIGHT" }

     ]);

     self.ReportTypes = ko.observableArray([
         { Id: 1, ReportType: "Gender Count" },
         { Id: 2, ReportType: "District Count" },
         { Id: 3, ReportType: "Percentage Comparision" },
         { Id: 4, ReportType: "Semisterwise Performance" },
         { Id: 5, ReportType: "Batch Performance" },
         { Id: 6, ReportType: "Faculty Performance" },
         { Id: 7, ReportType: "Sem VS Other" },
         { Id: 8, ReportType: "Sem VS Sem" },
         { Id: 9, ReportType: "Male Vs Female" },
         { Id: 10, ReportType: "Regular vs FullFee" }
     ]);

     self.SelectedSem = ko.observable();
     self.SelectedSem2 = ko.observable();
     self.SelectedCat = ko.observable();
     self.Categories = ko.observableArray([]);
     var graphresult;

    function LoadGraph() {
        $.ajax({
            dataType: "json",
            cache: false,
            async:false,
            url: '/Graph/ConvertJSON',
            success: function (res) {
                if (!res) {
                    $.alert({
                        title: 'Alert!',
                        content: 'Please Upload Data!',
                    });

                   return;
                }

              
                graphresult = res;
                self.Result(res);
                //console.log(res);
                LoadDropDown(self.Result());
                            
         },
            error: function (err) {

            }
        });
    }

     LoadGraph();

     self.ChangeGraphType = function () {
         hideAll();
     }

     self.ChangeFaculty = function () {

         let result = self.Result();
         if (self.SelectedFaculty()) {
             result = result.filter(x => (x["Faculty(BE)"] == self.SelectedFaculty()));
         }

         if (self.SelectedBatch()) {
             result = result.filter(x => x.Batch == self.SelectedBatch());
         }

         if (self.SelectedCat()) {
             result = result.filter(x => (x["Regular/Fullfee"] == self.SelectedCat()));

         }

         if (self.SelectedGender()) {
             result = result.filter(x => (x.Gender == self.SelectedGender()));

         }

         LoadDropDownRank(result);
     };
 
     

     self.ChangeCat = function () {  
         self.ChangeFaculty();

     }
  
     self.ChangeBatch = function () {
         self.ChangeFaculty();
     }


     self.ChangeGender = function () {
         self.ChangeFaculty();
     }



     self.Search = function () {

         hideAll();
         //var e = document.getElementById("ddlReportType");

         if (self.SelectedReportType()) {
             let sValue = self.SelectedReportType();
             // var sValue = e.options[e.selectedIndex].value;
             let result = self.Result();

             if (self.SelectedBatch()) {
                // console.log(self.SelectedBatch());
                 result = result.filter(x => x.Batch == self.SelectedBatch());

             }
             if (self.SelectedFaculty()) {
                 result = result.filter(x => (x["Faculty(BE)"] == self.SelectedFaculty()));

             }
             if (self.SelectedCat()) {
                 result = result.filter(x => (x["Regular/Fullfee"] == self.SelectedCat()));

             }

             if (self.SelectedRank()) {
                 result = result.filter(x => (x.Rank == self.SelectedRank()));

             }

             if (self.SelectedGender()) {
                 result = result.filter(x => (x.Gender == self.SelectedGender()));

             }


             if (sValue == 1) {

                // console.log(result);
                 loadGenderCount(result);


                 $("#chartContainer").show();
                 $("#exportChart1").show();
             }

             else if (sValue == 2) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 loadDistrictCount(result);
             }
             else if (sValue == 3) {
                 $("#chartContainer4").show();
                 $("#exportChart4").show();
                 $("#chartContainer5").show();
                 $("#exportChart5").show();
                 $("#chartContainer6").show();
                 $("#exportChart6").show();
                 loadEntranceVSAggregrate(result);
                 loadCollegeVSAggregrate(result);
                 CollegeVsEntrance(result);

             }
             else if (sValue == 4) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 $("#chartContainer2").show();
                 $("#exportChart2").show();
                 $("#chartContainer3").show();
                 $("#exportChart3").show();
                 var array = loadAverageSemesterwise(result);
                 LoadSemisterwisePercentChart(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7]);
                 loadAverageSemesterwiseAmongAppeared(result);
             }

             else if (sValue == 5) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 var batchavg = [];
                 for (i = 0; i < self.Batchs().length; i++) {
                     let arrr = result.filter(x => x.Batch == self.Batchs()[i].Batch);
                    // console.log(arrr);
                     let res = loadAverageSemesterwise(arrr);
                     bat = {
                         Batch: self.Batchs()[i].Batch,
                         avg: res
                     }
                     batchavg.push(bat);
                 }
                 PlotLineChart(batchavg);
             }


             else if (sValue == 6) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 var facavg = [];
                 for (i = 0; i < self.Faculties().length; i++) {
                     let arrr = result.filter(x => x["Faculty(BE)"] == self.Faculties()[i].Faculty);
                    // console.log(arrr);
                     let res = loadAverageSemesterwise(arrr);
                     bat = {
                         Faculty: self.Faculties()[i].Faculty,
                         avg: res
                     }
                     facavg.push(bat);

                 }
                 //console.log(facavg);
                 ElecVSComp(facavg);
             }

             else if (sValue == 7) {
                 $("#chartContainer4").show();
                 $("#exportChart4").show();
                 $("#chartContainer5").show();
                 $("#exportChart5").show();
                 SemVsEntrance(result);
                 SemVsCollege(result);
                 $("#divSemester").show();
             }

             else if (sValue == 8) {
                 $("#divSemester").show();
                 $("#divSem2").show();
                 $("#chartContainer4").show();
                 $("#exportChart4").show();
                 SemVsSem(result);

             }


             else if (sValue == 9) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 var genavg = [];
                 for (i = 0; i < self.Genders().length; i++) {
                     let arrr = result.filter(x => x.Gender == self.Genders()[i].Gender);
                     let res = loadAverageSemesterwise(arrr);
                     bat = {
                         Gender: self.Genders()[i].Gender,
                         avg: res
                     }
                     genavg.push(bat);

                 }
                 MaleVsFemale(genavg);
             }

             else if (sValue == 10) {
                 $("#chartContainer1").show();
                 $("#exportChart1").show();
                 var catavg = [];
                 for (i = 0; i < self.Categories().length; i++) {
                     let arrr = result.filter(x => x["Regular/Fullfee"] == self.Categories()[i].Cat);
                     let res = loadAverageSemesterwise(arrr);
                     bat = {
                         Category: self.Categories()[i].Cat,
                         avg: res
                     }
                     catavg.push(bat);

                 }

              //  console.log(catavg);
                 
                RegularVSFullFee(catavg);
             }
         }
         else {
             $.alert({
                 title: 'Alert!',
                 content: 'Please Select Report Type !',
             });

            
         }
    

     };

     $("#ddlReportType").change(function () {
         let e = document.getElementById("ddlReportType");
         let sValue = e.options[e.selectedIndex].value;
         if (sValue == 7 || sValue == 8) {
             $("#divSemester").show();
             if (sValue == 8) {
                 $("#divSem2").show();
             }
             else {
                 $("#divSem2").hide();
             }
         }
    
         else {
             $("#divSemester").hide();
         }

     });

     function LoadDropDownRank(result) {
         var Ranks = [...new Set(result.map(item => item.Rank))];
         Ranks = Ranks.map(Number).sort(function (a, b) { return a - b });


         let rank;
         self.Ranks([]);
        
         for (i = 0; i < Ranks.length; i++) {
             rank = {
                 Rank: Ranks[i]
             }
             self.Ranks.push(rank);
         };
     };
     

     function LoadDropDown(result) {

         var batches = [...new Set(result.map(item => item.Batch))];
         var faculties = [...new Set(result.map(item => item["Faculty(BE)"]))];
         var categories = [...new Set(result.map(item => item["Regular/Fullfee"]))];
         var genders = [...new Set(result.map(item => item.Gender))];
        // console.log(genders);

         LoadDropDownRank(result);
   
         let batch;
         for (i = 0; i < batches.length; i++) {
             batch = {
                 Batch: batches[i]
             }
             self.Batchs.push(batch);
         };

         let fac;
         for (i = 0; i < faculties.length; i++) {
             fac = {
                 Faculty: faculties[i]
             }
             self.Faculties.push(fac);
         };

         let cat;
         var cate = categories.sort().reverse();
         for (i = 0; i < cate.length; i++) {
             cat = {
                 Cat: cate[i]
             }
             self.Categories.push(cat);
         };

         let gen;
         for (i = 0; i < genders.length; i++) {
             gen = {
                 Gender: genders[i]
             }
             self.Genders.push(gen);
         };

         }

    function hideAll() {
        $("#chartContainer").hide();
        $("#chartContainer1").hide();
        $("#chartContainer2").hide();
        $("#chartContainer3").hide();
        $("#exportChart1").hide();
        $("#exportChart2").hide();
        $("#exportChart3").hide();
        $("#chartContainer4").hide();
        $("#chartContainer5").hide();
        $("#chartContainer6").hide();
        $("#exportChart4").hide();
        $("#exportChart5").hide();
        $("#exportChart6").hide();
        $("#divSem2").hide();
        
     }

     self.Reset = function () {
         self.SelectedBatch(null);
         self.SelectedCat(null);
         self.SelectedFaculty(null);
         self.SelectedSem(null);
         self.SelectedRank(null);
         self.SelectedReportType(null);
         self.SelectedSem(null);
         self.SelectedSem2(null);
         self.SelectedGender(null);
         hideAll();
         LoadDropDownRank(graphresult);
     }


    function loadGenderCount(result) {
        var malefemale = result.reduce((acc, o) => (acc[o.Gender] = (acc[o.Gender] || 0) + 1, acc), {});
        LoadChart(malefemale);

    }

    

    function loadDistrictCount(result) {
        var district = result.reduce((acc, o) => (acc[o.District] = (acc[o.District] || 0) + 1, acc), {});
        var districts = Object.entries(district).sort();
        var arr2 = [];
        for (i = 0; i < districts.length; i++) {
            var arr = [];
            arr = { y: districts[i][1], label: districts[i][0] };
            arr2.push(arr);
        }
        LoadsChart(arr2);
    }

    function loadEntranceVSAggregrate(result) {
        let entranceAggpercentarray = [];
        let results = Object.entries(result);
        for (i = 0; i < results.length; i++) {
            percent = {
                x: parseFloat(result[i]["Entrance %"]),
                y: parseFloat(result[i]["Aggregate % (BE)"])

            }
            entranceAggpercentarray.push(percent);

        }
        EntranceVsAGGPercentageChart(entranceAggpercentarray);

    };


    function loadCollegeVSAggregrate(result) {
        let collegeAggpercentarray = [];
        let results = Object.entries(result);
        for (i = 0; i < results.length; i++) {
            percent = {
                x: parseFloat(result[i]["College+2 %"]),
                y: parseFloat(result[i]["Aggregate % (BE)"])

            }
            collegeAggpercentarray.push(percent);

        }
        //console.log(collegeAggpercentarray);
        CollegeVsAggpercentageChart(collegeAggpercentarray);

     };

     function CollegeVsEntrance(result) {
         let collegeEntpercentarray = [];
         let results = Object.entries(result);
         for (i = 0; i < results.length; i++) {
             percent = {
                 x: parseFloat(result[i]["College+2 %"]),
                 y: parseFloat(result[i]["Entrance %"])

             }
             collegeEntpercentarray.push(percent);

         }
         //console.log(collegeEntpercentarray);
         plotCollegeVsEntrance(collegeEntpercentarray);

     };

     function SemVsSem(result) {
         //console.log(result);
         let semVsSemArray = [];
         let results = Object.entries(result);

         let column = "";
         if (self.SelectedSem() == "ONE") {
             column = "1st Sem % (BE)";
         }
         else if (self.SelectedSem() == "TWO") {
             column = "2nd Sem % (BE)";
         }
         else if (self.SelectedSem() == "THREE") {
             column = "3rd Sem % (BE)";
         }
         else if (self.SelectedSem() == "FOUR") {
             column = "4th Sem % (BE)";
         }
         else if (self.SelectedSem() == "FIVE") {
             column = "5th Sem % (BE)";
         }
         else if (self.SelectedSem() == "SIX") {
             column = "6th Sem % (BE)";
         }
         else if (self.SelectedSem() == "SEVEN") {
             column = "7th Sem % (BE)";
         }
         else if (self.SelectedSem() == "EIGHT") {
             column = "8th Sem % (BE)";
         }

         let column2 = "";
         if (self.SelectedSem2() == "ONE") {
             column2 = "1st Sem % (BE)";
         }
         else if (self.SelectedSem2() == "TWO") {
             column2 = "2nd Sem % (BE)";
         }
         else if (self.SelectedSem2() == "THREE") {
             column2 = "3rd Sem % (BE)";
         }
         else if (self.SelectedSem2() == "FOUR") {
             column2 = "4th Sem % (BE)";
         }
         else if (self.SelectedSem2() == "FIVE") {
             column2 = "5th Sem % (BE)";
         }
         else if (self.SelectedSem2() == "SIX") {
             column2 = "6th Sem % (BE)";
         }
         else if (self.SelectedSem2() == "SEVEN") {
             column2 = "7th Sem % (BE)";
         }
         else if (self.SelectedSem2() == "EIGHT") {
             column2 = "8th Sem % (BE)";
         }


         let percent;
         for (i = 0; i < results.length; i++) {
             percent = {
                 x: parseFloat(result[i][column]),
                 y: parseFloat(result[i][column2])

             }
             semVsSemArray.push(percent);

         }
         //console.log(semVsSemArray);
         plotSemVsSem(semVsSemArray);

     };


     function SemVsEntrance(result) {
        // console.log(result);
         let semEntpercentarray = [];
         let results = Object.entries(result);

         let column = "";
         if (self.SelectedSem() == "ONE") {
             column = "1st Sem % (BE)";
         }
         else if (self.SelectedSem() == "TWO") {
             column = "2nd Sem % (BE)";
         }
         else if (self.SelectedSem() == "THREE") {
             column = "3rd Sem % (BE)";
         }
        else if (self.SelectedSem() == "FOUR") {
             column = "4th Sem % (BE)";
         }
        else if (self.SelectedSem() == "FIVE") {
             column = "5th Sem % (BE)";
         }
         else if (self.SelectedSem() == "SIX") {
             column = "6th Sem % (BE)";
         }
        else  if (self.SelectedSem() == "SEVEN") {
             column = "7th Sem % (BE)";
         }
         else if (self.SelectedSem() == "EIGHT") {
             column = "8th Sem % (BE)";
         }
        // alert(column);

         let percent;
         for (i = 0; i < results.length; i++) {
             percent = {
                 x: parseFloat(result[i][column]),
                 y: parseFloat(result[i]["Entrance %"])

             }
             semEntpercentarray.push(percent);

         }
        // console.log(semEntpercentarray);
         plotSemVsEntrance(semEntpercentarray);

     };



     function SemVsCollege(result) {
         //console.log(result);
         let semClgpercentarray = [];
         let results = Object.entries(result);

         let column = "";
         if (self.SelectedSem() == "ONE") {
             column = "1st Sem % (BE)";
         }
         else if (self.SelectedSem() == "TWO") {
             column = "2nd Sem % (BE)";
         }
         else if (self.SelectedSem() == "THREE") {
             column = "3rd Sem % (BE)";
         }
         else if (self.SelectedSem() == "FOUR") {
             column = "4th Sem % (BE)";
         }
         else if (self.SelectedSem() == "FIVE") {
             column = "5th Sem % (BE)";
         }
         else if (self.SelectedSem() == "SIX") {
             column = "6th Sem % (BE)";
         }
         else if (self.SelectedSem() == "SEVEN") {
             column = "7th Sem % (BE)";
         }
         else if (self.SelectedSem() == "EIGHT") {
             column = "8th Sem % (BE)";
         }
         // alert(column);

         let percent;
         for (i = 0; i < results.length; i++) {
             percent = {
                 x: parseFloat(result[i][column]),
                 y: parseFloat(result[i]["College+2 %"]),
             }
             semClgpercentarray.push(percent);

         }
         //console.log(semEntpercentarray);
         plotSemVsClg(semClgpercentarray);

     };

 
     function loadAverageSemesterwise(result) {



        let sum1 = result.map(x => x["1st Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg1 = sum1 / result.length;

        let sum2 = result.map(x => x["2nd Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg2 = sum2 / result.length;

        let sum3 = result.map(x => x["3rd Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg3 = sum3 / result.length;

        let sum4 = result.map(x => x["4th Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg4 = sum4 / result.length;

        let sum5 = result.map(x => x["5th Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg5 = sum5 / result.length;

        let sum6 = result.map(x => x["6th Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg6 = sum6 / result.length;

        let sum7 = result.map(x => x["7th Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg7 = sum7 / result.length;

        let sum8 = result.map(x => x["8th Sem % (BE)"]).map(parseFloat).reduce((a, b) => (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b), 0)
        let avg8 = sum8 / result.length;


        //console.log(sumone);
        //console.log(result.map(x => x["1st Sem % (BE)"]));
        //console.log(bouncer(result.map(x => x["3rd Sem % (BE)"]).map(parseFloat)));
        //console.log(avg1, avg2, avg3);
       // console.log(result.map(x => x["8th Sem % (BE)"]).map(parseFloat));
        
        return [avg1, avg2, avg3, avg4, avg5, avg6, avg7, avg8];
        //LoadSemisterwisePercentChart(avg1, avg2, avg3, avg4, avg5, avg6, avg7, avg8);

       
    }

   function loadAverageSemesterwiseAmongAppeared(result) {


        let app1 = bouncer(result.map(x => x["1st Sem % (BE)"]).map(parseFloat));
        let noOfApp1 = app1.length;
        let sum1 = app1.reduce((a, b) => a + b, 0);
        let avg1 = sum1 / noOfApp1;

 
        let app2 = bouncer(result.map(x => x["2nd Sem % (BE)"]).map(parseFloat));
        let noOfApp2 = app2.length;
        let sum2 = app2.reduce((a, b) => a + b, 0);
        let avg2 = sum2 / noOfApp2;


        let app3 = bouncer(result.map(x => x["3rd Sem % (BE)"]).map(parseFloat));
        let noOfApp3 = app3.length;
        let sum3 = app3.reduce((a, b) => a + b, 0);
        let avg3 = sum3 / noOfApp3;

        let app4 = bouncer(result.map(x => x["4th Sem % (BE)"]).map(parseFloat));
        let noOfApp4 = app4.length;
        let sum4 = app4.reduce((a, b) => a + b, 0);
        let avg4 = sum4 / noOfApp4;


        let app5 = bouncer(result.map(x => x["5th Sem % (BE)"]).map(parseFloat));
        let noOfApp5 = app5.length;
        let sum5 = app5.reduce((a, b) => a + b, 0);
        let avg5 = sum5 / noOfApp5;


        let app6 = bouncer(result.map(x => x["6th Sem % (BE)"]).map(parseFloat));
        let noOfApp6 = app6.length;
        let sum6 = app6.reduce((a, b) => a + b, 0);
        let avg6 = sum6 / noOfApp6;


        let app7 = bouncer(result.map(x => x["7th Sem % (BE)"]).map(parseFloat));
        let noOfApp7= app7.length;
        let sum7 = app7.reduce((a, b) => a + b, 0);
        let avg7 = sum7 / noOfApp7;



        let app8 = bouncer(result.map(x => x["8th Sem % (BE)"]).map(parseFloat));
        let noOfApp8 = app8.length;
        let sum8 = app8.reduce((a, b) => a + b, 0);
        let avg8 = sum8 / noOfApp8;

       //console.log(noOfApp1, noOfApp2, noOfApp3, noOfApp4, noOfApp5, noOfApp6, noOfApp7, noOfApp8);
       LoadSemisterwisePercentAppChart(avg1, avg2, avg3, avg4, avg5, avg6, avg7, avg8);

       let totalstudent = result.length;
       let d1 = totalstudent - noOfApp1;
       let d2 = totalstudent - noOfApp2;
       let d3 = totalstudent - noOfApp3; 
       let d4 = totalstudent - noOfApp4;
       let d5 = totalstudent - noOfApp5;
       let d6 = totalstudent - noOfApp6;
       let d7 = totalstudent - noOfApp7;
       let d8 = totalstudent - noOfApp8;
       LoadDropOuts(d1, d2, d3, d4, d5, d6, d7, d8);


}


    function bouncer(arr) {
        return arr.filter(Boolean);
    }



 
    function LoadSemisterwisePercentChart(avg1, avg2, avg3, avg4,avg5, avg6, avg7, avg8) {

         chart1 = new CanvasJS.Chart("chartContainer1", {
            animationEnabled: true,
            theme: "dark2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "SemesterWise Percentage"
            },
            axisY: {
                title: "Percentage"
            },
            data: [{
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "SemesterWise Percentage",
                dataPoints: [

                    { y: avg1, label: "First" },
                    { y: avg2, label: "Second" },
                    { y: avg3, label: "Third" },
                    { y: avg4, label: "Fourth" },
                    { y: avg5, label: "Fifth" },
                    { y: avg6, label: "Sixth" },
                    { y: avg7, label: "Seventh" },
                    { y: avg8, label: "Eighth" },
              

                ]
            }]
        });
        chart1.render();

    }


    function LoadSemisterwisePercentAppChart(avg1, avg2, avg3, avg4, avg5, avg6, avg7, avg8) {

         chart2 = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "SemesterWise Percentage Among Appeared"
            },
            axisY: {
                title: "Percentage"
            },
            data: [{
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "SemesterWise Percentage Among Appeared",
                dataPoints: [

                    { y: avg1, label: "First" },
                    { y: avg2, label: "Second" },
                    { y: avg3, label: "Third" },
                    { y: avg4, label: "Fourth" },
                    { y: avg5, label: "Fifth" },
                    { y: avg6, label: "Sixth" },
                    { y: avg7, label: "Seventh" },
                    { y: avg8, label: "Eighth" },

                ]
            }]
        });
        chart2.render();

    }


    function LoadDropOuts(d1,d2, d3, d4, d5, d6, d7, d8) {

         chart3 = new CanvasJS.Chart("chartContainer3", {
            animationEnabled: true,
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Student Absent in Exam"
            },
            axisY: {
                title: "Count"
            },
            data: [{
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Semester",
                dataPoints: [

                    { y: d1, label: "First" },
                    { y: d2, label: "Second" },
                    { y: d3, label: "Third" },
                    { y: d4, label: "Fourth" },
                    { y: d5, label: "Fifth" },
                    { y: d6, label: "Sixth" },
                    { y: d7, label: "Seventh" },
                    { y: d8, label: "Eighth" },

                ]
            }]
        });
        chart3.render();

    }
    function LoadChart(malefemale) {

         chart1 = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "dark1", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "GenderWise Count"
            },
            axisY: {
                title: "Count"
            },
            data: [{
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "GenderWise Count",
                dataPoints: [

                    { y: malefemale.Male, label: "Male" },
                    { y: malefemale.Female, label: "Female" },

                ]
            }]
        });
        chart1.render();

    }


    function LoadsChart(array) {

         chart1 = new CanvasJS.Chart("chartContainer1", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "District"
            },
            axisY: {
                title: "Count"
            },
            data: [{
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "District",
                dataPoints: array
            }]
        });
        chart1.render();

    }


    function EntranceVsAGGPercentageChart(array) {
         chart4 = new CanvasJS.Chart("chartContainer4", {
            animationEnabled: true,
            zoomEnabled: true,
            title: {
                text: "Entrance VS Aggregrate Percentage"
            },
            axisX: {
                title: "Entrance Percentage",
                minimum: 00,
                maximum: 100
            },
            axisY: {
                title: "Aggregrate Percentage",
                valueFormatString: "",
                minimum: 00,
                maximum: 100
            },
            data: [{
                type: "scatter",
                toolTipContent: "",
                dataPoints:  array
            }]
        });
        chart4.render();
    }



    function CollegeVsAggpercentageChart(array) {
        chart5 = new CanvasJS.Chart("chartContainer5", {
            animationEnabled: true,
            zoomEnabled: true,
            title: {
                text: "College VS Aggregrate Percentage"
            },
            axisX: {
                title: "College Percentage",
                minimum: 00,
                maximum: 100
            },
            axisY: {
                title: "Aggregrate Percentage",
                valueFormatString: "",
                minimum: 00,
                maximum: 100
            },
            data: [{
                type: "scatter",
                toolTipContent: "",
                dataPoints: array
            }]
        });
        chart5.render();
    }

     function plotCollegeVsEntrance(array) {
          chart6 = new CanvasJS.Chart("chartContainer6", {
             animationEnabled: true,
             zoomEnabled: true,
             title: {
                 text: "College VS Entrance Percentage"
             },
             axisX: {
                 title: "College Percentage",
                 minimum: 00,
                 maximum: 100
             },
             axisY: {
                 title: "Entrance Percentage",
                 valueFormatString: "",
                 minimum: 00,
                 maximum: 100
             },
             data: [{
                 type: "scatter",
                 toolTipContent: "",
                 dataPoints: array
             }]
         });
         chart6.render();
     }


     
     function plotSemVsEntrance(array) {
          chart4 = new CanvasJS.Chart("chartContainer4", {
             animationEnabled: true,
             zoomEnabled: true,
             title: {
                 text: "Semester VS Entrance Percentage"
             },
             axisX: {
                 title: "Semester Percentage",
                 minimum: 00,
                 maximum: 100
             },
             axisY: {
                 title: "Entrance Percentage",
                 valueFormatString: "",
                 minimum: 00,
                 maximum: 100
             },
             data: [{
                 type: "scatter",
                 toolTipContent: "",
                 dataPoints: array
             }]
         });
         chart4.render();
     }


     function plotSemVsSem(array) {
          chart4 = new CanvasJS.Chart("chartContainer4", {
             animationEnabled: true,
             zoomEnabled: true,
             title: {
                 text: "Semester VS Semester Percentage"
             },
             axisX: {
                 title: "Semester Percentage",
                 minimum: 00,
                 maximum: 100
             },
             axisY: {
                 title: "Semester Percentage",
                 valueFormatString: "",
                 minimum: 00,
                 maximum: 100
             },
             data: [{
                 type: "scatter",
                 toolTipContent: "",
                 dataPoints: array
             }]
         });
         chart4.render();
     }

     function plotSemVsClg(array) {
          chart5 = new CanvasJS.Chart("chartContainer5", {
             animationEnabled: true,
             zoomEnabled: true,
             title: {
                 text: "Semester VS College Percentage"
             },
             axisX: {
                 title: "Semester Percentage",
                 minimum: 00,
                 maximum: 100
             },
             axisY: {
                 title: "College Percentage",
                 valueFormatString: "",
                 minimum: 00,
                 maximum: 100
             },
             data: [{
                 type: "scatter",
                 toolTipContent: "",
                 dataPoints: array
             }]
         });
         chart5.render();
     }


     function PlotLineChart(array) {     
       /*  var newarray = [];
         for (i = 0; i < array.length; i++) {
             console.log(array[i]);
             
             var hh = {
                 type: "line",
                 showInLegend: true,
                 name: array[i].Batch,
                 markerType: "square",
                 //xValueFormatString: "",
                 color: "#F08080",
                 dataPoints : [         
                     { x: "First", y: array[i].avg[0] },
                     { x: "Second", y: array[i].avg[1] },     
                     { x: "Third", y: array[i].avg[2] },   
                     { x: "Fourth", y: array[i].avg[3] },   
                     { x: "Fifth", y: array[i].avg[4] },   
                     { x: "Sixth", y: array[i].avg[5] },   
                     { x: "Seventh", y: array[i].avg[6] },   
                     { x: "Eight", y: array[i].avg[7] }   
                   ]
             }
             newarray.push(hh);

         }
         console.log(newarray);
        
     */

          chart1 = new CanvasJS.Chart("chartContainer1", {
             animationEnabled: true,
             title: {
                 text: "2070 vs 2073"
             },
             axisY: {
                 title: "2070 Percentage",
                 titleFontColor: "#4F81BC",
                 lineColor: "#4F81BC",
                 labelFontColor: "#4F81BC",
                 tickColor: "#4F81BC"
             },
             axisY2: {
                 title: "2073 Percentage ",
                 titleFontColor: "#C0504E",
                 lineColor: "#C0504E",
                 labelFontColor: "#C0504E",
                 tickColor: "#C0504E"
             },
             toolTip: {
                 shared: true
             },
             legend: {
                 cursor: "pointer",
                 itemclick: toggleDataSeries
             },
             data: [{
                 type: "column",
                 name: "2070",
                 legendText: "2070",
                 showInLegend: true,
                 dataPoints: [
                     { label: "First", y: array[0].avg[0] },
                     { label: "Second", y: array[0].avg[1] },
                     { label: "Third", y: array[0].avg[2] },
                     { label: "Fourth", y: array[0].avg[3] },
                     { label: "Fifth", y: array[0].avg[4] },
                     { label: "Sixth", y: array[0].avg[5] },
                     { label: "Seventh", y: array[0].avg[6] },
                     { label: "Eight", y: array[0].avg[7] }   
                    
                 ]
             },
             {
                 type: "column",
                 name: "2073",
                 legendText: "2073",
                 axisYType: "secondary",
                 showInLegend: true,
                 dataPoints: [
                         { label: "First", y: array[1].avg[0] },
                         { label: "Second", y: array[1].avg[1] },
                         { label: "Third", y: array[1].avg[2] },
                         { label: "Fourth", y: array[1].avg[3] },
                         { label: "Fifth", y: array[1].avg[4] },
                         { label: "Sixth", y: array[1].avg[5] },
                         { label: "Seventh", y: array[1].avg[6] },
                         { label: "Eight", y: array[1].avg[7] }   
                 ]
             }]
         });
         chart1.render();

         function toggleDataSeries(e) {
             if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                 e.dataSeries.visible = false;
             }
             else {
                 e.dataSeries.visible = true;
             }
             chart.render();
         }

     }


     function ElecVSComp(array) {
         chart1 = new CanvasJS.Chart("chartContainer1", {
             animationEnabled: true,
             title: {
                 text: "Elex vs Comp"
             },
             axisY: {
                 title: "BEX",
                 titleFontColor: "#4F81BC",
                 lineColor: "#4F81BC",
                 labelFontColor: "#4F81BC",
                 tickColor: "#4F81BC"
             },
             axisY2: {
                 title: "BCT ",
                 titleFontColor: "#C0504E",
                 lineColor: "#C0504E",
                 labelFontColor: "#C0504E",
                 tickColor: "#C0504E"
             },
             toolTip: {
                 shared: true
             },
             legend: {
                 cursor: "pointer",
                 itemclick: toggleDataSeries
             },
             data: [{
                 type: "column",
                 name: "ELEX",
                 legendText: "ELEX",
                 showInLegend: true,
                 dataPoints: [
                     { label: "First", y: array[0].avg[0] },
                     { label: "Second", y: array[0].avg[1] },
                     { label: "Third", y: array[0].avg[2] },
                     { label: "Fourth", y: array[0].avg[3] },
                     { label: "Fifth", y: array[0].avg[4] },
                     { label: "Sixth", y: array[0].avg[5] },
                     { label: "Seventh", y: array[0].avg[6] },
                     { label: "Eight", y: array[0].avg[7] }

                 ]
             },
             {
                 type: "column",
                 name: "COMP",
                 legendText: "COMP",
                 axisYType: "secondary",
                 showInLegend: true,
                 dataPoints: [
                     { label: "First", y: array[1].avg[0] },
                     { label: "Second", y: array[1].avg[1] },
                     { label: "Third", y: array[1].avg[2] },
                     { label: "Fourth", y: array[1].avg[3] },
                     { label: "Fifth", y: array[1].avg[4] },
                     { label: "Sixth", y: array[1].avg[5] },
                     { label: "Seventh", y: array[1].avg[6] },
                     { label: "Eight", y: array[1].avg[7] }
                 ]
             }]
         });
         chart1.render();
     }

      function MaleVsFemale(array) {
           chart1 = new CanvasJS.Chart("chartContainer1", {
               animationEnabled: true,
               title: {
                   text: "Male vs Female"
               },
               axisY: {
                   title: "Male",
                   titleFontColor: "#4F81BC",
                   lineColor: "#4F81BC",
                   labelFontColor: "#4F81BC",
                   tickColor: "#4F81BC"
               },
               axisY2: {
                   title: "Female ",
                   titleFontColor: "#C0504E",
                   lineColor: "#C0504E",
                   labelFontColor: "#C0504E",
                   tickColor: "#C0504E"
               },
               toolTip: {
                   shared: true
               },
               legend: {
                   cursor: "pointer",
                   itemclick: toggleDataSeries
               },
               data: [{
                   type: "column",
                   name: "Male",
                   legendText: "Male",
                   showInLegend: true,
                   dataPoints: [
                       { label: "First", y: array[0].avg[0] },
                       { label: "Second", y: array[0].avg[1] },
                       { label: "Third", y: array[0].avg[2] },
                       { label: "Fourth", y: array[0].avg[3] },
                       { label: "Fifth", y: array[0].avg[4] },
                       { label: "Sixth", y: array[0].avg[5] },
                       { label: "Seventh", y: array[0].avg[6] },
                       { label: "Eight", y: array[0].avg[7] }

                   ]
               },
               {
                   type: "column",
                   name: "Female",
                   legendText: "Female",
                   axisYType: "secondary",
                   showInLegend: true,
                   dataPoints: [
                       { label: "First", y: array[1].avg[0] },
                       { label: "Second", y: array[1].avg[1] },
                       { label: "Third", y: array[1].avg[2] },
                       { label: "Fourth", y: array[1].avg[3] },
                       { label: "Fifth", y: array[1].avg[4] },
                       { label: "Sixth", y: array[1].avg[5] },
                       { label: "Seventh", y: array[1].avg[6] },
                       { label: "Eight", y: array[1].avg[7] }
                   ]
               }]
           });
           chart1.render();
       }



     function RegularVSFullFee(array) {
         chart1 = new CanvasJS.Chart("chartContainer1", {
             animationEnabled: true,
             title: {
                 text: "Regular VS FullFee"
             },
             axisY: {
                 title: "Regular",
                 titleFontColor: "#4F81BC",
                 lineColor: "#4F81BC",
                 labelFontColor: "#4F81BC",
                 tickColor: "#4F81BC"
             },
             axisY2: {
                 title: "FullFee ",
                 titleFontColor: "#C0504E",
                 lineColor: "#C0504E",
                 labelFontColor: "#C0504E",
                 tickColor: "#C0504E"
             },
             toolTip: {
                 shared: true
             },
             legend: {
                 cursor: "pointer",
                 itemclick: toggleDataSeries
             },
             data: [{
                 type: "column",
                 name: "Regular",
                 legendText: "Regular",
                 showInLegend: true,
                 dataPoints: [
                     { label: "First", y: array[0].avg[0] },
                     { label: "Second", y: array[0].avg[1] },
                     { label: "Third", y: array[0].avg[2] },
                     { label: "Fourth", y: array[0].avg[3] },
                     { label: "Fifth", y: array[0].avg[4] },
                     { label: "Sixth", y: array[0].avg[5] },
                     { label: "Seventh", y: array[0].avg[6] },
                     { label: "Eight", y: array[0].avg[7] }

                 ]
             },
             {
                 type: "column",
                 name: "FullFee",
                 legendText: "FullFee",
                 axisYType: "secondary",
                 showInLegend: true,
                 dataPoints: [
                     { label: "First", y: array[1].avg[0] },
                     { label: "Second", y: array[1].avg[1] },
                     { label: "Third", y: array[1].avg[2] },
                     { label: "Fourth", y: array[1].avg[3] },
                     { label: "Fifth", y: array[1].avg[4] },
                     { label: "Sixth", y: array[1].avg[5] },
                     { label: "Seventh", y: array[1].avg[6] },
                     { label: "Eight", y: array[1].avg[7] }
                 ]
             }]
         });
         chart1.render();
     }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

     



     document.getElementById("exportChart1").addEventListener("click", function () {
         chart1.exportChart({ format: "jpg" });
     });


     document.getElementById("exportChart2").addEventListener("click", function () {
         chart2.exportChart({ format: "jpg" });
     });


     document.getElementById("exportChart3").addEventListener("click", function () {
         chart3.exportChart({ format: "jpg" });
     });

     document.getElementById("exportChart4").addEventListener("click", function () {
         chart4.exportChart({ format: "jpg" });
     });


     document.getElementById("exportChart5").addEventListener("click", function () {
         chart5.exportChart({ format: "jpg" });
     });


     document.getElementById("exportChart6").addEventListener("click", function () {
         chart6.exportChart({ format: "jpg" });
     });
 
};



$(document).ready(function () {
    ko.applyBindings(new GraphViewModel());
});