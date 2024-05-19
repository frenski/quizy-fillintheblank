// ***
//  Memory game plugin for jQuery
//  Author: Yane Frenski
//  https://github.com/frenski/quizy-fillintheblank
//
//  (c) 2012-2013 http://yane.fr/
//  MIT licensed
// ***


// IE hack for indexOf
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
   for(var i=0; i<this.length; i++){
    if(this[i]==obj){
     return i;
    }
   }
   return -1;
  }
}

(function($) {
  $.fn.quizyFillBlank = function(options) {

    // VARIABLES **************************************************************
    // ************************************************************************

    // gets the parameters
    var opts = $.extend({}, $.fn.quizyFillBlank.defaults, options);

    // keeps the text items given in the parameters
    var textItems = opts.textItems;

    // keeps the order of the items given in the parameters
    var anItemsOrderArr = opts.anItemsCorrect;

    // keeps all the answers themself given in the parameters
    var anItemsArr = opts.anItems;

    // keeps the number of the answers and the number of the drop places
    var anNum = anItemsArr.length;
    var phNum = anItemsOrderArr.length;

    // keeps the number of successful drop attemts
    var anCount = 0;

    //counts the amount of seconds to complete it
    var numSeconds = 0;

    //keeps how many correct answers the user has
    var correctDrops = 0;

    // a timer variable
    var gameTimer;

    // a timer variable
    var timerStarted = false;

    // DOM elements for the text and the draggable answers
    var el1 = $('#'+opts.elementAnId);
    var el2 = $('#'+opts.elementTextId);

    // keeps initial xy positions of the draggable items
    var anItemsInitPos = {};

    // keeps track of the placeholders dragged positions
    var anDroppedTrack = {};


    // FUNCTIONS **************************************************************
    // ************************************************************************

    // A helper function to check whether we are dealing with a touch devices
    function isTouchDevice() {
      return (('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (navigator.msMaxTouchPoints > 0));
    }

    // Function that enables click event on objects that have already been
    // dragged with the idea to enable them to be put back
    function handleDraggedClick( event, elem ) {
      // If draggable is disabled - to prevent firing active/unassigned ones
      if(elem.draggable('option', 'disabled')) {
        // setting main variables
        var idAttr = elem.attr('id');
        var dragId = idAttr.substring(opts.answerId.length,idAttr.length);
        var dropId = anDroppedTrack[parseInt(dragId)];
        var dropElem = $('#' + opts.phId+dropId);
        // engables the drag again
        elem.draggable('enable');
        elem.draggable( 'option', 'revert', true );
        elem.removeClass('quizy-fitb-dropelement-disabled');
        // moves back the item to initial position
        elem.offset(anItemsInitPos[idAttr]);
        dropElem.droppable( 'enable' );
        // decreases the answered items count
        anCount--;
        // removes drop id assignment
        anDroppedTrack[parseInt(dragId)] = null;
        // puts back the wrong answer icon and reduces the correct drops counter
        if(anItemsOrderArr[dropId]==dragId){
          $('#'+opts.checkId+dragId).addClass('quizy-fitb-res-no')
                                    .removeClass('quizy-fitb-res-yes');
          $('#'+opts.checkId+dragId).html('x'); //adds tick in place of 'x'
          correctDrops --; //decreases the correct answers counter
        }
      }
    }

    function handleUndraggedTrigger (dragObj, dropObj) {
      dropObj.droppable( 'disable' );
      dragObj.addClass('quizy-fitb-dropelement-disabled');
      dragObj.draggable( 'disable' );
      dragObj.position( { of: dropObj, my: 'left top', at: 'left top' } );
      dragObj.draggable( 'option', 'revert', false );

      // gets the corresponding id's of the droppabe and draggable elemts
      var idAttr = dropObj.attr('id');
      var dropId = idAttr.substring(opts.phId.length,idAttr.length);
      idAttr = dragObj.attr('id');
      var dragId = idAttr.substring(opts.answerId.length,idAttr.length);

      // compares the ids and adds the necessary class if they match, meaning
      // that the answer the user has dropped is correct
      if(anItemsOrderArr[dropId]==dragId){
        $('#'+opts.checkId+dragId).removeClass('quizy-fitb-res-no')
                                  .addClass('quizy-fitb-res-yes');
        $('#'+opts.checkId+dragId).html('&#10003'); //adds tick in place of 'x'
        correctDrops ++; //increases the correct answers counter
      }

      // Keeping track of dropped positions of the dragged items
      anDroppedTrack[parseInt(dragId)] = parseInt(dropId);

      // starts the counter if it's the first time the user drops an element
      if (!timerStarted) {
        gameTimer = setInterval(incTime, 1000);
        timerStarted = true;
      }

      // increases the total answer counter
      anCount++;

      // if the the number of dropped items is the same as the placeholders
      if(anCount == phNum){
        // clears the timer
        clearInterval(gameTimer);
        // shows the correct answers
        $('.'+opts.checkId).fadeIn();
        $('.'+opts.numberId).fadeIn();
        // if set in the opts, calls the callback function
        if(opts.onFinishCall!=''){
          opts.onFinishCall({ correct_answers: correctDrops,
                                     all_answers:phNum,
                                     time: numSeconds } );
        }
        $('.draggable-element').off('click');
        if (isTouchDevice()){
          var dragEls = document.getElementsByClassName('draggable-element');
          for(var i=0; i<dragEls.length; i++) {
            unBindEvent(dragEls[i], "touchstart", handleTouchStart, true);
          }
        }
      }
    }

    // Function for handling the dragging
    function handleDragStop( event, ui ) {
      var offsetXPos = parseInt( ui.offset.left );
      var offsetYPos = parseInt( ui.offset.top );
    }

    // Function for handling the dragging
    function handleDragStart( event, ui ) {
      var offsetXPos = parseInt( ui.offset.left );
      var offsetYPos = parseInt( ui.offset.top );
      anItemsInitPos[$(this).attr('id')] = {top:offsetYPos, left:offsetXPos};
    }

    // Function for handling the dropping
    function handleDropOn( event, ui ) {
      // disables the draggable element and adds the necessary classes
      var thisDropObj = $(this);
      var thisDragObj = ui.draggable;
      handleUndraggedTrigger (thisDragObj, thisDropObj);
    }

    function handleTouchStart( e ) {
      // gets main variables
      var elem = e.target;
      var idAttr = elem.getAttribute('id');
      var dragId = idAttr.substring(opts.answerId.length, idAttr.length);
      var dropId = anDroppedTrack[parseInt(dragId)];
      var thisDragObj = $('#'+idAttr);
      // if no drop has happened, the dropId is null
      if (dropId === null) {
        for (var i=0; i<phNum; i++) {
          if (Object.values(anDroppedTrack).indexOf(i) == -1) {
             dropId = i;
             break;
          }
        }
        var thisDropObj = $('#' + opts.phId+dropId);
        var offsetXPos = parseInt( thisDragObj.offset().left );
        var offsetYPos = parseInt( thisDragObj.offset().top );
        anItemsInitPos[idAttr] = {top:offsetYPos, left:offsetXPos};
        thisDragObj.offset({top:thisDropObj.offset.top, left:thisDropObj.offset.left});
        handleUndraggedTrigger (thisDragObj, thisDropObj);
      // else, dragged click handler is called
      } else {
        handleDraggedClick ( event, thisDragObj);
      }


    }

    // Time increase function
    var incTime = function(){
      numSeconds ++;
    }

     // Funcitons for handling the touch events in the touch devices********

    // Merging the attachEvent func of IE to the standard one
    function bindEvent(el, eventName, eventHandler, boolr) {
      if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, boolr);
      } else if (el.attachEvent) {
        el.attachEvent('on'+eventName, eventHandler);
      }
    }


    // Merging the attachEvent func of IE to the standard one
    function unBindEvent(el, eventName, eventHandler, boolr) {
      if (el.removeEventListener) {
        el.removeEventListener(eventName, eventHandler, boolr);
      } else if (el.detachEvent) {
        el.detachEvent('on'+eventName, eventHandler);
      }
    }

    // Makes elements with class 'draggalbe-element' draggable on touch devices
    function touchHandler(event)
    {
     var touches = event.changedTouches,
        first = touches[0],
        type = "";

         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;
        case "touchend":   type="mouseup"; break;
        default: return;
    }
      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0, null);

      first.target.dispatchEvent(simulatedEvent);

      if( $(event.target).hasClass('draggable-element')
          || $(event.target).parent().hasClass('draggable-element') ) {
        event.preventDefault();
      }
    }

    // A Function to define the touch event
    function initTouch()
    {
      bindEvent(document, "touchstart", touchHandler, true);
      bindEvent(document, "touchmove", touchHandler, true);
      bindEvent(document, "touchend", touchHandler, true);
      bindEvent(document, "touchcancel", touchHandler, true);
    }


    // MAIN CODE **************************************************************
    // ************************************************************************


    // Adding the text and the placeholders (the drop-target places)
    for(var i=0; i<phNum; i++){
      el2.append('<span>'+textItems[i]+'</span> <span id="'+
                  opts.phId +i +
                  '" style="width:'+ opts.blockSize + 'px; height:' +
                  opts.blockSizeHeight +
                  'px; " class="droppable-element quizy-fitb-droptarget"></span>');

      // If it's the last drop item, adds one text more at the end
      if(i == phNum-1){
        var nId = i+1;
        el2.append('<span>'+textItems[nId]+'</span>');
      }
    }

    // Adding the draggable elements - the possible answers
    var elToAppend = el1;

    for(var i=0; i<anNum; i++){
      // appends the div with the draggable answers
      elToAppend.append('<div id="'
                        +opts.answerId+i+
                        '" class="quizy-fitb-answer draggable-element '+
                        'quizy-fitb-dropelement" style="width:'+opts.blockSize+
                        'px; height: '+opts.blockSizeHeight+'px;">'+
                        anItemsArr[i]+'</div>');

      // appends divs showing if the answers are correct (They will be hidden)
      $('#'+opts.answerId+i).append('<div id="'+opts.checkId+i+
                                    '" class="quizy-fitb-res quizy-fitb-res-no '+
                                    opts.checkId+'">x</div>');
      $('#'+opts.answerId+i).append('<div id="'+
                                      opts.numberId+i+
                                      '" class="quizy-fitb-res quizy-fitb-res-num '+
                                      opts.checkId+'">'+
                                      (parseInt(anItemsOrderArr.indexOf(i))+1)+
                                      '</div>');
      anDroppedTrack[i] = null;
    }

    // Adding drag functionality to the draggable elements (from jQuery UI)
    $('.draggable-element').draggable( {
      cursor: 'move',
      containment: 'document',
      stop: handleDragStop,
      start: handleDragStart,
      revert: true
    } );


    $('.draggable-element').on('click', function(e){
      handleDraggedClick(e, $(this));
    });

    // Adding drop functionality to the draggable elements (from jQuery UI)
    $('.droppable-element').droppable( {
      drop: handleDropOn,
      hoverClass: 'quizy-fitb-droptarget-hover'
    } );

    // if set, allows dragging in touch devices
    if (isTouchDevice()) {
      if(opts.allowTouchDrag) {
        initTouch();
      } else {
        // disbles the default click events
        $('.draggable-element').off('click');
        var dragEls = document.getElementsByClassName('draggable-element');
        for(var i=0; i<dragEls.length; i++) {
          bindEvent(dragEls[i], "touchstart", handleTouchStart, true);
        }
      }
    }


    // Positions the results/correct answers to the draggable elements
    // and makes it right aligned to them
    for(var i=0; i<anNum; i++){
      $('#'+opts.checkId+i).position( { of: $('#'+opts.answerId+i),
                                        my: 'right center ',
                                        at: 'right center',
                                        offset:'0 5px' } );
      $('#'+opts.numberId+i).position( { of: $('#'+opts.answerId+i),
                                         my: 'right center',
                                         at: 'right center',
                                         offset:'10px -10px' } );
      // Hides the answers at the begining of the exercise
      $('#'+opts.checkId+i).hide();
      $('#'+opts.numberId+i).hide();
    }

    if(opts.onLoadCall!=''){
      opts.onLoadCall();
    }

  }


  /**** plugin parameters *****************************************************
  *****************************************************************************

    * elementAnId:      String to change the id of the div id with the answers.
                        default: fillblank-ph
    * elementTextId:    String to change the id of the div id with the answers
                        default: fillblank-text
    * textItems:        Array which comprises the texts in-between the blanks.
                        It should include all the text fragments except the
                        missing words (they are like separators of the texts)
                        Should look like this:
                        ['text starts here','continues here', 'finishes here']
    * anItems:          Array with the strings, listing the possible answers
                        Should look like this:
                        ['answer 1', 'answer 2', 'answer 3']
    * anItemsCorrect:   Array with the correct items and their position in
                        the anItems array. Should look like this:
                        [3,0,1] - means:
                        on place 1 goes element 3
                        on place 2 goes element 0
                        on place 3 goes element 1
                        (2 is missing as it's a wrong answer and fits nowhere)
    * answerId:         String to change the class of the div with
                        the answers to prevent any potential conflicts
                        in your code
    * phId:             String to change the class of the spans with the
                        blank spaces to prevent any potential conflicts
                        in your code.
                        default: 'd-nest'
    * checkId:          String to change the class of the divs with the icons
                        showing if the answers was correct or not (in order to
                        prevent any potential conflicts in your code).
                        default:'d-check'
    * numberId:         String to change the class of the divs with the icons
                        showing if the correct position of the item (in order
                        to prevent any potential conflicts in your code).
                        default: 'd-number'
    * blockSize:        The size (width) of the answer divs and also the blank
                        spaces. Change it if you have shorter or longer words
                        than normal
                        default: 100
    * blockSizeHeight:  The height of the answer divs and also the blank spaces.
                        Change it if you want to have somethin other than text.
                        default: 10 (+padding in css)
    * allowTouchDrag:   A boolean parameter (true or false), which enables
                        dragging on touch devices.
                        default: true
    * onFinishCall:     The call back function after the quiz is completed
                        It sends three arguments: correct_answers,
                                                  all_answers,
                                                  time
    * onLoadCall:       The call back function after the game elements ahve been
                        loaded


  ****************************************************************************/

  $.fn.quizyFillBlank.defaults = {
    elementAnId: 'fillblank-ph',
    textItems:['Text part1','text part 2', 'text part 3'],
    elementTextId: 'fillblank-text',
    anItems: ['an1','an2','an3'],
    anItemsCorrect:[2,0],
    answerId:'d-answer',
    phId: 'd-nest',
    checkId:'d-check',
    numberId:'d-number',
    blockSize:100,
    blockSizeHeight:20,
    onFinishCall:'',
    onLoadCall:'',
    allowTouchDrag:false
  }

})(jQuery);
