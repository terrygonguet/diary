var entries, key;
$(document).ready(function () {
  let editor = new nicEditor({ fullPanel:false, maxHeight:200 }).addInstance('text');
  let txtInstance = editor.nicInstances[0];
  $(txtInstance.elm).css('min-height', 'initial');
  $(txtInstance.editorContain).css('border', 'none');

  key = $("#key").val();
  $("#key").change(function () {
    key = $(this).val();
  });
  if (key.length) {
    $("#form p").hide();
    $("#form img").show()
    .click(function (e) {
      $("#form p").show();
      $("#form img").hide();
    });
  }

  txtInstance.setContent("Dear Diary,\n\n");

  $("#formNew").submit(function (e) {
    var data = {
      title: $("#title").val(),
      text: txtInstance.getContent()
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
          txtInstance.setContent("Dear Diary,\n\n");
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
  $("#display")
  .empty()
  .html(`<h3>${entry.title}</h3>${entry.text}`);
}
