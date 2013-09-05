Quizy Fill in the blank
========

#### jQuery fill in the blank quiz plugin ####

QuizY Fill in the blank plugin is a jQuery plugin, which allows the creation of fill in the blank quiz in the browser. It is very simple to use and provides various of settings in order to enhance its usability

[Demo and Documentation](http://fillintheblank.quizyplugin.com/)


### Usage ###

Download the [plugin](https://github.com/frenski/quizy-fillintheblank) and include all the necessary files before the closing body tag.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" /></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js" /></script>
<script src="js/jquery.quizyfillblank.js" /></script>
...
</body>
...
</body>
```
Add the css file to the head: 

```html
<head>
  ...
  <link rel="stylesheet" type="text/css" href="css/quizyfillblank.css" />
  ...
</head>
```

Call the plugin after all the script files and before the closing body tag like this:

```html
<script>
    $('#tutorial-fillblank').quizyFillBlank({
      textItems:['Start of your text', '. text continues ', '. text continues here ', ', ... and here', 'and here it ends.'],
          anItems:['Answer1', 'Answer2', 'Answer3', 'Answer4', 'Answer5', 'Answer6', 'Answer7' ], 
          anItemsCorrect:[2,1,4,6],
          blockSize:150
        });
</script>

</body>
```
The mandatory parameters you need to add are the textItems, anItems and anItemsCorrect. textItems is an array, which comprises the texts in-between the blank spaces. For example, if your text is 'The current president of the US is Barack Obama, who is a democrat. He was preceded by George W. Bush, who was a republican' and the blank spaces are for 'Barack Obama' and 'George W. Bush', this means you need to add into the textItem array as first item the text 'The current president of the US is', as a second item ', who is a democrat. He was preceded by ', the third ', who was a republican.', and so on... In the anItems parameter you set an array with the strings, listing the possible answers. In our case this will be some president names. In the anItemsCorrect we put the correct items and their position in the anItems array, ordered by the blank spaces in the texts. For i.e.: if we have anItems array: ['George W. Bush', 'Ronald Reagan', 'Barack Obama'] then for the first blank space the answer will be the third item in the array (with key 2, because the counting starts form 0) and for the second blank space the answer will be the item with key 0 in the anItem array. This means, the array for the value of anItemsCorrect parameter will be: [2,0]; Later on I will explain what are the rest of properties used for.

Create the html for it. It is pretty simple and shows where text and the answer should appear. You can put the two divs for the text and for the answers in different places depending on the layout of the page you are using.

```html
<div id="tutorial-fillblank">
  <div id="fillblank-text"></div>
  <div id="fillblank-ph"></div>
</div>
```

### Properties ###
* elementAnId: String to change the id of the div with the answers. The default is fillblank-ph.
* elementTextId: String to change the id of the div with the answers. The default is fillblank-text.
* answerId: String to change the class of the div with the answers to prevent any potential conflicts in your code. The default is d-answer.
* phId: String to change the class of the spans with the blank spaces to prevent any potential conflicts in your code. The default is d-nest.
* checkId: String to change the class of the divs with the icons showing if the answers was correct or not (in order to prevent any potential conflicts in your code). The default is d-check.
* numberId: String to change the class of the divs with the icons showing if the correct position of the item (in order to prevent any potential conflicts in your code). The default is d-number.
* blockSize: The size of the answer divs and also the blank spaces. Change it if you have shorter or longer words than normal. Default is 100.
* onFinishCall: A callback function. Will return object with three parameters: correct_answers, all_answers and time. You can add it when calling the plugin like this: onFinishCall: function(param){alert(param.correct_answers)}
* allowTouchDrag: A boolean parameter (true or false), which enables dragging on touch devices. By default is true

### License ###

This plugin is [MIT](http://en.wikipedia.org/wiki/MIT_License) licensed.


</body>