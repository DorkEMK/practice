$(document).ready(function(){
  var id = 0;
  var tokensPlace = document.getElementById("tokens");
  var sentencePlace = document.getElementById("translation");

  // вспомогательная функция сортировки (Fisher–Yates_shuffle)
  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
  };

  // создаём лист кнопок с токенами
  function createElemTokensList(tokens){
    var items = [];
      tokens.forEach(function(token, index){
      var tokenItem = document.createElement("button");
      tokenItem.id = "t"+index;
      tokenItem.innerHTML = " "+token+" ";
      tokenItem.type="button";
      tokenItem.className = "btn btn-outline-primary";
      items.push(tokenItem);
    });
    return items;
  };

  // создаём лист span-ов со словами
  function createElemWordsList(tokens) {
    var words =[];
      tokens.forEach(function(word, index){
      var wordItem = document.createElement("span");
      wordItem.id = "w"+index;
      wordItem.style = "visibility: hidden;";
      wordItem.innerHTML = " "+word+" ";
      words.push(wordItem);
    });
    return words;
  }

  // заполняем страницу
  function fillPage(sentence, tokens) {
    // Выводим референсное предложение
    tokensPlace.innerHTML =''
    wordsPlace.innerHTML =''
    sentencePlace.innerHTML = sentence.ru;
    shuffle(createElemTokensList(tokens)).forEach(function(token){
      tokensPlace.appendChild(token);
    });
    createElemWordsList(tokens).forEach(function(word){
      wordsPlace.appendChild(word);
    });
    // console.log(sentence)
  };

  // функция для показа одного предложения при правильном наборе
  // на входе счетчик, тыц тыц возвращает счётчик
  function showSentence(sentence, tokens){
    var counter = 0;
    $("button:not(#next)").click(function(){ // TODO change selector
      if ($(this).html() == $('#w'+counter).html()){

        $(this).css("visibility", "hidden");
        $('#w'+counter).css("visibility", "visible");
        counter++;
      } else {
          $(this).removeClass("btn-outline-primary");
          $(this).addClass("btn-danger");
          setTimeout(function(){
            $(".btn-danger").attr('class', "btn btn-outline-primary");
          }, 500);
      }
      if (counter == tokens.length){
        $("#original").html(sentence.en)
        $("#next").css("visibility", "visible");
      };
    });
  };

  function segmentText(tokens){
    var minSegmLength = 3;
    var num = Math.floor(tokens.length/minSegmLength);
    var resid = sentence.en_tokens.length % 3;

    var segmLengths =[];
    for (var i = 1; i <= num; i++){
      segmLengths.push(minSegmLength);
    }
    for (resid; resid > 0; resid-- ) {
      var rand = Math.floor(Math.random() * num);
      segmLengths[rand]++;
    }
    // создаём новый массив "псевдотокенов"
    var newEnTokens = [];
    while (tokens.length) {
      newEnTokens.push(tokens.splice(0, segmLengths[0]).join(' '));
      segmLengths.splice(0, 1);
    }
    return newEnTokens;
  }

  // Создаём место правильных токенов и перемешанных
  var wordsPlace = document.getElementById("original");
  var tokensPlace = document.getElementById("tokens");
  var sentencePlace = document.getElementById("translation");
  var tokens;

  var source = "/books/"+localStorage.getItem("book")+".json"

  // получаем текст в виде json
  $.get(source, function(data){
    playSentence(data);
  })

  // когда получили, обрабатываем его вот так вот по предложению
  function playSentence(text) {

    sentence = text[id];
    tokens = sentence.en_tokens;
    if (tokens.length >= 10) {
      tokens = segmentText(tokens)
    }
    console.log(tokens)
    // вот тут допереписывать на токенс
    fillPage(sentence, tokens, async=false); // эту переписать
    showSentence(sentence,tokens, async=false); // эту переписать

    $("#next").click(function(){
      if (id != text.length-1){
        $("#next").css("visibility", "hidden");
        id++;
        sentence = text[id];
        tokens = sentence.en_tokens;
        if (tokens.length >= 10) {
          tokens = segmentText(tokens)
        }
        segmentText(sentence)
        fillPage(sentence, tokens, async=false);
        showSentence(sentence, tokens, async=false);
        }
    })
  }
})

