var entries, key;
$(document).ready(function () {
  key = $("#key").val();
  $("#key").change(function () {
    key = $(this).val();
  });

  $("#text").text("Dear Diary,\n\n");

  $("#formNew").submit(function (e) {
    var data = {
      title: $("#title").val(),
      text: $("#text").val()
    };
    if (!data.title || !data.text) return false;
    $.post({
      url:"/entry",
      data: JSON.stringify(data),
      headers: { key },
      contentType: "application/json",
      processData: false,
      success: function (res) {
        if (!res.error) {
          $("#title").val("");
          $("#text").text("Dear Diary,\n\n");
          populate();
        } else {
          $("<pre>").text(res.message).appendTo("#new");
        }
      },
      error: function (...err) {
        console.error(err);
      }
    });
  });

  $("#populate").click(populate);

  setTimeout(function () {
    $("#populate").click();
  }, 200);
});

function populate() {
  $("#tblInner").empty();
  $.get({
    headers: { key },
    url: "/entry",
    success: function (res) {
      if (res.error) $("#text").text(res.message);
      if (!res.length) return;
      entries = res;
      entries.forEach(en => en.createdAt = moment(en.createdAt));
      for (var entry of res) {
        $(`<tr onclick="show('${entry["_id"]}')" class='w3-hover-deep-orange'><td>${entry.title}</td><td>${moment(entry.createdAt).format("dddd, MMMM Do YYYY, kk:mm:ss")}</td></tr>`)
          .appendTo("#tblInner");
      }
      var timeSince = moment.duration(moment().diff(entries[0].createdAt));
      $("#timeSince").text(timeSince.humanize());
    },
    error: console.error
  });
}

function show(id) {
  var entry = entries.find(e => e["_id"] === id);
  $("#display").empty();
  $("<h3>").text(entry.title).appendTo("#display");
  $("<p>").text(entry.text).appendTo("#display");
}
