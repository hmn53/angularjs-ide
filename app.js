$("document").ready(function () {
  // resizable editors config
  $(".panel-left").resizable({
    handleSelector: ".splitter",
    resizeHeight: false,
  });
  $(".panel-mid").resizable({
    handleSelector: ".splitter1",
    resizeHeight: false,
  });
  $(".panel-top").resizable({
    handleSelector: ".splitter-horizontal",
    resizeWidth: false,
  });

  // To resize ace editor
  document.addEventListener("mousemove", () => {
    htmlEditor.resize();
    cssEditor.resize();
    jsEditor.resize();
  });

  // RUN Button
  $("#btnRun").click(function (event) {
    event.preventDefault();

    var previewDoc = window.frames[0].document;

    var css = ace.edit("css-editor").getSession().getValue();
    var script = ace.edit("js-editor").getSession().getValue();
    var html = ace.edit("html-editor").getSession().getValue();

    const output = `
        <!DOCTYPE html>
        <html>
            <head>
                <style type='text/css'>${css}</style>
            </head>
            <body>
                ${html}
                <script type='text/javascript'>${script}</script>
            </body>
        </html>
    `;

    previewDoc.write(output);
    previewDoc.close();
  });

  // Preview code on page load
  $("#btnRun").click();
});
