<?php

//validate post value was received
if(isset($_POST['scores'])){
    $scores = $_POST['scores'];

    //remove all "-" from array
    $scores = array_diff($scores, array("-"));
    $response = calculateScore($scores);
    $sum = $response[0];
    $turkeys = $response[1];

    //return current score
    echo json_encode(array("sum"=>$sum, "turkeys"=>$turkeys));

}

/*
    This function calculates the current score of the game
    params: scores - array containing the scores of each roll
    return: current score of the game
*/
function calculateScore($scores, $turkeyArr){

    $frameScore = array();
    $turkey = 0;
    $turkeyArr = array();
    $response = array();

    for($i = 1; $i <= 10; $i++) {
        //get the first roll from the scores array
        $frameScore[$i] = array_shift($scores);

        //check if roll is strike
        if ($frameScore[$i] == 10){

            //check for turkey
            $turkey++;
            if($turkey == 2){
                $turkeyArr[] = $i;
                $turkey = 0;
            }

            //roll is strike, 10 + next two rolls
            $frameScore[$i] = (10 + $scores[0] + $scores[1]);


        } else {
            $turkey = 0;

            //get the second roll for current frame
            $frameScore[$i] += array_shift($scores);

            //check for spare
            if ($frameScore[$i] == 10)
                //spare, 10 + next roll
                $frameScore[$i] = (10 + $scores[0]);
        }
    } //end for


    $sum = array_sum($frameScore);
    $response[] = $sum;
    $response[] = $turkeyArr;
    // return our total score and turkeys
    return $response;
}

?>