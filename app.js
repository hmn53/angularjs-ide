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

  const setPreview = () => {
    var previewDoc = window.frames[0].document;
    previewDoc.open();
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
                <script src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.1/angular.js' type='text/javascript'></script>
                <script type='text/javascript'>${script}</script>
            </body>
        </html>
    `;

    previewDoc.write(output);
    previewDoc.close();
  };

  // RUN Button
  $("#btnRun").click(function (event) {
    event.preventDefault();
    var iframe = document.getElementById("preview");
    iframe.src = "about:blank";
    setTimeout(setPreview, 200);
  });

  // Preview code on page load
  $("#btnRun").click();

  $("#btnPrettify").click(function (event) {
    event.preventDefault();

    var html = ace.edit("html-editor").getSession().getValue();
    var html2 = style_html(html);

    ace.edit("html-editor").getSession().setValue(html2);

    var css = ace.edit("css-editor").getSession().getValue();
    var css2 = css_beautify(css);

    ace.edit("css-editor").getSession().setValue(css2);

    var js = ace.edit("js-editor").getSession().getValue();
    var js2 = js_beautify(js);

    ace.edit("js-editor").getSession().setValue(js2);
  });

  $("#btnPrettify").click();
});
