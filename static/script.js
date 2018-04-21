var entries, key;
$(document).ready(function () {
  key = $("#key").val();
  $("#key").change(function () {
    key = $(this).val();
  });

  $("#text").val("Dear Diary,\n\n");

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
          $("#text").val("Dear Diary,\n\n");
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

  setInterval(function () {
    var timeSince = moment.duration(moment().diff(entries[0].createdAt));
    $("#timeSince").text(timeSince.humanize());
  }, 60 * 1000 * 5)
});

function populate() {
  $("#tblPrevious").empty();
  $.get({
    headers: { key },
    url: "/entry",
    success: function (res) {
      if (res.error) $("#text").text(res.message);
      if (!res.length) return;
      $("<tr><th>Title</th><th>Created At</th></tr>")
        .appendTo("#tblPrevious");
      entries = res;
      entries.forEach(en => en.createdAt = moment(en.createdAt));
      for (var entry of res) {
        $(`<tr onclick="show('${entry["_id"]}')"><td>${entry.title}</td><td>${entry.createdAt.format("dddd, MMMM Do YYYY, kk:mm:ss")}</td></tr>`)
          .appendTo("#tblPrevious");
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
