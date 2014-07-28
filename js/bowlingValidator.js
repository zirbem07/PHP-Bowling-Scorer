/**
 * Created by maxwellzirbel on 7/28/14.
 */
$(document).ready(function(){
    //on roll button click
    $('#rollBtn').on('click', function(){
        //get score from DOM
        var score = $('#rollScore').val();
        //validate score
        if(score){
            var allScores = getScores(score);
            if(allScores) {
                submitScore(allScores);
            }
        } else {
            //invalid score. show warning
            alert("You did not enter a valid score");
        }
    });


    /*
        inserts score in table and array
        param: score - current roll score
        return: array containing all scores
     */
    function getScores(score) {
        var allScores = [];
        var previous = 0;

        //iterate through all rolls
        $('td').each(function(){
            var val = $(this);
            //if val has no text, this is the current frame and roll
            if(!val.text()) {
                val.text(score);
                //on the first roll of the game previous will not be set
                if(previous) {
                    if (validateScore(val, previous)) {
                        //insert a dash after a strike if it is not the 10th frame
                        if (score == 10 && !val.hasClass('frame10')) {
                            val.next().text("-");
                        }
                        //add the value to the array
                        allScores.push(val.text());
                    }
                } else {
                    if (score == 10 && !val.hasClass('frame10')) {
                        val.next().text("-");
                    }
                    allScores.push(val.text());
                }
                return false;
            //previous roll. add score to array and update previous
            } else {
                allScores.push(val.text());
                previous = val;
            }
        });

        return allScores;
    }

    /*
        This function makes sure that the score
        for a single frame does not exceed 10
        param: curr - current roll td object
               prev - previous roll td object
        return: true if roll sore is valid else false
     */
    function validateScore(curr, prev){
        //check if the rolls are from the same frame
        if(curr.attr("class") === prev.attr("class")){
            //get the int value of scores from current and previous rolls
            var currVal = parseInt(curr.text(), 10);
            var prevVal = parseInt(prev.text(), 10);
            if(curr.attr("class") == "frame10"){
                return finalFrame(curr, currVal, prevVal);
            } else {
                //check if the rolls sum to 10 or less
                if(currVal + prevVal > 10){
                    alert("Invalid roll, roll must be less than " +  (11 - prevVal));
                    curr.text(null);
                    return false;
                }
            }
        }
        return true;
    }

    /*
        This function gets called in frame 10
        to check if the bowler gets a third roll
        param: curr - current td DOM object
               currVal - int value of current object text
               prevVal - int value of previous object text
        return: true - roll counts
                false - roll does not count
     */
    function finalFrame(curr, currVal, prevVal){
        var tenthFirstRoll = parseInt($('#1').text(), 10);
        if(curr.attr("id") == "3") {
            if (currVal + prevVal == 10 || currVal + prevVal == 20 || tenthFirstRoll == 10) {
                return true;
            } else {
                curr.text(null);
                return false;
            }
        } else {
            return true;
        }
    }

    /*
        AJAX to send array of scores to php
        returns the current score
        and any turkeys.
        param: scores - array containing all roll scores
     */
    function submitScore(scores){
        $.ajax({
            type: "POST",
            url: 'php/calculateScore.php',
            data: {scores: scores},
            success: function(data){
                //update current score with response from php
                $('.currentScore').text(data.sum);
                displayTurkeys(data.turkeys);
            },
            error: function(xhr, status, error) {
                console.log(error);
            },
            dataType: "json"
        });
    }

    /*
        This function displays all turkeys
        params: turkeys - an array containing all frames turkeys were bowled in
     */
    function displayTurkeys(turkeys) {
        $('ul').empty();
        turkeys.forEach(function(turkey) {
            $('ul').append("<li>Frame " + turkey + "</li>");
        });
    }

});