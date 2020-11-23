firstSetup("../data/data0.json", "dataJson0", "0", "add_left_html_area");
firstSetup("../data/data1.json", "dataJson1", "1", "add_right_html_area");

function firstSetup(jsonLink, jsonName, layoutName, areaName) {
  $(function () {
    setJson(jsonLink, jsonName);
    json2Interface(jsonLink, "#" + areaName, layoutName);
    $("body").append('<div id="' + areaName + '" class="split_area"></div>');
    $("#" + areaName).append('<div id="' + jsonName + '"></div>');
    $("#" + jsonName).css("display", "inline");
    $("#" + jsonName).append(
      '<textarea id="' + jsonName + 'Area" rows="24" cols="80"></textarea>'
    );
  });
}

function splitter(bool) {
  //console.log(elementId);
  //console.log(jsonName);
  if (bool === true) {
    $("#add_right_html_area").children().show();
  } else if (bool === false) {
    $("#add_right_html_area").children().hide();
  }
}

function splitterBtn(jsonName, layoutName) {
  $(document).on(
    "click",
    'button[id="splitBtn' + layoutName + '"]',
    function () {
      /*    console.log(elementId);
      console.log(layoutName); */
      //console.log(jsonName);
      const jsonLayoutName = jsonName + "0";
      if (getJsonData(jsonLayoutName, "splitter", "life") === 0) {
        setJsonData(jsonLayoutName, "splitter", "life", 1);
        splitter(true);
      } else if (getJsonData(jsonLayoutName, "splitter", "life") === 1) {
        setJsonData(jsonLayoutName, "splitter", "life", 0);
        splitter(false);
      }
    }
  );
  //});
}

function setJson(jsonLink, jsonName) {
  $(function () {
    $.when($.getJSON(jsonLink)).done((dataJson) => {
      json2Form(dataJson, jsonName + "Area");
    });
  });
}

function getJsonData(idLayoutNamePart, keyName, valueKeyName) {
  const json = JSON.parse(
    document.getElementById(idLayoutNamePart + "Area").value || "null"
  );
  let varValue = json[0][keyName][0][valueKeyName]; //value
  return varValue;
}

function setJsonData(idLayoutNamePart, keyName, valueKeyName, setValue) {
  const json = JSON.parse(
    document.getElementById(idLayoutNamePart + "Area").value || "null"
  );
  json[0][keyName][0][valueKeyName] = setValue;
  document.getElementById(idLayoutNamePart + "Area").value = JSON.stringify(
    json,
    null,
    "\t"
  ); //JSONデータへ更新データを詰め直し
}

function json2Interface(rankingJsonLink, elementId, layoutName) {
  $(function () {
    $.when($.getJSON(rankingJsonLink), $.getJSON(rankingJsonLink)).done(
      (rankJson) => {
        interface(rankJson[0], elementId, layoutName);
      }
    );
  });
}

function interface(rankingJson, elementId, layoutName) {
  createHtml(elementId, layoutName); //表示するHTMLの作成
  form2Export(layoutName); //Form2Formボタンの設定
  focusAllSelect(layoutName); //全選択の設定
  textarea2ClipBoard(layoutName); //コピーの設定
  //counter("rankingTable", "dataJson", layoutName); //カウンターの設定
  counterBtn("rankingTable", "dataJson", layoutName); //カウンターの設定
  fireFuncJson("rankingTable", "dataJson", layoutName); //json no functionを設定
  change2SaveJson(rankingJson, layoutName);
  json2Table(rankingJson, "rankingTable", layoutName);
  splitterBtn("dataJson", layoutName);
  modeChangeBtn("dataJson", layoutName);
}

/*
JSONをelementIdの要素へ詰める
*/
function json2Form(json, elementId) {
  var h = JSON.stringify(json, null, "\t");
  $("#" + elementId).val(h);
}

/*
01103 Blogを使ってエクスポートをやってみる
01103 Form2Exportができた
01104 出力するJSONをテスト用からSETのtextareaのvalueから引っ張ってくる・・・更新されない
01106 更新されるようになった .valを使えばいいみたい
01107 名前をつけてスプレッドレイアウトに対応したい。。。できた
*/
function form2Export(layoutName) {
  $(document).on(
    "click",
    'button[id="Form2Export' + layoutName + '"]',
    function () {
      //SET DATA Form2Export
      const str = document.getElementById("dataJson" + layoutName + "Area")
        .value;
      const blob = new Blob([str], {
        type: "text/plain",
      });
      const reader = new FileReader();
      reader.onload = function () {
        console.log(reader.result);
      };
      reader.readAsText(blob);
      const a = document.getElementById("download" + layoutName);
      a.href = window.URL.createObjectURL(blob);
    }
  );
}

/*
01106 クリックしたら全選択　ready,focus,select全部取り消し線が入るけど無視
01107 名前をつけてスプリットレイアウトに対応できた
*/
function focusAllSelect(layoutName) {
  $(document).ready(function () {
    $("#dataJson" + layoutName + "Area").focus(function () {
      $(this).select();
    });
  });
}

/*
01106 ボタンを押したらクリップボードへコピーする
01007 名前をつけてスプリットレイアウトに対応できた
*/
function textarea2ClipBoard(layoutName) {
  $("#copy_alert" + layoutName).css("display", "none");
  $(function () {
    $("#Textarea2ClipBoard" + layoutName).on("click", function () {
      $("#" + "dataJson" + layoutName + "Area").select(); //　テキストエリアを選択
      document.execCommand("copy"); // コピー
      $("#copy_alert" + layoutName)
        .show()
        .delay(2000)
        .fadeOut(400); // アラート文の表示
    });
  });
}

/*
ROLE：JSONデータをテーブル形式でHTMLに表示する
SPEC:# '#' + targetTable+ layoutName へ表示する。jsonをすべてテーブル表示する。
01106 更新できるようにすでに表示していたら一旦消すようにする
01111 contenteditableテーブル内を編集可能に...したけど、すぐにJSONの内容に戻される
*/
function json2Table(targetJson, targetTable, layoutName) {
  $(function () {
    if ($("#" + targetTable + layoutName).length) {
      //すでに追加していたら削除する
      $("#" + targetTable + layoutName).empty();
    }
    let keys = Object.keys(targetJson[0]);
    $("#" + targetTable + layoutName).append(
      '<table id="table_ele' + targetTable + layoutName + '"></table>'
    ); //tableを追加する
    $("#table_ele" + targetTable + layoutName).append(
      '<tr id="tr_ele' + targetTable + layoutName + '"></tr>'
    ); /* 追加したtableにthを追加する */
    $("#tr_ele" + targetTable + layoutName).append(
      "<th>" +
        '<div id="test" contenteditable="true">' +
        "value" +
        "</div>" +
        "</th>"
    );
    $("#tr_ele" + targetTable + layoutName).append(
      "<th>" + '<div contenteditable="true">' + "name" + "</div>" + "</th>"
    );
    $("#tr_ele" + targetTable + layoutName).append(
      "<th>" + '<div contenteditable="true">' + "link" + "</div>" + "</th>"
    );
    for (let i = 0; i < Object.keys(targetJson[0]).length; i++) {
      //targetJsonのデータをまるごと表示する
      $("#table_ele" + targetTable + layoutName).append(
        '<tr id="tr_ele' +
          i +
          targetTable +
          layoutName +
          '"' +
          'class="tr_ele_class' +
          targetTable +
          layoutName +
          '"' +
          "></tr>"
      );
      $("#tr_ele" + i + targetTable + layoutName).append(
        "<td>" +
          '<div id="tr_ele' +
          i +
          targetTable +
          layoutName +
          "_div" +
          '" contenteditable="true">' +
          targetJson[0][keys[i]][0].value +
          "</div>" +
          "</td>"
      );
      $("#tr_ele" + i + targetTable + layoutName).append(
        '<td id="td_ele_name' +
          i +
          targetTable +
          layoutName +
          '">' +
          '<div  contenteditable="true">' +
          keys[i] +
          "</div>" +
          "</td>"
      );
      $("#tr_ele" + i + targetTable + layoutName).append(
        "<td>" +
          '<div contenteditable="true">' +
          targetJson[0][keys[i]][0].link +
          "</div>" +
          "</td>"
      );
      //console.log(Object.keys(targetJson[0]).length);
    }
  });
}

/*
 */
function counter(targetTable, jsonName, layoutName, index, bool) {
  //  $(function () {
  if (bool === true) {
  } else if (bool === false) {
    return;
  }
  //JSONデータを表示した部分をクリックすると
  const json = JSON.parse(
    document.getElementById(jsonName + layoutName + "Area").value || "null"
  ); //#rankingからjsonのstringをGET
  //let index = $(".tr_ele_class" + targetTable + layoutName).index(this); //クリックした要素の順番を割り出す
  //let index = 0;
  console.log(index);
  let varValue = json[0][Object.keys(json[0])[index]][0].value; //valueを取り出す
  console.log(varValue);
  json[0][Object.keys(json[0])[index]][0].value = varValue + 1;
  document.getElementById(
    jsonName + layoutName + "Area"
  ).value = JSON.stringify(json, null, "\t"); //JSONデータへ更新カウンターデータを詰め直し
  json2Table(json, targetTable, layoutName); // JSONを再表示

  //});
}

function counterBtn(targetTable, jsonName, layoutName) {
  $(document).on(
    "click",
    ".tr_ele_class" + targetTable + layoutName,
    function () {
      const valueKeyName = "life";
      const keyName = "counter";
      let bool = true;
      const jsonLayoutName = jsonName + "0";

      if (getJsonData(jsonLayoutName, keyName, valueKeyName) === 0) {
        bool = false;
      } else if (getJsonData(jsonLayoutName, keyName, valueKeyName) === 1) {
      }

      let index = $(".tr_ele_class" + targetTable + layoutName).index(this); //クリックした要素の順番を割り出す
      counter(targetTable, jsonName, layoutName, index, bool);
      // console.log("counter");
    }
  );
}

/*

*/
function fireFuncJson(targetTable, elementId, layoutName) {
  $(function () {
    $(document).on(
      "click",
      ".tr_ele_class" + targetTable + layoutName,
      function () {
        //JSONデータを表示した部分をクリックすると
        const json = JSON.parse(
          document.getElementById(elementId + layoutName + "Area").value ||
            "null"
        ); //#rankingからjsonのstringをGET
        let index = $(".tr_ele_class" + targetTable + layoutName).index(this); //クリックした要素の順番を割り出す
        //  let varValue = json[0][Object.keys(json[0])[index]][0].value; //valueを取り出す
        //let jsonTxt = JSON.stringify(json[0].test[0]);
        //let jsonTxt = JSON.stringify(json[0]['test'][0]);
        let jsonTxt = JSON.stringify(json[0][Object.keys(json[0])[index]][0]);
        let parser = function (k, v) {
          return v.toString().indexOf("function") === 0
            ? eval("(" + v + ")")
            : v;
        };
        let fJson = JSON.parse(jsonTxt, parser);
        fJson.function();
      }
    );
  });
}

//json[0][keys[i]][0].link
/*
ROLE：表示するHTMLをJSで作成する関数兼HTMLへ表示する関数のインターフェース
HOWTO:elementIdにはstringで
01107 開始時スプリットレイアウトにしたい。。
*/
function createHtml(elementId, layoutName) {
  $(function () {
    $(elementId).css("display", "table-cell");
    //$('elementId').load("add.html"); //HTMLを追加する
    $(elementId).append(
      '\
        <!-- 01103 aタグ追加　JSONデータをダウンロードできるようにしたい 01106 ダウンロードできるようになった --> \
        <a id="download' +
        layoutName +
        '" download="ranking.json"> <button id="Form2Export' +
        layoutName +
        '">Form2Export</button> </a>\
        \
        <!-- 01103 全選択＆クリップボードにコピーしたい 01106 できた -->\
        <button id="Textarea2ClipBoard' +
        layoutName +
        '">Textarea2ClipBoard</button>\
        <p id="copy_alert' +
        layoutName +
        '" style="display:none">Copied！</p> \
        \
        <!-- 01106 jsonの中身を部分的に表示する。。できた -->\
        <p id="rankingTable' +
        layoutName +
        '">rankingTable_Area</p> \
        \
        <!-- 01107 スプリットレイアウトのボタンを作る。。 -->\
        <button id="splitBtn' +
        layoutName +
        '">Split:</button>\
        \
        <!-- 01123  -->\
        <button id="modeChangeBtn' +
        layoutName +
        '">Mode:Count</button>'
    );
  });
}

function modeChangeBtn(jsonName, layoutName) {
  $(document).on(
    "click",
    'button[id="modeChangeBtn' + layoutName + '"]',
    function () {
      const jsonLayoutName = jsonName + "0";
      if (getJsonData(jsonLayoutName, "counter", "life") === 0) {
        setJsonData(jsonLayoutName, "counter", "life", 1);
        $("#" + "modeChangeBtn" + layoutName).text("Mode:Count");
      } else if (getJsonData(jsonLayoutName, "counter", "life") === 1) {
        setJsonData(jsonLayoutName, "counter", "life", 0);
        $("#" + "modeChangeBtn" + layoutName).text("Mode:Insert");
      }
    }
  );
}
/* 01111 contenteditableで変更したデータを保存用JSONに反映したい....失敗してる。。。
 */
function change2SaveJson(json, layoutName) {
  $(function () {
    for (let i = 0; i < json.length; i++) {
      //jsonのデータをまるごと表示する
      $(document).on("input", ".test", function () {
        //
        console.log("input");
      });
    }
    $(document).on("input", ".test", function () {
      console.log("input");
    });
  });
}

/* 01115 https://qiita.com/riversun/items/60307d58f9b2f461082a#%E9%85%8D%E5%88%97%E3%81%AE%E8%A6%81%E7%B4%A0%E4%B8%AD%E8%BA%AB%E3%81%AF%E7%B5%90%E5%90%88concat%E3%81%97%E3%81%AA%E3%81%84%E5%A0%B4%E5%90%88
 */
function mergeDeeply(target, source, opts) {
  const isObject = (obj) =>
    obj && typeof obj === "object" && !Array.isArray(obj);
  const isConcatArray = opts && opts.concatArray;
  let result = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const [sourceKey, sourceValue] of Object.entries(source)) {
      const targetValue = target[sourceKey];
      if (
        isConcatArray &&
        Array.isArray(sourceValue) &&
        Array.isArray(targetValue)
      ) {
        result[sourceKey] = targetValue.concat(...sourceValue);
      } else if (isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
        result[sourceKey] = mergeDeeply(targetValue, sourceValue, opts);
      } else {
        Object.assign(result, {
          [sourceKey]: sourceValue,
        });
      }
    }
  }
  return result;
}
