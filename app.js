$("document").ready(function () {
  const serverURL = "http://localhost:5000";
  let splitter = document.getElementsByClassName("splitter")[0];
  let splitter1 = document.getElementsByClassName("splitter1")[0];
  splitter.addEventListener("mousemove", (e) => {
    if (e.clientX > window.innerWidth - 200) {
      $(".panel-left").css("width", `${window.innerWidth - 300}px`);
      $(".panel-mid").css("width", `50px`);
      // $(".panel-right").css("width", `50px`);
    }
  });
  splitter1.addEventListener("mousemove", (e) => {
    if (e.clientX > window.innerWidth - 200) {
      $(".panel-mid").css("width", `${window.innerWidth - 750}px`);
    }
  });
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

  //socket
  const socket = io(serverURL);

  //get data from socket
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  if (id) {
    axios
      .get(`${serverURL}/data/${id}`)
      .then(function (response) {
        const data = response.data;
        console.log(data);
        ace.edit("html-editor").getSession().setValue(data.html);
        ace.edit("css-editor").getSession().setValue(data.css);
        ace.edit("js-editor").getSession().setValue(data.js);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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

  //collaborate click
  $("#btnCollaborate").click(function (event) {
    event.preventDefault();

    const uid = Date.now();
    const data = {
      html: ace.edit("html-editor").getSession().getValue(),
      css: ace.edit("css-editor").getSession().getValue(),
      js: ace.edit("js-editor").getSession().getValue(),
    };

    console.log(uid, data, `${serverURL}/data/${uid}`);
    axios
      .post(`${serverURL}/data/${uid}`, data)
      .then(function (response) {
        console.log(response);
        url.searchParams.set("id", uid);
        window.history.replaceState(null, null, url);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
