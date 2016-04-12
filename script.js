(function(){

    var app = angular.module("app", []);

    var MainCtrl = function($scope){

        $scope.currentTeam = null;
        $scope.currentGames = [];
        $scope.hasCurrentTeam = false;
        $scope.games = [];
        $scope.origGames = [];
        $scope.standings = [];
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
                teams[currentGame.team1]["wpct"] = teams[currentGame.team1]["wins"] + teams[currentGame.team1]["losses"] / teams[currentGame.team1]["wins"];
                teams[currentGame.team2]["wpct"] = teams[currentGame.team2]["wins"] + teams[currentGame.team2]["losses"] / teams[currentGame.team2]["wins"];


            }
            for (team in teams){
                $scope.standings.push(teams[team]);
            }
            $scope.$apply();

            console.log(teams);
        }

        $("nav li").click(function(){
            var team =  $(this).data("balloon");
            $scope.currentTeam = team;
            if ($scope.currentTeam.localeCompare("MetLife Basketball Association") !== 0){
                $scope.hasCurrentTeam = true;
            }else{
                $scope.hasCurrentTeam = false;
            }
            $scope.$apply();
        })

        $scope.$watch("currentTeam", function(newVal, oldVal){
            if (newVal){
                $scope.games = $scope.origGames;
                $scope.games = $scope.games.filter(function(value){
                    return value.team1.localeCompare($scope.currentTeam) === 0 ||
                    value.team2.localeCompare($scope.currentTeam) === 0 ||
                    $scope.currentTeam.localeCompare("MetLife Basketball Association") === 0;
                });
            }
        });

    }

    app.controller("MainCtrl", MainCtrl);

}());
