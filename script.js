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
            addGame("MetLife Ballers", 30, "Bricklayers", 40);
            addGame("Crabtree Lakers", 21, "MetLife Ballers", 32);
            addGame("The Nerds", 22, "Crabtree Lakers", 21);
            addGame("MetLife Ballers", 50, "The Nerds", 2);
            addGame("Dynamet", 54, "Bricklayers", 40);

            getStandings();
        }

        var getStandings = function(){
            var teams = {};
            for (var i = 0; i < $scope.origGames.length; i++){
                var currentGame = $scope.origGames[i];
                teams[currentGame.team1] = teams[currentGame.team1] || {wins:0, losses:0, name:currentGame.team1, pf:0, pa:0, wpct:0};
                teams[currentGame.team2] = teams[currentGame.team2] || {wins:0, losses:0, name:currentGame.team2, pf:0, pa:0, wpct:0};
                teams[currentGame.team1]["pf"] += currentGame.score1;
                teams[currentGame.team1]["pa"] += currentGame.score2;
                teams[currentGame.team2]["pf"] += currentGame.score2;
                teams[currentGame.team2]["pa"] += currentGame.score1;
                teams[currentGame.team1]["pd"] = teams[currentGame.team1]["pf"] - teams[currentGame.team1]["pa"];
                teams[currentGame.team2]["pd"] = teams[currentGame.team2]["pf"] - teams[currentGame.team2]["pa"];

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
            var team =  $(this).html().trim();
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
