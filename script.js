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
        $scope.currentWeek = 0;
        $scope.dates = [
            "3/22",
            "3/23",
            "3/29",
            "3/30",
            "4/5",
            "4/6",
            "4/12",
            "4/13",
            "4/19",
            "4/20",
            "4/26",
            "4/27",
            "5/3",
            "5/4",
            "5/10",
            "5/11",
            "5/17",
            "5/18",
            "5/24",
            "5/25"
        ];
        $scope.gameNumbers = [];
        var teams = [];

        var addGame = function(team1, score1, team2, score2, gameNumber){
            var newGame = {
                team1:team1,
                score1:score1,
                team2:team2,
                score2:score2,
                game:gameNumber,
                hasPlayed:false
            }
            if (score1 > score2){
                newGame["win1"] = true;
                newGame["win2"] = false;
            }else{
                newGame["win1"] = false;
                newGame["win2"] = true;
            }

            newGame["date"] = $scope.dates[gameNumber - 1];
            if (score1 + score2 !== 0) {
                $scope.currentWeek = gameNumber;
                newGame["hasPlayed"] = true;
            }

            $scope.games.push(newGame);
            $scope.origGames.push(newGame);
            $scope.maxWeek = gameNumber;

            $scope.$apply();
        }

        $(document).ready(function(){
            loadGames();

            $("body").on('click', '#prevWeek', function(){
                if ($scope.currentWeek === 1){
                    $scope.currentWeek = $scope.maxWeek;
                } else {
                    $scope.currentWeek--;
                }
                $scope.$apply();

                resetGames();
                filterByWeek();
            });

            $("body").on('click', '#nextWeek', function(){
                if ($scope.currentWeek === $scope.maxWeek){
                    $scope.currentWeek = 1
                } else {
                    $scope.currentWeek++;
                }
                $scope.$apply();

                resetGames();
                filterByWeek();
            });
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
            addGame(pg, 48, dr, 41, 1);
            addGame(tn, 21, bl, 45, 1);
            addGame(bs, 35, ei, 54, 1);
            addGame(cl, 31, rb, 44, 1);

            //Week 1, Day 2
            addGame(dm, 34, mb, 69, 2);
            addGame(bs, 30, cl, 26, 2);
            addGame(bl, 25, dr, 36, 2);
            addGame(ei, 51, pg, 53, 2);

            //Week 2, Day 1
            addGame(mb, 85, tn, 14, 3);
            addGame(dm, 45, rb, 96, 3);
            addGame(bl, 46, pg, 65, 3);
            addGame(ei, 58, cl, 39, 3);

            //Week 2, Day 2
            addGame(tn, 43, rb, 103, 4);
            addGame(pg, 26, cl, 29, 4);
            addGame(bs, 60, dm, 38, 4);
            addGame(dr, 45, mb, 67, 4);

            //Week 3, Day 1
            addGame(mb, 58, bl, 57, 5);
            addGame(dr, 51, rb, 58, 5);
            addGame(bs, 2, tn, 0, 5);//forfeit
            addGame(ei, 60, dm, 41, 5);

            //Week 3, Day 2
            addGame(mb, 36, pg, 42, 6);
            addGame(dm, 31, cl, 25, 6);
            addGame(ei, 2, tn, 0, 6);//forfeit
            addGame(bl, 40, rb, 76, 6);

            //Week 4, Day 1
            addGame(rb, 59, pg, 47, 7);
            addGame(dm, 2, tn, 0, 7); //forfeit
            addGame(dr, 50, ei, 70, 7);

            //Week 4, Day 2
            addGame(bs, 33, dr, 58, 8);
            addGame(dm, 44, pg, 43, 8);
            addGame(cl, 2, tn, 0, 8); //forfeit

            //Week 5, Day 1
            addGame(bs, 38, mb, 72, 9);
            addGame(dr, 51, cl, 46, 9);
            addGame(bl, 59, ei, 72, 9);
            addGame(pg, 2, tn, 0, 9); //forfeit

            //Week 5. Day 2
            addGame(dm, 42, dr, 48, 10);
            addGame(bl, 49, cl, 53, 10);
            addGame(ei, 52, mb, 57, 10);

            //Week 6, Day 1
            addGame(pg, 0, bs, 2, 11);
            addGame(bl, 51, dm, 39, 11);
            addGame(rb, 49, ei, 51, 11);
            addGame(dr, 2, tn, 0, 11);

            //Week 6, Day 2
            addGame(mb, 50, cl, 42, 12);
            addGame(bl, 34, dm, 29, 12);
            addGame(ei, 66, bs, 57, 12);
            addGame(dr, 2, tn, 0, 12);



            getStandings();
        }

        var getStandings = function(){
            var teams = {};
            for (var i = 0; i < $scope.origGames.length; i++){
                var currentGame = $scope.origGames[i];
                teams[currentGame.team1] = teams[currentGame.team1] || {wins:0, losses:0, name:currentGame.team1, pf:0, pa:0, wpct:0};
                teams[currentGame.team2] = teams[currentGame.team2] || {wins:0, losses:0, name:currentGame.team2, pf:0, pa:0, wpct:0};

                var hasNotPlayed = currentGame.score1 + currentGame.score2 === 0;
                if (hasNotPlayed){
                    continue;
                }
                var isForfeit = currentGame.score1 + currentGame.score2 === 2;


                if (!isForfeit)
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

                if (!isForfeit){
                    teams[currentGame.team1]["gp"]--;
                    teams[currentGame.team2]["gp"]--;
                }

                teams[currentGame.team1]["ppg"] = teams[currentGame.team1]["pf"] / teams[currentGame.team1]["gp"];
                teams[currentGame.team2]["ppg"] = teams[currentGame.team2]["pf"] / teams[currentGame.team2]["gp"];

                teams[currentGame.team1]["oppg"] = teams[currentGame.team1]["pa"] / teams[currentGame.team1]["gp"];
                teams[currentGame.team2]["oppg"] = teams[currentGame.team2]["pa"] / teams[currentGame.team2]["gp"];

                teams[currentGame.team1]["ppgd"] = teams[currentGame.team1]["ppg"] - teams[currentGame.team1]["oppg"];
                teams[currentGame.team2]["ppgd"] = teams[currentGame.team2]["ppg"] - teams[currentGame.team2]["oppg"];

            }
            for (team in teams){
                if (!(team === 'The Nerds' || team === 'Peanuts Gang'))
                $scope.standings.push(teams[team]);
            }

            filterByWeek();


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
                if ($scope.currentTeam.localeCompare("Home") === 0){
                    filterByWeek();
                }
            }
        });

        function resetGames(){
            $scope.games = $scope.origGames;
        }

        function filterByWeek(){
            $scope.games = $scope.games.filter(function(value){
                return value.game === $scope.currentWeek;
            });
            $scope.$apply();
        }



    }

    app.controller("MainCtrl", MainCtrl);

}());
