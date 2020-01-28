$(document).ready(function() {

  var howManyBombs = 25;
  var flagsPlaced = 0;
  var gameOver = false;
  var bombsFound = 0;

  $('.fa-flag').hide();
  $('.fa-bomb').hide();

  let minutes = 0;
  let seconds = 0;
  let tens = 0;
  let PlaceFlags = 0;


  setInterval(function timer() {
  if (gameOver == false) {
  tens++;
  }
  if (tens > 99) {
    seconds++;
    tens = 0;
  }

  if (seconds > 59) {
    minutes++;
    seconds = 0;
  }
  $('.time').html(('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2) + ':' + ('0' + tens).slice(-2));
  }, 10);

  function Cell( row, column, opened, flagged, mined, neighborMineCount )
    {
	   return {
		     id: row + "" + column,
		     row: row,
		     column: column,
		     opened: opened,
		     flagged: flagged,
		     mined: mined,
		     neighborMineCount: neighborMineCount
	  }
  }





  var initializeCells = function()
  {
  	var row  = 0;
  	var column = 0;
  	$( ".cell" ).each( function(){
  		$(this).attr( "id", row + "" + column );
  		column++;
  		if( column >= 10)
  		{
  			column = 0;
  			row++;
  		}


  	})
  }


  function makeBombs(board) {
    let bombs = [];
    for (let i=0; i<howManyBombs; i++) {
      let tempOne = Math.floor(Math.random()*10);
      let tempTwo = Math.floor(Math.random()*10);
      let tempID = tempOne + "" + tempTwo;
      let test = bombs.includes(tempID);
      if (test == false) {
        console.log("tempID" + tempID);
        bombs.push(tempID);
        board[tempID].mined = true;
      }
      else {

        i--;
      }

      //return board;

    }

console.log("bombs " + bombs);
return board;
  }


function Board()
{
	var board = {};
	for( var row = 0; row < 10; row++ )
	{
		for( var column = 0; column < 10; column++ )
		{
			board[row + "" + column] = Cell( row, column, false, false, false, 0 );
		}
	}
	board = makeBombs(board);
  Neighbours(board);

	//board = calculateNeighborMineCounts( board, boardSize );
	return board;
}

function Neighbours(board) {

  for( var row = 0; row < 10; row++ )
	{
		for( var column = 0; column < 10; column++ )
		{
        var neighbours = 0;
		    if (row > 0 && column > 0) {
          if (board[(row - 1) + "" + (column - 1)].mined) {
            neighbours++;
          }
        }

        if (row > 0) {
          if (board[(row - 1) + "" + column].mined) {
            neighbours++;
          }
        }

        if (row > 0 && column < 9) {
          if (board[(row - 1) + "" + (column + 1)].mined) {
            neighbours++;
          }
        }

        if (column > 0) {
          if (board[row + "" + (column - 1)].mined) {
            neighbours++;
          }
        }

        if (column< 9) {
          if (board[row + "" + (column + 1)].mined) {
            neighbours++;
          }
        }

        if (row < 9 && column > 0) {
          if (board[(row + 1) + "" + (column - 1)].mined) {
            neighbours++;
          }
        }

        if (row < 9) {
          if (board[(row + 1) + "" + column].mined) {
            neighbours++;
          }
        }

        if (row < 9 && column < 9) {
          if (board[(row + 1) + "" + (column + 1)].mined) {
            neighbours++;
          }
        }

        board[row + "" + column].neighborMineCount = neighbours;
		}
	}
}

function ClearEachCell(board, value1, value2) {
  if (board[(value1) + "" + (value2)].mined == false) {
    $( '#' + $(board[(value1) + "" + (value2)]).attr("id") ).removeClass('unchecked');
    $( '#' + $(board[(value1) + "" + (value2)]).attr("id") ).removeClass('checked');
    board[(value1) + "" + (value2)].opened = true;
    if(board[(value1) + "" + (value2)].neighborMineCount > 0) {
      $( '#' + $(board[(value1) + "" + (value2)]).attr("id")).html(board[(value1) + "" + (value2)].neighborMineCount);

    }
  }
}

function ClearCells(board) {
  var $cell = $( '#' + $(this).attr("id") );
  for( var row = 0; row < 10; row++ )
	{
		for( var column = 0; column < 10; column++ )
		{
      if (board[row + "" + column].opened == true) {


        if (row > 0) {
          ClearEachCell(board, row - 1, column);
        }

        if (column > 0) {
          ClearEachCell(board, row, column - 1);
        }

        if (column< 9) {
          ClearEachCell(board, row, column + 1);
        }

        if (row < 9) {
          ClearEachCell(board, row + 1, column);
        }
      }
		}
	}
}


$Cell=$('.cell');
$Cell.addClass('unchecked');



$Cell.click(function() {
  if (PlaceFlags == 1) {
    var cell = board[$(this).attr("id")];
      if (gameOver == false) {
        if(cell.opened == false) {
          if (cell.flagged == false) {
            if(flagsPlaced != howManyBombs) {
              $(this).children(".fa-flag").show();
              cell.flagged = true;
              flagsPlaced++;
              if (cell.mined == true) {
                bombsFound++;
                if (bombsFound == howManyBombs) {
                  gameOver = true;
                  $(".mobileinfo .display").html("YOU WIN");
                }
              }   
            }
          }
        else {
          $(this).children(".fa-flag").hide();
          cell.flagged = false;
          flagsPlaced--;
          if (cell.mined == true) {
            bombsFound--;
          }
        }
      }
      $('.flags').html(flagsPlaced);
      }
  }
  else {
var cell = board[$(this).attr("id")];
var $cell = $( '#' + $(this).attr("id") );
var cells = Object.keys(board);

if (gameOver == false) {
  if (cell.opened == false) {
    if (cell.flagged == false) {
      $(this).removeClass('unchecked');
      $(this).addClass('checked');
			if( cell.mined ) {
				$($cell).children(".fa-bomb").show();
        gameOver = true;
        $(".info .display").html("GAME OVER");
			}
      else {
        cell.opened = true;
        if(cell.neighborMineCount > 0) {
          $($cell).html(cell.neighborMineCount);
        }
        ClearCells(board);
      }
    }
  }
}
  }
});

    $Cell.contextmenu(function() {
      var cell = board[$(this).attr("id")];
      if (gameOver == false) {
        if(cell.opened == false) {
          if (cell.flagged == false) {
            if(flagsPlaced != howManyBombs) {
              $(this).children(".fa-flag").show();
              cell.flagged = true;
              flagsPlaced++;
              if (cell.mined == true) {
                bombsFound++;
                if (bombsFound == howManyBombs) {
                  gameOver = true;
                  $(".info .display").html("YOU WIN");
                }
              }   
            }
          }
        else {
          $(this).children(".fa-flag").hide();
          cell.flagged = false;
          flagsPlaced--;
          if (cell.mined == true) {
            bombsFound--;
          }
        }
      }
      $('.flags').html(flagsPlaced);
      }
    });

function buttonOnOff(a, a1, b, b1, c, c1, bombs) {
  $(a).addClass('pressed');
  $(a1).addClass('shadowpressed');
  $(a).removeClass('notpressed');
  $(a1).removeClass('shadownotpressed');
  $(b).addClass('notpressed');
  $(b1).addClass('shadownotpressed');
  $(b).removeClass('pressed');
  $(b1).removeClass('shadowpressed');
  $(c).addClass('notpressed');
  $(c1).addClass('shadownotpressed');
  $(c).removeClass('pressed');
  $(c1).removeClass('shadowpressed');
  howManyBombs = bombs;
  $('.bombs').html(howManyBombs);
  var board = newGame();
}

function buttonOnOffPlaceFlags() {
  
  if(PlaceFlags == 0) {
    PlaceFlags = 1;
    $("#PlaceFlags").addClass('pressed');
    $("#PlaceFlags .buttonshadow").addClass('shadowpressed');
    $("#PlaceFlags").removeClass('notpressed');
    $("#PlaceFlags .buttonshadow").removeClass('shadownotpressed');
  }
  else {
    PlaceFlags = 0;
    $("#PlaceFlags").removeClass('pressed');
    $("#PlaceFlags .buttonshadow").removeClass('shadowpressed');
    $("#PlaceFlags").addClass('notpressed');
    $("#PlaceFlags .buttonshadow").addClass('shadownotpressed');
  }
}

$("#easy").click(function() {
  buttonOnOff("#easy", "#easy .buttonshadow", "#medium", "#medium .buttonshadow", "#hard", "#hard .buttonshadow", 20);
});

$("#medium").click(function() {
  buttonOnOff( "#medium", "#medium .buttonshadow", "#easy", "#easy .buttonshadow", "#hard", "#hard .buttonshadow", 25);
});

$("#hard").click(function() {
  buttonOnOff("#hard", "#hard .buttonshadow", "#easy", "#easy .buttonshadow", "#medium", "#medium .buttonshadow", 30);
});

$("#PlaceFlags").click(function() {
  buttonOnOffPlaceFlags();
});
var newGame = function()
{
  PlaceFlags = 0;
  $("#PlaceFlags").removeClass('pressed');
  $("#PlaceFlags").removeClass('shadowpressed');
  $("#PlaceFlags").addClass('notpressed');
  $("#PlaceFlags").addClass('shadownotpressed');
  $Cell.removeClass('checked');
  $Cell.addClass('unchecked');
  $('.flags').html('0');
  flagsPlaced = 0;
  $('.cell').html("<i class=\"fas fa-flag\"></i><i class=\"fas fa-bomb\">")
  $(".info .display").html("<div id=\"flagsplaced\"><div>Flags placed:</div><div class=\"flags\">0</div></div><div id=\"bombs\"><div>Bombs:</div><div class=\"bombs\">"+ howManyBombs + "</div></div>");
  $('.fa-flag').hide();
  $('.fa-bomb').hide();
  gameOver = false;
  bombsFound = 0;
  board = Board();
  minutes = 0;
  seconds = 0;
  tens = 0;
  initializeCells();
  return board;
}
var board = newGame();
$('#newgame').click(function() {

var board = newGame();


});
console.log($(window).width());
if ($(window).width() <= 980) {
  console.log($('#mobile').css("width"));
  var boardWidth = $('#mobile').css("width");
  $('#board').css('width', boardWidth);
  var mobileCellWidth = $('#board').css("width").slice(0, -2)/10;
  
  console.log(boardWidth);
  
  
  $('.cell').css('width', mobileCellWidth + "px");
  
}

});
