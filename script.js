(function(){

    var app = angular.module("app", []);

    var MainCtrl = function($scope){

        $scope.currentTeam = null;
        $scope.currentGames = [];
        $scope.hasCurrentTeam = false;
        $scope.games = [];
        $scope.origGames = [];
        $scope.standings = [];
        $scope.currentTeamObj = null;
        var teams = [];

        var addGame = function(team1, score1, team2, score2){
            var newGame = {
                team1:team1,
                score1:score1,
                team2:team2,
                score2:score2
            }
            if (score1 > score2){
                newGame["win1"] = true;
                newGame["win2"] = false;
            }else{
                newGame["win1"] = false;
                newGame["win2"] = true;
            }
            $scope.games.push(newGame);
            $scope.origGames.push(newGame);
            $scope.$apply();
        }

        $(document).ready(function(){
            loadGames();
        });

        var loadGames = function(){
            var pg = "Peanuts Gang";
            var dr = "The Deregulators";
            var tn = "The Nerds";
            var bl = "Bricklayers";
            var bs = "BaaS";
            var ei = "EI & Trey";
            var cl = "Crabtree Lakers";
            var rb = "Red Baron";
            var mb = "MetLife Ballers";
            var dm = "DynaMet";

            //Week 1, Day 1
            addGame(pg, 48, dr, 41);
            addGame(tn, 21, bl, 45);
            addGame(bs, 35, ei, 54);
            addGame(cl, 31, rb, 44);

            //Week 1, Day 2
            addGame(dm, 34, mb, 69);
            addGame(bs, 30, cl, 26);
            addGame(bl, 25, dr, 36);
            addGame(ei, 51, pg, 53);

            //Week 2, Day 1
            addGame(mb, 85, tn, 14);
            addGame(dm, 45, rb, 96);
            addGame(bl, 46, pg, 65);
            addGame(ei, 58, cl, 39);

            //Week 2, Day 2
            addGame(tn, 43, rb, 103);
            addGame(pg, 26, cl, 29);
            addGame(bs, 60, dm, 38);
            addGame(dr, 45, mb, 67);

            //Week 3, Day 1
            addGame(mb, 58, bl, 57);
            addGame(dr, 51, rb, 58);
            addGame(bs, 2, tn, 0);//forfeit
            addGame(ei, 60, dm, 41);

            //Week 3, Day 2
            addGame(mb, 36, pg, 42);
            addGame(dm, 31, cl, 25);
            addGame(ei, 2, tn, 0);//forfeit
            addGame(bl, 40, rb, 76);

            //Week 4, Day 1
            addGame(rb, 59, pg, 47);
            addGame(dm, 2, tn, 0); //forfeit
            addGame(dr, 50, ei, 70);

            //Week 4, Day 2
            addGame(bs, 33, dr, 58);
            addGame(dm, 44, pg, 43);
            addGame(cl, 2, tn, 0); //forfeit

            //Week 5, Day 1
            addGame(bs, 38, mb, 72);
            addGame(dr, 51, cl, 46);
            addGame(bl, 59, ei, 72);
            addGame(pg, 2, tn, 0); //forfeit

            //Week 5. Day 2
            addGame(dm, 42, dr, 48);
            addGame(bl, 49, cl, 53);
            addGame(ei, 52, mb, 57);



            getStandings();
        }

        var getStandings = function(){
            var teams = {};
            for (var i = 0; i < $scope.origGames.length; i++){
                var currentGame = $scope.origGames[i];
                teams[currentGame.team1] = teams[currentGame.team1] || {wins:0, losses:0, name:currentGame.team1, pf:0, pa:0, wpct:0};
                teams[currentGame.team2] = teams[currentGame.team2] || {wins:0, losses:0, name:currentGame.team2, pf:0, pa:0, wpct:0};

                if (currentGame.score1 + currentGame.score2 !== 2)
                {
                    teams[currentGame.team1]["pf"] += currentGame.score1;
                    teams[currentGame.team1]["pa"] += currentGame.score2;
                    teams[currentGame.team2]["pf"] += currentGame.score2;
                    teams[currentGame.team2]["pa"] += currentGame.score1;
                    teams[currentGame.team1]["pd"] = teams[currentGame.team1]["pf"] - teams[currentGame.team1]["pa"];
                    teams[currentGame.team2]["pd"] = teams[currentGame.team2]["pf"] - teams[currentGame.team2]["pa"];
                }

                if (currentGame.win1){
                    teams[currentGame.team1]["wins"] = teams[currentGame.team1]["wins"] + 1;
                    teams[currentGame.team2]["losses"] = teams[currentGame.team2]["losses"] + 1;
                }else{
                    teams[currentGame.team2]["wins"] = teams[currentGame.team2]["wins"] +1;
                    teams[currentGame.team1]["losses"] = teams[currentGame.team1]["losses"] + 1;
                }
                teams[currentGame.team1]["wpct"] = teams[currentGame.team1]["wins"] / (teams[currentGame.team1]["wins"] + teams[currentGame.team1]["losses"]);
                teams[currentGame.team2]["wpct"] = teams[currentGame.team2]["wins"] / (teams[currentGame.team2]["wins"] + teams[currentGame.team2]["losses"]);
                teams[currentGame.team1]["gp"] = teams[currentGame.team1]["wins"] + teams[currentGame.team1]["losses"];
                teams[currentGame.team2]["gp"] = teams[currentGame.team2]["wins"] + teams[currentGame.team2]["losses"];
            }
            for (team in teams){
                $scope.standings.push(teams[team]);
            }
            $scope.$apply();
        }

        $("nav li").click(function(){
            var team =  $(this).html().trim().replace("&amp;", "&");
            $scope.currentTeam = team;
            var array = $scope.standings.filter(function(value){
                return value.name.localeCompare(team) === 0;
            });
            $scope.currentTeamObj = array[0];
            if ($scope.currentTeam.localeCompare("Home") !== 0){
                $scope.hasCurrentTeam = true;
            }else{
                $("nav li").removeClass("grey");
                $scope.hasCurrentTeam = false;
            }
            $("nav li").removeClass("selected");
            $(this).addClass("selected");
            $scope.$apply();
        });

        $("nav li:nth-child(n+2)").mouseover(function(){
            $("nav li:nth-child(n+2)").addClass("grey");
            $(this).removeClass("grey");
        });

        $("nav li:nth-child(n+2)").mouseleave(function(){
            if (!$scope.hasCurrentTeam)
                $("nav li:nth-child(n+2)").removeClass("grey");
            else {
                $("nav li:nth-child(n+2)").addClass("grey");
                $(".selected").removeClass("grey");

            }
        });


        $scope.$watch("currentTeam", function(newVal, oldVal){
            if (newVal){
                $scope.games = $scope.origGames;
                $scope.games = $scope.games.filter(function(value){
                    return value.team1.localeCompare($scope.currentTeam) === 0 ||
                    value.team2.localeCompare($scope.currentTeam) === 0 ||
                    $scope.currentTeam.localeCompare("Home") === 0;
                });
            }
        });

    }

    app.controller("MainCtrl", MainCtrl);

}());
