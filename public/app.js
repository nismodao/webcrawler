
$("#btn").on("click", function (e) {
  e.preventDefault();
  var url = $("#query").val();
  console.log(url);
  $.post('/', {"message":url});
})