$("a").click(function(){
  localStorage.setItem("book", $(this).attr("name"));
});
