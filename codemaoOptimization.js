// ==UserScript==
// @name         编程猫使用优化
// @namespace    https://shequ.codemao.cn/user/438403
// @version      1.52.300
// @description  对于在使用编程猫中遇到的各种问题的部分优化
// @author       小鱼yuzifu
// @match        *://shequ.codemao.cn/*
// @icon         https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3
// @require      https://cdn.staticfile.net/jquery/3.7.1/jquery.min.js
// @require      https://cdn.staticfile.net/sweetalert/2.1.2/sweetalert.min.js
// @require      https://cdn.staticfile.net/tldjs/2.3.1/tld.min.js
// @require      https://cdn.staticfile.net/viewerjs/1.11.6/viewer.min.js
// @require      https://gitee.com/sf-yuzifu/codemaoOptimization/raw/main/libraryComment.js#sha1=ffacefc5d88c525c29a6ed09b1d6fbd3391420a0
// @require      https://gitee.com/sf-yuzifu/eat-fish-together/raw/master/main.js#sha1=76b8aa4df8c56545893d8cfea8464c8a3d69957c
// @license      616 SB License

// @updateURL    https://gitee.com/sf-yuzifu/codemaoOptimization/raw/main/codemaoOptimization.js
// @downloadURL  https://gitee.com/sf-yuzifu/codemaoOptimization/raw/main/codemaoOptimization.js

// ==/UserScript==
unsafeWindow.eat_fish_together = eat_fish_together;
let theme;

let oldFnOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  if (arguments[1].includes("hidden_status")) {
    return oldFnOpen.apply();
  }
  return oldFnOpen.apply(this, arguments);
};

(function () {
  "use strict";
  if (window.location.href.indexOf("writer") != -1) {
    return false;
  }
  if (window.location.href.indexOf("publish") != -1) {
    let publish_on = setInterval(() => {
      if (window.location.href.indexOf("publish") == -1) {
        window.location.reload();
        clearInterval(publish_on);
      }
    }, 100);
    return false;
  }

  function titleChange(content) {
    if (document.querySelector("title") && document.querySelector("title").innerHTML != content) {
      document.querySelector("title").innerHTML = content;
    }
  }
  // 白名单
  let whiteList = [
    "box3.codemao.cn",
    "pickduck.cn",
    "shequ.codemao.cn",
    "player.codemao.cn",
    "static.yuzifu.top",
    "blog.yzf.moe",
    "player.bilibili.com",
    "bcmcreator.cn",
    "pgaot.com",
    "shequ.pgaot.com",
  ];
  // 感谢刘andy提供的代码awa
  unsafeWindow._dangerouslyOpenNewWindow = unsafeWindow.open;
  unsafeWindow.openurl = (url) => {
    // console.log("捕获");
    if ((url.includes("community") || url.includes("wiki/forum")) && (parseInt(url.split("/")[2]) || parseInt(url.split("/")[3]))) {
      // console.log("发现为帖子");
      let id = "";
      if (url.includes("community")) {
        id = url.split("/")[2];
      } else {
        id = url.split("/")[3];
      }
      // console.log(id);
      $.ajax({
        type: "GET",
        url: `https://api.codemao.cn/web/forums/posts/${id}/details`,
        contentType: "application/json;charset=UTF-8",
        async: true,
        xhrFields: {
          withCredentials: true,
        },
        success: function (obj) {
          let a = document.createElement("div");
          a.innerHTML = obj.content;
          // console.log(a);
          if (a.querySelector("iframe,embed")) {
            for (let i of a.querySelectorAll("iframe,embed")) {
              // console.log(i.getAttribute("src"), tldjs.parse(i.getAttribute("src")).hostname);
              if (i.getAttribute("src") && !whiteList.includes(tldjs.parse(i.getAttribute("src")).hostname)) {
                if (i.getAttribute("src").indexOf("https://static.codemao.cn/yuque/preview/") === 0) {
                  $.ajax({
                    type: "GET",
                    url: i.getAttribute("src"),
                    async: true,
                    success: function (obj) {
                      let a = document.createElement("div");
                      a.innerHTML = obj;
                      if (a.querySelector("script:not(script[src])").innerHTML.includes("viewer.setDocument")) {
                        return unsafeWindow._dangerouslyOpenNewWindow(url);
                      } else {
                        swal({
                          title: "危险",
                          text: "即将访问的帖子存在风险！",
                          icon: "error",
                          dangerMode: true,
                          buttons: { visit: "继续访问(不推荐)", danger: "立即退出(推荐)" },
                        }).then((x) => {
                          if (x == "visit") {
                            swal({
                              title: "警告",
                              text: "您真的要继续访问吗？",
                              dangerMode: true,
                              buttons: { visit: "继续访问(不推荐)", danger: "立即退出(推荐)" },
                            }).then((x) => {
                              if (x == "visit") {
                                return unsafeWindow._dangerouslyOpenNewWindow(url);
                              }
                              return null;
                            });
                            document.querySelector(".swal-button-container:last-child button").focus();
                          }
                          return null;
                        });
                        document.querySelector(".swal-button-container:last-child button").focus();
                      }
                    },
                  });
                } else {
                  swal({
                    title: "危险",
                    text: "即将访问的帖子存在风险！",
                    icon: "error",
                    dangerMode: true,
                    buttons: { visit: "继续访问(不推荐)", danger: "立即退出(推荐)" },
                  }).then((x) => {
                    if (x == "visit") {
                      swal({
                        title: "警告",
                        text: "您真的要继续访问吗？",
                        dangerMode: true,
                        buttons: { visit: "继续访问(不推荐)", danger: "立即退出(推荐)" },
                      }).then((x) => {
                        if (x == "visit") {
                          return unsafeWindow._dangerouslyOpenNewWindow(url);
                        }
                        return null;
                      });
                      document.querySelector(".swal-button-container:last-child button").focus();
                    }
                    return null;
                  });
                  document.querySelector(".swal-button-container:last-child button").focus();
                }
              } else {
                return unsafeWindow._dangerouslyOpenNewWindow(url);
              }
            }
          } else {
            return unsafeWindow._dangerouslyOpenNewWindow(url);
          }
        },
        error: function (res) {
          swal({
            title: "警告",
            text: "无法甄别即将访问的帖子是否危险！",
            icon: "warning",
            buttons: { visit: "暂不访问", danger: "继续访问" },
            closeOnClickOutside: false,
          }).then((x) => {
            if (x == "danger") {
              return unsafeWindow._dangerouslyOpenNewWindow(url);
            }
            return null;
          });
          // console.log(res.responseJSON);
        },
      });
    } else {
      // console.log("catched go");
      return unsafeWindow._dangerouslyOpenNewWindow(url);
    }
  };
  unsafeWindow.open = unsafeWindow.openurl;

  $("head").append(
    `
    <link rel="shortcut icon" href="https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3">
    <link href="https://cdn.staticfile.net/viewerjs/1.11.6/viewer.min.css" rel="stylesheet">
    `
  );
  if (!document.querySelector('meta[name="theme-color"]')) {
    $("head").append(`<meta name="theme-color" content="">`);
  }
  setInterval(() => {
    //尝试制作防劫持
    if (
      window.location.href.indexOf("message") != -1 ||
      ((window.location.href.indexOf("community") != -1 || window.location.href.indexOf("wiki/forum/") != -1) &&
        parseInt(window.location.href.slice(25 + 11)) &&
        document.querySelector("iframe")) ||
      window.location.href.indexOf("reader") != -1
    ) {
      var lakexViewer = document.querySelectorAll(".r-community-r-detail--forum_content a");
      for (var i = 0; i < lakexViewer.length; i++) {
        if (lakexViewer[i].getAttribute("href").indexOf("https://static.codemao.cn/yuque/preview/") === 0) {
          var lakexViewer1 = document.createElement("iframe");
          let urlObj = new URL(lakexViewer[i].getAttribute("href"));
          let hash = urlObj.hash.substring(1);
          lakexViewer1.style.width = "100%";
          lakexViewer1.style.height = hash + "px";
          lakexViewer1.setAttribute("src", lakexViewer[i].getAttribute("href"));
          lakexViewer1.setAttribute("allowfullscreen", "");
          lakexViewer[i].parentNode.replaceChild(lakexViewer1, lakexViewer[i]);
          if (document.querySelector("iframe[allowfullscreen]").attachEvent) {
            document.querySelector("iframe[allowfullscreen]").attachEvent("onload", function () {
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
            });
            document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
          } else {
            document.querySelector("iframe[allowfullscreen]").onload = function () {
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
            };
            document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
          }
        }
      }
      var iframes = document.querySelectorAll("iframe:not(#react-tinymce-0_ifr)");
      for (var i = 0; i < iframes.length; i++) {
        if (!whiteList.includes(tldjs.getDomain(iframes[i].getAttribute("src"))) && !iframes[i].getAttribute("src").indexOf("https://static.codemao.cn/yuque/preview/") === 0) {
          iframes[i].style.position = "inherit";
          if (!iframes[i].getAttribute("sandbox") && iframes[i] != document.querySelector(".mce-edit-area iframe")) {
            iframes[i].setAttribute("sandbox", "allow-forms allow-scripts allow-same-origin allow-popups");
            iframes[i].setAttribute("src", "https://static.yuzifu.top/bcm/iframe.php?url=" + iframes[i].getAttribute("src"));
          }
        }
      }
      var embeds = document.querySelectorAll("embed");
      for (i = 0; i < embeds.length; i++) {
        if (!whiteList.includes(tldjs.getDomain(embeds[i].getAttribute("src")))) {
          var embed_to_iframe = document.createElement("iframe");
          embed_to_iframe.style.width = embeds[i].style.width;
          embed_to_iframe.style.height = embeds[i].style.height;
          embed_to_iframe.setAttribute("src", embeds[i].getAttribute("src"));
          embeds[i].parentNode.replaceChild(embed_to_iframe, embeds[i]);
        }
      }
      document.querySelectorAll(".c-navigator--navigator").forEach((e) => {
        if (e != document.querySelector(".c-navigator--navigator")) {
          e.className = "";
        }
      });
    }
  }, 10);
  setInterval(() => {
    try {
      if (window.location.href.indexOf("community") != -1 || window.location.href.indexOf("wiki/forum") != -1) {
        titleChange("论坛 | 编程猫社区");
      }
      if (window.location.href.indexOf("work_shop") != -1) {
        if (
          parseInt(window.location.href.slice(25 + 10)) &&
          document.querySelector(".r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_cont .r-work_shop-r-details--title p")
        ) {
          titleChange(
            "工作室 | " +
              document.querySelector(".r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_cont .r-work_shop-r-details--title p").innerHTML +
              " | 编程猫社区"
          );
          if (document.querySelector(".c-model_box--show:not(.target,.abc) .r-work_shop-r-details-component-project_dialog--project_box_wrap")) {
            document.querySelector(".c-model_box--show:not(.target)").classList.add("target");
            document.querySelector(".c-model_box--show .r-work_shop-r-details-component-project_dialog--project_box_wrap").classList.add("target");
            $(".c-model_box--show .r-work_shop-r-details-component-project_dialog--project_box_wrap").after(
              "<div class='r-work_shop-r-details-component-project_dialog--project_box_wrap abc'></div>"
            );
            $(".c-model_box--show .r-work_shop-r-details-component-project_dialog--project_box_wrap.target").remove();
            $(".c-model_box--show .r-work_shop-r-details-component-project_dialog--project_box_wrap").append(
              `<div id="post_project_box" class="r-work_shop-r-details-component-project_dialog--container">
                <div class="r-work_shop-r-details-component-project_dialog--empty">
                  <div class="r-work_shop-r-details-component-project_dialog--empty_img r-work_shop-r-details-component-project_dialog--content"></div>
                  <span class="r-work_shop-r-details-component-project_dialog--empty_text r-work_shop-r-details-component-project_dialog--content">你有作品的话，会过一会儿显示在这里的～</span>
                </div>
                <div class="r-work_shop-r-details-component-project_dialog--project_list"> </div>
              </div>
              `
            );
            $.ajax({
              type: "GET",
              url: "https://api.codemao.cn/creation-tools/v1/user/center/honor",
              contentType: "application/json;charset=UTF-8",
              dataType: "json",
              xhrFields: {
                withCredentials: true,
              },
              success: function (response) {
                $.ajax({
                  type: "GET",
                  url: `https://api.codemao.cn/creation-tools/v2/user/center/work-list?user_id=${response.user_id}&offset=0&limit=1000`,
                  contentType: "application/json;charset=UTF-8",
                  dataType: "json",
                  xhrFields: {
                    withCredentials: true,
                  },
                  success: function (response) {
                    if (response.items.length !== 0) {
                      $(".r-work_shop-r-details-component-project_dialog--empty").remove();
                    }
                    for (let abc of response.items) {
                      let type;
                      switch (abc.type) {
                        case 1:
                          type = "Kitten";
                          break;
                        case 12:
                          type = "CoCo";
                          break;
                        case 7:
                          type = "海龟";
                          break;
                        case 8:
                          type = "Nemo";
                          break;
                        case 15:
                          type = "KittenN";
                          break;
                        default:
                          type = "";
                          break;
                      }
                      if (!document.querySelector(".r-work_shop-r-details-component-project_dialog--item[work-id='" + abc.id + "']")) {
                        $(".r-work_shop-r-details-component-project_dialog--project_list").append(`
                        <div class="r-work_shop-r-details-component-project_dialog--item_wrap">
                          <div class="r-work_shop-r-details-component-project_dialog--item" work-id="${abc.id}">
                            <div class="r-work_shop-r-details-component-project_dialog--image" style="background-image: url('${abc.preview}')"> </div>
                            <div class="r-work_shop-r-details-component-project_dialog--item_name">${abc.work_name}</div>
                            <div class="r-work_shop-r-details-component-project_dialog--view_and_like">
                              <span class="r-work_shop-r-details-component-project_dialog--view"><i></i>${abc.view_times}</span>
                              <span class="r-work_shop-r-details-component-project_dialog--like"><i></i>${abc.liked_times}</span>
                            </div>
                          </div>
                          ${
                            type === ""
                              ? ""
                              : `
                          <span class="r-work_shop-r-details-component-project_dialog--workshop_name">${type}</span>`
                          }
                        </div>
                        `);
                      }
                    }
                    $(".r-work_shop-r-details-component-project_dialog--item[work-id]").on("click", function () {
                      swal(`确定是 ${this.getElementsByClassName("r-work_shop-r-details-component-project_dialog--item_name")[0].innerHTML} 这个作品吗？`, {
                        buttons: ["取消", "确认"],
                      }).then((value) => {
                        let work_id = this.getAttribute("work-id");
                        if (value) {
                          $.ajax({
                            type: "GET",
                            contentType: "application/json;charset=UTF-8",
                            xhrFields: {
                              withCredentials: true,
                            },
                            url: "https://api.codemao.cn/web/shops/" + parseInt(window.location.href.slice(25 + 10)),
                            success: function (response) {
                              $.ajax({
                                type: "POST",
                                url: `https://api.codemao.cn/web/work_shops/works/contribute?id=${response.shop_id}&work_id=${work_id}`,
                                contentType: "application/json;charset=UTF-8",
                                xhrFields: {
                                  withCredentials: true,
                                },
                                success: function () {
                                  swal({
                                    title: "成功",
                                    text: `成功投稿！`,
                                    icon: "success",
                                  });
                                },
                                error: function (res) {
                                  if (res.responseJSON.error_code == "Work-Has-Join-to-Work-shop@Community-Admin") {
                                    swal({
                                      title: "错误",
                                      text: "这个作品你投过了吧？",
                                      icon: "error",
                                    });
                                  } else {
                                    swal({
                                      title: "错误",
                                      text: "未知错误，如果此作品是KittenN作品，可能当前并不支持投稿😭",
                                      icon: "error",
                                    });
                                  }

                                  // console.log(res.responseJSON);
                                },
                              });
                            },
                          });
                        }
                      });
                    });
                  },
                });
              },
            });
          }
        } else {
          titleChange("工作室 | 编程猫社区");
        }
      }
      if (window.location.href.indexOf("discover") != -1) {
        titleChange("发现 | 编程猫社区");
      }
      if (window.location.href.indexOf("gallery") != -1) {
        if (parseInt(window.location.href.slice(25 + 8)) && document.querySelector(".r-gallery-r-detail--name")) {
          titleChange("活动 | " + document.querySelector(".r-gallery-r-detail--name").innerHTML + " | 编程猫社区");
        } else {
          titleChange("活动 | 编程猫社区");
        }
      }
      if (window.location.href.indexOf("user") != -1) {
        titleChange("个人中心 | " + document.querySelector(".r-user-c-banner--name").innerHTML + " | 编程猫社区");
      }
      if (window.location.href.indexOf("work") != -1) {
        titleChange("作品 | " + document.querySelector(".r-work-c-work_info--work_name").innerHTML + " | 编程猫社区");
        /*
          反防沉迷系统，提供制作作品时调试，但不提供游玩🤔️
          想用可以自行取消下段代码的注释
           */
        if (document.querySelector(".c-virtual_player--virtual_player")) {
          $(".r-work-c-player--work_player_container .r-work-c-player--player_fun .r-work-c-player--player_refresh").remove();
          $(".r-work-c-player--player_control_bar .r-work-c-player--reset_btn").remove();
          var workType = $(".r-work-c-work_info--work_tool")
            .text()
            .replace(/作品由|创作/g, "");
          var web;
          if (workType == "kitten3") {
            web = "https://player.codemao.cn/old/";
          } else if (workType == "kitten4") {
            web = "https://player.codemao.cn/new/";
          } else if (workType == "nemo") {
            web = "https://nemo.codemao.cn/w/";
          } else if (workType == "CoCo编辑器") {
            web = "https://coco.codemao.cn/editor/player/";
          } else if (workType == "海龟编辑器") {
            web = "https://turtle.codemao.cn/?entry=sharing&channel_type=community&action=open_published_project&work_id=";
          } else if (workType == "KittenN编辑器") {
            web = "https://kn.codemao.cn/player?type=2&workId=";
          }
          $(".r-work-c-player--work_player_container .r-work-c-player--player_container.r-work-c-player--fullscreen iframe").css("height", "100%");
          if (!document.querySelector(".c-virtual_player--virtual_player").getElementsByTagName("iframe")[0]) {
            document.querySelector(".c-virtual_player--virtual_player").innerHTML =
              '<iframe id="player_cover" allow="geolocation; microphone; camera" sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts" src="' +
              web +
              parseInt(window.location.href.slice(25 + 5)) +
              '"></iframe>';
          }
        }
      }
      if (window.location.href.indexOf("studio") != -1) {
        titleChange("活动 | " + document.querySelector(".r-studio--studio_title").innerHTML + " | 编程猫社区");
      }
      if (window.location.href.indexOf("setting") != -1) {
        titleChange("设置 | 编程猫社区");
        if (!document.querySelector(".r-setting-component-set_avatar--upload_link.upload")) {
          $(".r-setting-component-set_avatar--upload_link").after(document.querySelector(".r-setting-component-set_avatar--upload_link").cloneNode(true)).remove();
          $(".r-setting-component-set_avatar--upload_link").addClass("upload");
          $(".r-setting-component-set_avatar--btn_save").after(document.querySelector(".r-setting-component-set_avatar--btn_save").cloneNode(true)).remove();
          $(".r-setting-component-set_avatar--btn_save").addClass("upload");
          document.querySelector(".r-setting-component-set_avatar--upload_link.upload").onclick = () => {
            var e = document.createElement("input");
            e.setAttribute("type", "file");
            e.addEventListener("change", function (e) {
              var n = e.target.files[0];
              document.querySelector(".r-setting-component-set_avatar--left_area_container .r-setting-component-set_avatar--my_avatar").style.backgroundImage = `url(${upload(n)})`;
            });
            e.click();
          };
          document.querySelector(".r-setting-component-set_avatar--btn_save.upload").onclick = () => {
            let url = document.querySelector(".r-setting-component-set_avatar--left_area_container .r-setting-component-set_avatar--my_avatar").style.backgroundImage;
            url = url.includes('"') ? url.replace('url("', "").replace('")', "") : url.replace("url(", "").replace(")", "");
            $.ajax({
              type: "PATCH",
              url: "https://api.codemao.cn/tiger/v3/web/accounts/info",
              contentType: "application/json;charset=UTF-8",
              data: JSON.stringify({
                avatar_url: url,
              }),
              dataType: "json",
              xhrFields: {
                withCredentials: true,
              },
              success: function () {
                document.querySelector(".c-model_box--dialog_wrap .c-model_box--content_box .c-model_box--close").click();
                document.querySelector(".r-setting--setting_form .r-setting--form_item .r-setting--head_icon").style.backgroundImage = `url(${url})`;
                document.querySelector(".c-navigator--header-content .c-navigator--user_wrap .c-navigator--avatar").style.backgroundImage = `url(${url})`;
                window.location.reload();
              },
              error: function (res) {
                alert("失败");
                // console.log(res.responseJSON);
              },
            });
          };
        }
      }

      function upload(file) {
        let url, fn, token, key, upload_url;
        fn = "avatar";
        $.ajax({
          type: "GET",
          url: "https://oversea-api.code.game/tiger/kitten/cdn/token/1?prefix=avatar&bucket=static",
          contentType: "application/json;charset=UTF-8",
          async: false,
          xhrFields: {
            withCredentials: true,
          },
          success: function (res) {
            upload_url = res.bucket_url;
            token = res["data"][0]["token"];
            key = res["data"][0]["filename"];
          },
        });
        var formData = new FormData();
        formData.append("token", token);
        formData.append("key", key);
        formData.append("fname", fn);
        formData.append("file", file);
        $.ajax({
          type: "POST",
          url: "https://upload.qiniup.com/",
          async: false,
          contentType: false,
          processData: false,
          data: formData,
          success: function (res) {
            url = "/" + res.key;
          },
        });
        return encodeURI(upload_url + url);
      }
      if (window.location.href.indexOf("course") != -1) {
        titleChange("课程 | 编程猫社区");
      }
      if (window.location.href.indexOf("mall") != -1) {
        titleChange("素材 | 编程猫社区");
      }
      if (window.location.href.indexOf("my") != -1) {
        titleChange("作品管理 | 编程猫社区");
      }
      if (window.location.href.indexOf("wiki/novel") != -1) {
        titleChange("图书馆 | 编程猫社区");
      }
      if (window.location.href.indexOf("wiki/cartoon") != -1) {
        titleChange("漫画连载 | 编程猫社区");
      }
      if (window.location.href.indexOf("wiki/book") != -1) {
        titleChange("资料图鉴 | 编程猫社区");
      }
      if (
        (window.location.href.indexOf("community") != -1 || window.location.href.indexOf("wiki/forum/") != -1) &&
        parseInt(window.location.href.slice(25 + 11)) &&
        document.querySelector(".r-community-r-detail--forum_content")
      ) {
        let gallery = new Viewer(document.querySelector(".r-community-r-detail--forum_content"));
        for (var photos of document.querySelectorAll(".r-community-r-detail-c-comment_item--content")) {
          new Viewer(photos);
        }
      }

      if (document.querySelector(".r-404--container") != null) {
        titleChange("404 | 编程猫社区");
        if (document.querySelector("a").innerHTML == "返回首页") {
          document.querySelector("a").innerHTML = "3秒后返回首页";
        } else {
          if (document.querySelector("a").innerHTML != "返回首页喽～") {
            document.querySelector("a").innerHTML = (parseFloat(document.querySelector("a").innerHTML.slice(0)) * 10 - 1) / 10 + "秒后返回首页";
          }

          if (Math.ceil(parseFloat(document.querySelector("a").innerHTML.slice(0))) == "0") {
            window.location.href = "https://shequ.codemao.cn/";
            document.querySelector("a").innerHTML = "返回首页喽～";
          }
        }
      }
    } catch (e) {
      // console.error(e);
    }
  }, 100);

  (function () {
    /* 这里是自定义Logo */
    setInterval(() => {
      if (document.querySelector(".c-navigator--logo_wrap img") || document.querySelector(".index__header-brand___2nK8h img")) {
        $(".c-navigator--logo_wrap img").remove();
        $(".index__header-brand___2nK8h img").remove();
        let PICKCAT = localStorage.getItem("customLogo") || "PICKCAT";
        $(".c-navigator--logo_wrap").append(`<span class='pickcat'>${PICKCAT}</span>`);
        $(".index__header-brand___2nK8h").append(`<span class='pickcat'>${PICKCAT}</span>`);
        $("li[data-watch_event='下载APP-入口tab']").after(
          `<li class="event_target data_report c-navigator--item" data-watch_event="设置-入口tab" data-extra_word_one="点击" data-data_report_btn_name="设置-入口tab"><a>设置</a></li>`
        );
        $("li.index__first-nav-content___1Ea0w:last-child").before(
          `<li data-watch_event="设置-入口tab" data-extra_word_one="点击" data-data_report_btn_name="设置-入口tab" class="index__first-nav-content___1Ea0w"><div class="index__more_nav___2gH4S"><a>设置</a><span> </span><i></i></div></li>`
        );
        document.documentElement.style.setProperty("--main-color", localStorage.getItem("main-color") || "#fec433");
        document.documentElement.style.setProperty("--second-color", localStorage.getItem("second-color") || "#f6b206");
        document.documentElement.style.setProperty("--person-setting", localStorage.getItem("person-setting") || "pic");
        document.documentElement.style.setProperty("--person-color", localStorage.getItem("person-color") || "#000");
        document.documentElement.style.setProperty(
          "--person-bg",
          localStorage.getItem("person-bg") || "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)"
        );
        document.documentElement.style.setProperty("--highlight-color", localStorage.getItem("highlight-color") || "#ec443d");
        document.documentElement.style.setProperty("--isLevelShown", localStorage.getItem("isLevelShown") || "");
        try {
          document.querySelector('meta[name="theme-color"]').content = localStorage.getItem("main-color") || "#fec433";
        } catch (e) {}
        if (!document.querySelector(".c-dialog--dialog_cover")) {
          $("body").append("<div class='c-dialog--dialog_cover'></div>");
        }
        $(".c-dialog--dialog_cover").after(`
                  <div id="yzf-settings">
                      <button id="yzf-close">&times</button>
                      <div id="yzf-main-thing">
                      <div class="color-sel">
                        <span>导航栏标题</span>
                        <input id="customLogo" type="" value="${localStorage.getItem("customLogo") || ""}"></input>
                      </div>
                      <div class="color-sel">
                        <span>主题设置</span>
                        <div>
                          <span><input type="radio" name="theme-set" value="light"/>浅色</span>
                          <span><input type="radio" name="theme-set" value="dark"/>深色</span>
                          <span><input type="radio" name="theme-set" value="auto"/>自动</span>
                        </div>
                      </div>
                      <div class="color-sel">
                        <span>主色调</span>
                        <input id="main-color" type="color" value="#ff0000"></input>
                      </div>
                      <div class="color-sel">
                        <span>辅色调</span>
                        <input id="second-color" type="color" value="#ff0000"></input>
                      </div>
                      <div class="color-sel">
                        <span>突出色调</span>
                        <input id="highlight-color" type="color" value="#ec443d"></input>
                      </div>
                      <div class="color-sel">
                        <span>个人中心背景</span>
                        <div>
                          <span><input type="radio" name="person-setting" value="pic"/>图片</span>
                          <span><input type="radio" name="person-setting" value="color"/>纯色</span>
                        </div>
                      </div>
                      <div class="bg-sel">
                        <input id="person-color" type="color" value="#ff0000"/>
                        <button id="person-bg-btn">选择图片</button>
                        <input style="display:none;" id="person-bg" type="file"/>
                      </div>
                      <div class="color-sel">
                        <span>等级显示</span>
                        <input id="level-shown" type="checkbox" value="" checked/>
                      </div>
                      <div class="mess-del">
                        <span>铃铛红点清除</span>
                        <button id="mess-del-btn">清除</button>
                      </div>
                      <div class="mess-del">
                        <span>作品再创作查询</span>
                        <button id="remixCheck-btn">查询</button>
                      </div>
                      <div class="mess-del">
                        <span>账号“登录用户名”设置</span>
                        <button id="username-btn">设置</button>
                      </div>
                      <div class="mess-del">
                        <span>作品广告评论关键词设置</span>
                        <button id="Junkcomment-btn">设置</button>
                      </div>
                      <div class="mess-del">
                        <span>作品广告评论查询</span>
                        <button id="commentCheck-btn">查询</button>
                      </div>
                      <div class="color-sel">
                        <span>语雀Markdown编辑器</span>
                        <input id="md-use" type="checkbox" value="" checked/>
                      </div>
                      <div class="color-sel">
                        <span>论坛自动翻页</span>
                        <input id="auto-turn" type="checkbox" value=""/>
                      </div>
                      <div id="navbar-sett">
                        <span>导航栏排版</span>
                        <div>
                          <span><input fish type="checkbox" value="首页" checked/>首页</span>
                          <span><input fish type="checkbox" value="课程" checked/>课程</span>
                          <span><input fish type="checkbox" value="发现" checked/>发现</span>
                          <span><input fish type="checkbox" value="工作室" checked/>工作室</span>
                          <span><input fish type="checkbox" value="论坛" checked/>论坛</span>
                          <span><input fish type="checkbox" value="素材" checked/>素材</span>
                          <span><input fish type="checkbox" value="活动" checked/>活动</span>
                          <span><input fish type="checkbox" value="下载APP" checked/>下载APP</span>
                          <span><input fish type="checkbox" value="更多" checked/>更多(···)</span>
                        </div>
                      </div>
                      <div id="index-sett">
                        <span>首页排版</span>
                        <div>
                          <span><input fish2 type="checkbox" value="--guide-part" checked/>新人指导</span>
                          <span><input fish2 type="checkbox" value="--box3" checked/>代码岛3.0精选</span>
                          <span><input fish2 type="checkbox" value="--recommend-work" checked/>点猫精选</span>
                          <span><input fish2 type="checkbox" value="--new-work" checked/>新作喵喵看</span>
                          <span><input fish2 type="checkbox" value="--box3-community" checked/>训练师小课堂</span>
                          <span><input fish2 type="checkbox" value="--workshop" checked/>优秀工作室</span>
                          <span><input fish2 type="checkbox" value="--novel" checked/>原创少儿小说</span>
                          <span><input fish2 type="checkbox" value="--code-tv" checked/>编程TV</span>
                          <span><input fish2 type="checkbox" value="--community-star" checked/>社区星推荐</span>
                        </div>
                      </div>
                      <div id="custom-sett" style="padding: 15px 0;">
                        <span>自定义CSS样式</span>
                        <textarea rows="10" cols="20"></textarea>
                      </div>
                  </div>
                  `);
        var ws;
        let user_id;
        let wsHeart;
        if (window.location.href.indexOf("work/") != -1 && parseInt(window.location.href.slice(25 + 5))) {
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/creation-tools/v1/works/" + parseInt(window.location.href.slice(25 + 5)),
            contentType: "application/json;charset=UTF-8",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              if (response.type == "NEMO") {
                setInterval(() => {
                  if (document.querySelector(".r-work-c-player--player_fun .r-work-c-player--player_rotate_screen") == null) {
                    $(".r-work-c-player--player_full_screen").after(
                      `<span class="event_target data_report r-work-c-player--player_rotate_screen" data-watch_event="作品-旋转屏幕" data-extra_word_one="旋转屏幕" data-data_report_btn_name="作品-旋转屏幕"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24H42V42H12V24Z" fill="none" stroke="" stroke-width="4" stroke-linejoin="round"/><path d="M6 8V17H15" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38.4747 13.2985C35.1956 8.87049 29.933 6 24 6C18.1788 6 13.0029 8.76334 9.71272 13.0498L6 17" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
                    );
                    $(".r-work-c-player--player_fun .r-work-c-player--player_rotate_screen").click(function () {
                      rotateDeg -= 90;
                      document.documentElement.style.setProperty("--rotateDeg", "rotate(" + rotateDeg + "deg)");
                      document.documentElement.style.setProperty("--OppoRotateDeg", "rotate(" + -rotateDeg + "deg)");
                      //document.getElementById('player_cover').contentWindow.document.querySelector('body').style.transform='rotate(' + -rotateDeg + 'deg)'
                    });
                  }
                  if (document.querySelector(".r-work-c-player--player_control_bar .r-work-c-player--player_rotate_screen") == null) {
                    $(".r-work-c-player--player_control_bar .r-work-c-player--reset_btn").css("right", 136 + "px");
                    $(".r-work-c-player--quit_fullscreen_btn").before(
                      `<div class="r-work-c-player--player_rotate_screen r-work-c-player--btn r-work-c-player--action"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24H42V42H12V24Z" fill="none" stroke="" stroke-width="4" stroke-linejoin="round"/><path d="M6 8V17H15" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38.4747 13.2985C35.1956 8.87049 29.933 6 24 6C18.1788 6 13.0029 8.76334 9.71272 13.0498L6 17" stroke="" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="r-work-c-player--tip">旋转屏幕</span></div>`
                    );
                    $(".r-work-c-player--player_control_bar .r-work-c-player--player_rotate_screen").click(function () {
                      rotateDeg -= 90;
                      document.documentElement.style.setProperty("--rotateDeg", "rotate(" + rotateDeg + "deg)");
                      document.documentElement.style.setProperty("--OppoRotateDeg", "rotate(" + -rotateDeg + "deg)");
                      //document.getElementById('player_cover').contentWindow.document.querySelector('body').style.transform='rotate(' + -rotateDeg + 'deg)'
                    });
                  }
                }, 100);
                var rotateDeg = 0;
              }
            },
          });
        }
        var whiles;
        function to_light() {
          theme = "light";
          document.documentElement.style.setProperty("--main-color", localStorage.getItem("main-color") || "#fec433");
          document.documentElement.style.setProperty("--second-color", localStorage.getItem("second-color") || "#f6b206");
          document.querySelector('meta[name="theme-color"]').content = localStorage.getItem("main-color") || "#fec433";
          clearInterval(whiles);
          whiles = setInterval(() => {
            try {
              document.querySelector(".forum_editor .mce-edit-area.mce-container.mce-panel iframe").contentWindow.document.body.style.backgroundColor = "";
              document.querySelector(".forum_editor .mce-edit-area.mce-container.mce-panel iframe").contentWindow.document.body.style.color = "";
            } catch (e) {}
          });
          if (document.querySelector("iframe[allowfullscreen]")) {
            document.querySelector("iframe[allowfullscreen]").src = document.querySelector("iframe[allowfullscreen]").src;
            if (document.querySelector("iframe[allowfullscreen]").attachEvent) {
              document.querySelector("iframe[allowfullscreen]").attachEvent("onload", function () {
                document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("light", "*");
              });
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("light", "*");
            } else {
              document.querySelector("iframe[allowfullscreen]").onload = function () {
                document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("light", "*");
              };
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("light", "*");
            }
          }

          try {
            $(".darkmode").remove();
          } catch (e) {}
        }

        function to_dark() {
          theme = "dark";
          document.documentElement.style.setProperty("--main-color", "#666666");
          document.documentElement.style.setProperty("--second-color", "#525252");
          document.querySelector('meta[name="theme-color"]').content = "#666666";
          clearInterval(whiles);
          whiles = setInterval(() => {
            try {
              document.querySelector(".forum_editor .mce-edit-area.mce-container.mce-panel iframe").contentWindow.document.body.style.backgroundColor = "#525252";
              document.querySelector(".forum_editor .mce-edit-area.mce-container.mce-panel iframe").contentWindow.document.body.style.color = "#fff";
            } catch (e) {}
          });
          if (document.querySelector("iframe[allowfullscreen]")) {
            // document.querySelector("iframe[allowfullscreen]").src = document.querySelector("iframe[allowfullscreen]").src;
            if (document.querySelector("iframe[allowfullscreen]").attachEvent) {
              document.querySelector("iframe[allowfullscreen]").attachEvent("onload", function () {
                document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("dark", "*");
              });
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("dark", "*");
            } else {
              document.querySelector("iframe[allowfullscreen]").onload = function () {
                document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("dark", "*");
              };
              document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage("dark", "*");
            }
          }
          $("head").append(`
                  <style class="darkmode">
                  #comment_container,
                  #page,
                  #comment_sender textarea {
                    color: #eeeeee;
                  }
                  #comment_container strong,
                  #comment_container a{
                    color: currentColor;
                  }
                  #comment_container pre {
                    color: currentColor;
                    background-color: transparent;
                  }
                  body,
                  .r-course--course_cont,
                  .r-user--user-module, .r-user--user-module .r-user--user-contarner,
                  .r-message--container,
                  .app__content___3n_ce,
                  .c-logout--container
                 {
                      background:#000!important;
                  }
                  .r-index--main_cont,
                  .r-home--homepage,
                  .r-discover--header .r-discover--search-box input,
                  .r-work_shop--container .r-work_shop--cont .r-work_shop--title .r-work_shop--search_cont .r-work_shop--search_form input{
                      background:#000!important;
                      color:#fff!important
                  }
                  .r-home-c-section_header--text,
                  .r-home-c-section_header--section_header .r-home-c-section_header--right_text,
                  .r-home-c-work_card--author_name,
                  .r-home-c-work_card--work_name,
                  .r-home-c-novel_area--book_wrap .r-home-c-novel_area--content .r-home-c-novel_area--title,
                  .r-home-c-novel_area--nickname,
                  .r-home-c-novel_area--desc,
                  .r-home-c-code_tv--tv_list p,
                  .r-home-c-community_star--user_nickname,
                  .r-home-c-community_star--user_recommend_cont .r-home-c-community_star--user_recommend_item .r-home-c-community_star--user_recommend_text p,
                  .r-discover-c-banner--banner_cont .r-discover-c-banner--item p,
                  .r-discover--header .r-discover--work,
                  .r-discover-c-workcard--work_item .r-discover-c-workcard--work_name,
                  .r-discover-c-workcard--work_item .r-discover-c-workcard--author,
                  .r-course-c-course-category-title--course-title .r-course-c-course-category-title--title,
                  .r-course-c-course-item--course .r-course-c-course-item--title,
                  .r-work_shop--container .r-work_shop--cont .r-work_shop--title .r-work_shop--title_name,
                  .r-work_shop-c-work_shop_card--card_item .r-work_shop-c-work_shop_card--title,
                  .r-work_shop-c-work_shop_card--card_item .r-work_shop-c-work_shop_card--administrator .r-work_shop-c-work_shop_card--leader,
                  .r-work_shop-c-work_shop_card--card_item .r-work_shop-c-work_shop_card--administrator .r-work_shop-c-work_shop_card--deputy_leader,
                  .r-work_shop--search_container .r-work_shop--second_title span,
                  .r-community--notic_container .r-community--notic_title,
                  .r-community--notic_container .r-community--notic_body .r-community--notic_item .r-community--notic_item_text,
                  .r-community--search_container .r-community--my_options .r-community--option,
                  .r-home-c-course_item--course .r-home-c-course_item--title,
                  .r-home-c-course--more_course_card .r-home-c-course--footer,
                  .r-home-c-creativityComponent--title,
                  .r-home-c-creativityComponent--nickname,
                  .r-community--search_form input,
                  .c-post_list--post_container .c-post_list--post_title h3,
                  .r-mall-r-home--title_all .r-mall-r-home--title .r-mall-r-home--theme_title,
                  .r-gallery--container .r-gallery--theme_container .r-gallery--title_all .r-gallery--title .r-gallery--theme_title,
                  .r-gallery-c-theme_card--card_item .r-gallery-c-theme_card--bottom_cont .r-gallery-c-theme_card--name,
                  .c-navigator--header-content .c-navigator--nav_wrap .c-navigator--dropdown .c-navigator--dropdown_item a,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown .c-navigator--dropdown-wrap li .c-navigator--logout,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown .c-navigator--dropdown-wrap li a,
                  .c-navigator--header-content .c-navigator--ide_link .c-navigator--drop_down .c-navigator--cont .c-navigator--item .c-navigator--title,
                  .r-user-c-banner--banner .r-user-c-banner--nav-box ul p.r-user-c-banner--active span,
                  .r-user-c-banner--banner .r-user-c-banner--nav-box ul p:hover span,
                  .r-user-c-slide-panel--box .r-user-c-slide-panel--num,
                  .r-user-c-nav-bar--bar .r-user-c-nav-bar--title h5,
                  .r-user-c-game--game-card .r-user-c-game--content-box .r-user-c-game--work_tag_and_name .r-user-c-game--title,
                  .r-user-c-person--person.r-user-c-person--simple .r-user-c-person--content-box p,
                  .r-user-c-button-panel--bottom .r-user-c-button-panel--title,
                  .r-user-c-person--person.r-user-c-person--normal .r-user-c-person--left-box .r-user-c-person--name,
                  .r-community-r-detail--forum_container .r-community-r-detail--forum_title,
                  .r-community-r-detail--forum_comments_container .r-community-r-detail--comments_title,
                  .r-message-c-buy--buy_list .r-message-c-buy--buy_item .r-message-c-buy--contnet p .r-message-c-buy--work_name,
                  .r-message-c-comments--comments_list .r-message-c-comments--comments_item .r-message-c-comments--contnet p .r-message-c-comments--work_name,
                  .r-message--container .r-message--nav_item.r-message--cur_nav, .r-message--container .r-message--nav_item.r-message--cur_nav span,
                  .r-message-c-system_message--system_list .r-message-c-system_message--system_item .r-message-c-system_message--contnet .r-message-c-system_message--work_name,
                  .r-work-c-author_info--author_info_card .r-work-c-author_info--author_info .r-work-c-author_info--introduction .r-work-c-author_info--author .r-work-c-author_info--account_name,
                  .r-work-c-work_info--container .r-work-c-work_info--work_name,
                  .r-work-c-work_info--container .r-work-c-work_info--work_description .r-work-c-work_info--sub_title,
                  .r-work-c-work_interaction-component-fork_button--fork_work_button .r-work-c-work_interaction-component-fork_button--content .r-work-c-work_interaction-component-fork_button--data_name,
                  .r-work-c-work_interaction--work_interaction_container .r-work-c-work_interaction--button_wrap .r-work-c-work_interaction--interaction_button .r-work-c-work_interaction--content .r-work-c-work_interaction--data_name,
                  .r-work-c-comment_area-c-comment_item--content_container .r-work-c-comment_area-c-comment_item--content .r-work-c-comment_area-c-comment_item--comment_text,
                  .r-work-c-comment_area--comment_container .r-work-c-comment_area--comment_title,
                  .forum_editor .mce-toolbar .mce-ico,
                  .forum_editor #mceu_2-open .mce-caret:before,
                  .r-community-c-forum_sender--container .r-community-c-forum_sender--form_item .r-community-c-forum_sender--select_tips,
                  .r-work_shop-c-user_card--user_item.r-work_shop-c-user_card--one_bg .r-work_shop-c-user_card--nickname,
                  .r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_cont .r-work_shop-r-details--nav_cont .r-work_shop-r-details--nav.r-work_shop-r-details--select,
                  .c-work_card--work_item .c-work_card--work_name,
                  .c-comment-c-comment_item--content_container .c-comment-c-comment_item--author .c-comment-c-comment_item--author_link,
                  .c-comment-c-comment_item--content_container .c-comment-c-comment_item--content,
                  .c-comment-c-comment_reply--reply_container .c-comment-c-comment_reply--reply_item .c-comment-c-comment_reply--content_container .c-comment-c-comment_reply--author,
                  .c-comment-c-comment_reply--reply_container .c-comment-c-comment_reply--reply_bottom .c-comment-c-comment_reply--preview a,
                  .c-post_list--post_list_header h2,
                  .c-comment--comment_container .c-comment--comment_title,
                  .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li.r-gallery-r-detail--select, .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li:hover,
                  .r-gallery-c-user_card--user_item .r-gallery-c-user_card--nickname,
                  .r-studio--cont .r-studio--center_cont .r-studio--header,
                  .r-studio-c-card_item--work_item .r-studio-c-card_item--bottom_cont .r-studio-c-card_item--title,
                  .r-work-c-work_activity--container .r-work-c-work_activity--title,
                  .r-work-c-work_container--work_list .r-work-c-work_container--work_list_title,
                  .r-setting--main_area .r-setting--setting_classes,
                  .r-setting--setting_form .r-setting--form_item .r-setting--radio_input,
                  .r-setting--account_setting .r-setting--setting_item .r-setting--setting_name,
                  .r-setting--left_area a.r-setting--active,
                  .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_item .r-work-c-comment_area-c-comment_reply--content_container .r-work-c-comment_area-c-comment_reply--author .r-work-c-comment_area-c-comment_reply--author_link,
                  .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_bottom .r-work-c-comment_area-c-comment_reply--preview a,
                  .r-work_manager--work_manager_wrap .r-work_manager--title,
                  .r-work_manager-c-sidebar--sidebar .r-work_manager-c-sidebar--avatar .r-work_manager-c-sidebar--user_name,
                  .r-work_manager-c-normal_work_card--normal_work_card .r-work_manager-c-normal_work_card--work_info .r-work_manager-c-normal_work_card--work_tag_and_name .r-work_manager-c-normal_work_card--name,
                  .r-work_manager-c-wood_work_card--wood_card .r-work_manager-c-wood_work_card--work_info .r-work_manager-c-wood_work_card--info .r-work_manager-c-wood_work_card--name,
                  .r-work_manager-c-release_dialog--release_dialog .r-work_manager-c-release_dialog--content title,
                  .r-work_manager-c-coco_work_card--nemo_work_card .r-work_manager-c-coco_work_card--detail .r-work_manager-c-coco_work_card--info .r-work_manager-c-coco_work_card--title,
                  .r-work_manager-c-recycle_normal_card--recycle_normal_card .r-work_manager-c-recycle_normal_card--detail .r-work_manager-c-recycle_normal_card--info .r-work_manager-c-recycle_normal_card--name,
                  .index__novel-title___2MI1y h1,
                  .index__novel-chapter-box___1TNT2 .index__novel-brief-tit___cmfnj,
                  .index__chapter-title___1Pnoq, .index__comment-title___cOqiM,
                  .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap header .r-work_shop-r-manage-c-edit_workshop_info--title,
                  .r-work_shop-r-manage-c-workshop_info_editor--item_name,
                  .c-logout--content p,
                  .c-dialog-c-sign_box--main_content .c-dialog-c-sign_box--tap_cont .c-dialog-c-sign_box--item,
                  .like[active]
                  {
                      color:#fff!important
                  }

                  .r-discover--header .r-discover--switch-box li:not(.r-discover--active),
                  .c-post_list--post_container .c-post_list--post_header span,
                  .r-discover-c-tagList--sort_cont .r-discover-c-tagList--sort_item,
                  .c-post_list--post_container .c-post_list--post_short,
                  .c-pagination--btn.c-pagination--page-container li:not(.c-pagination--activePage),
                  .r-mall-r-home--categories_wrap .r-mall-r-home--categories_item p,
                  .r-mall-r-home--title_all .r-mall-r-home--title .r-mall-r-home--tap:not(.r-mall-r-home--select),
                  .r-mall-r-home--theme_container .r-mall-r-home--theme_list .r-mall-r-home--theme_item .r-mall-r-home--theme_name,
                  .r-gallery--labels .r-gallery--label:not(.r-gallery--labels .r-gallery--label_active),
                  .c-navigator--header-content .c-navigator--ide_link .c-navigator--drop_down .c-navigator--cont .c-navigator--item .c-navigator--description,
                  .r-user-c-banner--banner .r-user-c-banner--nav-box ul p span,
                  .r-user-c-person--person.r-user-c-person--normal .r-user-c-person--left-box .r-user-c-person--like,
                  .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_item .r-community-r-detail-c-comment_reply--content_container .r-community-r-detail-c-comment_reply--author,
                  .r-message-c-buy--buy_list .r-message-c-buy--buy_item .r-message-c-buy--contnet p,
                  .r-message-c-buy--buy_list .r-message-c-buy--buy_item .r-message-c-buy--contnet p .r-message-c-buy--delete,
                  .r-message-c-comments--comments_list .r-message-c-comments--comments_item .r-message-c-comments--contnet p,
                  .r-message--container .r-message--nav_item,
                  .r-message-c-system_message--system_list .r-message-c-system_message--system_item .r-message-c-system_message--contnet .r-message-c-system_message--content_text,
                  .r-message-c-system_message--system_list .r-message-c-system_message--system_item .r-message-c-system_message--contnet .r-message-c-system_message--delete,
                  .r-message-c-comments--comments_list .r-message-c-comments--comments_item .r-message-c-comments--contnet p .r-message-c-comments--delete,
                  .r-work-c-author_info--author_info_card .r-work-c-author_info--author_info .r-work-c-author_info--introduction .r-work-c-author_info--author_signature,
                  .r-work-c-work_info--container .r-work-c-work_info--work_description .r-work-c-work_info--content_wrap .r-work-c-work_info--content,
                  .r-work-c-comment_area-c-comment_item--content_container .r-work-c-comment_area-c-comment_item--author .r-work-c-comment_area-c-comment_item--author_link,
                  .r-work-c-work_info--container .r-work-c-work_info--work_tool,
                  .r-work_shop-c-user_card--user_item .r-work_shop-c-user_card--nickname,
                  .r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_cont .r-work_shop-r-details--nav_cont .r-work_shop-r-details--nav,
                  .c-work_card--work_item .c-work_card--author a,
                  .c-comment-c-comment_reply--reply_container .c-comment-c-comment_reply--reply_item .c-comment-c-comment_reply--content_container .c-comment-c-comment_reply--author .c-comment-c-comment_reply--author_link,
                  .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li,
                  .r-studio-c-card_item--work_item .r-studio-c-card_item--bottom_cont .r-studio-c-card_item--author a,
                  .r-studio-c-user_item--user_item .r-studio-c-user_item--nickname,
                  .c-work_item--work_item .c-work_item--work_detail .c-work_item--name,
                  .c-work_item--work_item .c-work_item--work_detail .c-work_item--author .c-work_item--author_name,
                  .r-setting--left_area a,
                  .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_item .r-work-c-comment_area-c-comment_reply--content_container .r-work-c-comment_area-c-comment_reply--author,
                  .r-work_manager-c-sidebar--sidebar .r-work_manager-c-sidebar--work_type_list_wrap .r-work_manager-c-sidebar--work_type_list .r-work_manager-c-sidebar--work_type_item,
                  .r-work_manager--work_panel_header .r-work_manager--status_tab_container .r-work_manager--status_tab,
                  .r-community-r-detail-c-report_comment--container .r-community-r-detail-c-report_comment--label_group .r-community-r-detail-c-report_comment--item_cont,
                  .r-work_manager-c-coco_work_card--nemo_work_card .r-work_manager-c-coco_work_card--detail .r-work_manager-c-coco_work_card--info span,
                  .r-work_manager-c-recycle_normal_card--recycle_normal_card .r-work_manager-c-recycle_normal_card--detail .r-work_manager-c-recycle_normal_card--info .r-work_manager-c-recycle_normal_card--update_time,
                  .r-work_manager--recycle_panel_header .r-work_manager--work_type_tabs .r-work_manager--tab,
                  .index__novel-title___2MI1y .index__novel-author___2iS90,
                  .index__novel-num-info___3xBix .index__novel-num___6ajfF,
                  .index__novel-title___2MI1y .index__novel-nickname___47n_d,
                  .index__novel-chapter-box___1TNT2 p,
                  .index__novel-chapter-box___1TNT2 .index__novel-chapter-now___3YUTv,
                  .index__novel-chapter-box___1TNT2 .index__chapter-update-time___35AwR,
                  .index__novel-chapter-box___1TNT2 .index__novel-brief-cont___3Fefi,
                  .index__chapter-item___3O9fG .index__chapter-item-title___D0Nyk,
                  .r-work_shop-r-manage-c-workshop_info_editor--text,
                  .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--cancel,
                  .r-work_shop-r-manage-c-manage_staff--member_list_wrap .r-work_shop-r-manage-c-manage_staff--member_list .r-work_shop-r-manage-c-manage_staff--member .r-work_shop-r-manage-c-manage_staff--member_info .r-work_shop-r-manage-c-manage_staff--name,
                  .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--sidebar .r-work_shop-r-manage--sidebar_item,
                  .r-work_shop-r-details-component-project_dialog--item:not(.r-work_shop-r-details-component-project_dialog--item:hover) .r-work_shop-r-details-component-project_dialog--item_name,
                  .r-work-c-coll_user_info--container .r-work-c-coll_user_info--coll_user_list_container .r-work-c-coll_user_info--coll_user_list_title,
                  .r-work-c-coll_user_info--container .r-work-c-coll_user_info--coll_user_list_container .r-work-c-coll_user_info--coll_user_list .r-work-c-coll_user_info--coll_user_item .r-work-c-coll_user_info--coll_user_wrap .r-work-c-coll_user_info--coll_user_name,
                  .c-logout--content p a,
                  .commons-styles--agree_cont,
                  .commons-styles--agree_cont a
                  {
                      color:#fffa!important
                  }
                  .r-home-c-work_card--work_card,
                  .r-home-c-box3_recommend--workCard,
                  .r-home-c-box3_recommend--recommend_work .r-home-c-box3_recommend--work_list .r-home-c-box3_recommend--workCard .r-home-c-box3_recommend--workID h1,
                  .r-home-c-box3_recommend--recommend_work .r-home-c-box3_recommend--work_list .r-home-c-box3_recommend--workCard .r-home-c-box3_recommend--workAuth .r-home-c-box3_recommend--WordUser,
                  .r-home-c-box3_community--workCard,
                  .r-home-c-box3_community--recommend_work .r-home-c-box3_community--work_list .r-home-c-box3_community--workCard .r-home-c-box3_community--workID h1,
                  .r-home-c-box3_community--recommend_work .r-home-c-box3_community--work_list .r-home-c-box3_community--workCard .r-home-c-box3_community--workAuth .r-home-c-box3_community--WordUser,
                  .r-home-c-novel_area--content,
                  .r-home-c-code_tv--tv_list .r-home-c-code_tv--tv_item,
                  .r-home-c-community_star--user_recommend_cont .r-home-c-community_star--user_recommend_item,
                  .r-discover-c-workcard--work_item,
                  .r-home-c-creativityComponent--creativity .r-home-c-creativityComponent--box .r-home-c-creativityComponent--detail .r-home-c-creativityComponent--text-box,
                  .r-home-c-creativityComponent--creativity .r-home-c-creativityComponent--box .r-home-c-creativityComponent--detail .r-home-c-creativityComponent--text-box .r-home-c-creativityComponent--footer .r-home-c-creativityComponent--info,
                  .r-course-c-course-item--course .r-course-c-course-item--content,
                  .r-work_shop--container .r-work_shop--work_lv_cont,
                  .r-work_shop-c-work_shop_card--card_item,
                  .r-work_shop--work_list_loading,
                  .r-work_shop--search_container,
                  .r-community--bulletin_container,
                  .r-community--bulletin_text,
                  .r-community--notic_container,
                  .r-community--search_container,
                  .r-community--search_container .r-community--my_options,
                  .r-community--board_container,
                  .r-home-c-course_item--course .r-home-c-course_item--content,
                  .r-home-c-course--more_course_card,
                  .r-community--forum_filter,
                  .r-community--forum_filter .r-community--filter_tab:hover,
                  .r-community--forum_filter .r-community--filter_tab.r-community--active,
                  .r-community--page_contianer,
                  .r-community--content_container,
                  .r-mall-r-home--title_all .r-mall-r-home--title .r-mall-r-home--tap.r-mall-r-home--select,
                  .r-mall-r-home--theme_container .r-mall-r-home--theme_list .r-mall-r-home--create_theme_item, .r-mall-r-home--theme_container .r-mall-r-home--theme_list .r-mall-r-home--theme_item,
                  .r-gallery-c-theme_card--card_item,
                  .c-navigator--header-content .c-navigator--nav_wrap .c-navigator--dropdown,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown.c-navigator--user-dropdown .c-navigator--dropdown-wrap,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown .c-navigator--dropdown-wrap,
                  .c-navigator--header-content .c-navigator--ide_link .c-navigator--drop_down .c-navigator--cont,
                  .r-user-c-banner--banner .r-user-c-banner--nav-box,
                  .r-user-c-slide-panel--top,
                  .r-user-c-slide-panel--middle,
                  .r-user-c-button-panel--bottom,
                  .r-user-c-autoTextArea--textarea,
                  .r-user-r-main--content,
                  .r-user-c-game--game-card .r-user-c-game--content-box,
                  .r-user-r-project--project .r-user-r-project--block,
                  .r-user-r-collect--collect .r-user-r-collect--block,
                  .r-user-r-project--project .r-user-r-project--card-list,
                  .r-user-r-attention--attention .r-user-r-attention--block,
                  .r-user-c-person--person.r-user-c-person--normal,
                  .r-user-c-nav-bar--bar, .r-user-c-nav-bar--bar .r-user-c-nav-bar--title,
                  .r-user-r-fans--fans .r-user-r-fans--block,
                  .r-user-r-attention--attention .r-user-r-attention--card-list,
                  .r-user-r-fans--fans .r-user-r-fans--card-list,
                  .r-community-r-detail--forum_container,
                  .r-community-r-detail--forum_comments_container,
                  .r-community-r-detail--comment_sender,
                  div.mce-edit-area,
                  .r-message--container .r-message--nav_cont,
                  .r-message--container .r-message--message_container,
                  .r-work-c-comment_area--comment_container,
                  .r-work-c-author_info--author_info_card,
                  .r-work-c-work_info--container,
                  .r-work--no_content,
                  .r-work--work_detail_container,
                  .r-work-c-work_container--work_list,
                  .r-work-c-work_container--work_recommend_list,
                  .r-work-c-work_interaction--work_interaction_container .r-work-c-work_interaction--button_wrap .r-work-c-work_interaction--report_btn .r-work-c-work_interaction--button,
                  .mce-container-body.mce-flow-layout,
                  .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_bottom .r-community-r-detail-c-comment_reply--reply_sender .r-community-r-detail-c-comment_reply--reply_editor,
                  .c-model_box--dialog_wrap .c-model_box--content_box .c-model_box--title,
                  .r-community-c-forum_sender--container,
                  .c-model_box--dialog_wrap.c-model_box--visiable .c-model_box--content_box,
                  .r-community-c-forum_sender--container .r-community-c-forum_sender--form_item .r-community-c-forum_sender--title_input,
                  .r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_wrap,
                  .r-work_shop-c-user_card--user_item:not(.r-work_shop-c-user_card--one_bg),
                  .c-work_card--work_item,
                  .c-work_card--work_item .c-work_card--work_detail,
                  .c-comment--comment_container,
                  .c-comment-c-comment_editor--content_container .c-comment-c-comment_editor--editor,
                  .c-comment-c-comment_reply--reply_container .c-comment-c-comment_reply--reply_bottom .c-comment-c-comment_reply--reply_sender .c-comment-c-comment_reply--reply_editor,
                  .c-post_list--container,
                  .c-post_box-post_cont--post_cont,
                  .c-post_box-post_cont--post_cont .c-post_box-post_cont--search_form input,
                  .r-work_shop-r-details--community_wrap .r-work_shop-r-details--community_cont .r-work_shop-r-details--left_cont,
                  .c-post_box-forum_sender--container .c-post_box-forum_sender--form_item .c-post_box-forum_sender--title_input,
                  .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap,
                  .r-gallery-r-detail--container .r-gallery-r-detail--community_wrap .r-gallery-r-detail--community_cont .r-gallery-r-detail--left_cont,
                  .r-gallery-c-user_card--user_item,
                  .r-studio--cont .r-studio--center_cont,
                  .r-studio--right_wrap .r-studio--right_cont,
                  .r-studio--right_wrap .r-studio--search_form input,
                  #mceu_20,
                  .r-work-c-work_activity--container,
                  .r-setting--main_area .r-setting--setting_panel,
                  .r-setting--left_area,
                  .r-setting--setting_form .r-setting--form_item .r-setting--text_input,
                  .r-setting--account_setting .r-setting--setting_btn.r-setting--relieve,
                  .r-setting-component-date_picker--form_select,
                  .r-work-c-comment_area-c-comment_editor--content_container .r-work-c-comment_area-c-comment_editor--editor,
                  .r-work_manager-c-sidebar--sidebar,
                  .r-work_manager-c-normal_work_card--normal_work_card,
                  .r-work_manager--work_manager_wrap .r-work_manager--content_wrap .r-work_manager--content_container .r-work_manager--content .r-work_manager--blank_content,
                  .r-work_manager-c-wood_work_card--wood_card,
                  .r-work_manager-c-release_dialog--release_dialog,
                  .r-work_manager-c-coco_work_card--nemo_work_card,
                  .r-work_manager-c-recycle_normal_card--recycle_normal_card,
                  .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--manage_content .r-work_shop-r-manage--header,
                  .r-work_shop-r-manage-c-check_apply--apply_wrap .r-work_shop-r-manage-c-check_apply--apply_list.r-work_shop-r-manage-c-check_apply--no_apply,
                  .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap,
                  .r-work_shop-r-manage-c-manage_staff--member_list_wrap .r-work_shop-r-manage-c-manage_staff--member_list .r-work_shop-r-manage-c-manage_staff--member,
                  .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--sidebar,
                  .r-work-c-coll_user_info--container,
                  .c-logout--content,
                  .c-dialog-c-sign_box--main_content,
                  .commons-styles--input.commons-styles--input-focus, .commons-styles--input.commons-styles--input-yanzhengCode.commons-styles--input-focus, .commons-styles--input:focus,
                  .commons-styles--input
                  {
                      background:#525252 !important;
                      color:#fff !important
                  }
                  .r-home-c-work_card--work_card .r-home-c-work_card--author{
                      border-top-color:#666666!important
                  }
                  .r-home-c-box3_community--recommend_work .r-home-c-box3_community--work_list .r-home-c-box3_community--workCard .r-home-c-box3_community--workID,
                  .r-discover-c-banner--banner_cont,
                  .r-community--notic_container .r-community--notic_title{
                      border-bottom-color:#666666!important
                  }
                  .r-home-c-section_header--section_header .r-home-c-section_header--title .r-home-c-section_header--icon.r-home-c-section_header--novel{
                      background: url(https://static.codemao.cn/coco/player/unstable/SJaUKSyNs.image/svg+xml?hash=FjCtfA_Eqw6v52eJLTK2bmMNxcFH) no-repeat -492px -104px;
                  }
                  .r-discover-c-workcard--line,
                  .r-community--board_container .r-community--board_list .r-community--board_item.r-community--active, .r-community--board_container .r-community--board_list .r-community--board_item:hover,
                  .r-gallery-c-theme_card--card_item .r-gallery-c-theme_card--bottom_cont .r-gallery-c-theme_card--line,
                  .c-navigator--header-content .c-navigator--nav_wrap .c-navigator--dropdown .c-navigator--dropdown_item a:hover,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown .c-navigator--dropdown-wrap li:hover,
                  .c-navigator--header-content .c-navigator--ide_link .c-navigator--drop_down .c-navigator--cont .c-navigator--item:hover,
                  .mce-btn button:hover,
                  .c-pagination--canClick:hover,
                  .forum_editor .mce-btn.mce-active button,
                  .c-work_card--work_item .c-work_card--line,
                  .c-comment-c-comment_reply--reply_container,
                  .r-work-c-comment_area-c-comment_reply--reply_container,
                  .r-work_manager-c-sidebar--sidebar .r-work_manager-c-sidebar--recycle_btn,
                  .index__wiki-cont-wrap-left___3z8Qx,
                  .index__tip-box-wrap___3onXb
                  {
                      background-color:#666666!important
                  }
                  .r-home-c-community_star--user_recommend_cont .r-home-c-community_star--user_recommend_item .r-home-c-community_star--angle{
                      border-bottom-color:#525252!important
                  }
                  .r-community--forum_filter .r-community--filter_tab,
                  input::-webkit-input-placeholder,
                  .r-community-r-detail--comment_sender .r-community-r-detail--sender_container .r-community-r-detail--options .r-community-r-detail--roules_btn,
                  .index__novel-recommend-item___1HYuh .index__novel-recommend-des___2FiVu,
                  .r-user-c-bad--bad .r-user-c-bad--bad1,
                  .commons-styles--forget, .commons-styles--login-option a
                  {
                      color: #fffa!important;
                  }
                  .r-community--forum_filter .r-community--filter_tab,
                  .r-community--search_form input,
                  .c-post_list--post_body,
                  .r-mall-r-home--search_form input,
                  .r-user-c-bad--bad {
                      background:#525252 !important;
                  }
                  .r-work_shop--bottom_cont{
                      background-image: url(https://static.codemao.cn/coco/player/unstable/r1YV1514s.image/png?hash=FoCb3Yjtq00edPOKyBzCW1PiIUw0)!important;
                  }
                  .r-community--notic_item_icon.r-community--sort_0, .r-community--notic_item_icon.r-community--sort_1{
                      background-color: #000!important;
                  }
                  .r-community--notic_item_icon.r-community--sort_2, .r-community--notic_item_icon.r-community--sort_3{
                      background-color: #000a!important;
                  }
                  .r-community--search_container .r-community--my_options,
                  .r-community--search_container .r-community--my_options .r-community--option:first-child,
                  .r-home-c-creativityComponent--title-box,
                  .c-post_list--post_container, .c-post_list--post_list_header,
                  .r-community--forum_filter,
                  .r-mall-r-home--categories_wrap,
                  .r-gallery--container .r-gallery--theme_container .r-gallery--title_all,
                  .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message-dropdown .c-navigator--dropdown-wrap li .c-navigator--logout,
                  .r-user-c-banner--banner .r-user-c-banner--nav-box,
                  .r-user-c-slide-panel--top,
                  .r-user-c-slide-panel--middle,
                  .r-user-c-button-panel--bottom,
                  .r-user-r-main--content,
                  .c-model_box--dialog_wrap .c-model_box--content_box .c-model_box--title,
                  .forum_editor .mce-tinymce.mce-container.mce-panel,
                  .r-setting--main_area .r-setting--setting_classes,
                  .c-dialog-c-sign_box--main_content .c-dialog-c-sign_box--tap_cont
                  {
                      border-color:#666666!important
                  }
                  .r-community--option:hover,
                  .r-user-c-slide-panel--top.r-user-c-slide-panel--special .r-user-c-slide-panel--item:hover,
                  .r-user-c-slide-panel--top.r-user-c-slide-panel--special .r-user-c-slide-panel--item.r-user-c-slide-panel--checked,
                  .r-community-r-detail-c-comment_reply--reply_container,
                  .r-message-c-comments--comments_list .r-message-c-comments--comments_item .r-message-c-comments--contnet .r-message-c-comments--reply_cont,
                  .r-message-c-buy--buy_list .r-message-c-buy--buy_item .r-message-c-buy--contnet .r-message-c-buy--reply_cont,
                  .c-work_item--work_item:hover,
                  .r-setting--left_area a:hover,
                  .r-setting--account_setting .r-setting--setting_btn.r-setting--relieve:hover
                  {
                      background-color:#666666!important
                  }
                  .r-community--forum_filter .r-community--filter_tab.r-community--active span,
                  .r-message--container .r-message--nav_item.r-message--cur_nav:after,
                  .r-work_shop-r-details--details_wrap .r-work_shop-r-details--header_cont .r-work_shop-r-details--nav_cont .r-work_shop-r-details--nav.r-work_shop-r-details--select:after,
                  .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li.r-gallery-r-detail--select:after,
                  .c-dialog-c-sign_box--main_content .c-dialog-c-sign_box--tap_cont .c-dialog-c-sign_box--item.c-dialog-c-sign_box--select:after
                  {
                      background-color:#fff!important
                  }
                  .r-user-c-banner--banner .r-user-c-banner--nav-box ul p.r-user-c-banner--active span{
                      border-color:#fff!important
                  }
                  .r-user-c-icon--icon .r-user-c-icon--icon-view{
                      background: url(https://cdn-community.codemao.cn/community_frontend/asset/icon_sprite_1fd27.svg) no-repeat -82px -3px;
                  }
                  .r-user-c-icon--icon .r-user-c-icon--icon-like{
                      background: url(https://cdn-community.codemao.cn/community_frontend/asset/icon_sprite_1fd27.svg) no-repeat -2px -3px;
                  }
                  .r-community-r-detail-c-comment_item--content_container .r-community-r-detail-c-comment_item--content{
                      color:#ddd!important
                  }
                  .r-community-r-detail-c-comment_item--content_container .r-community-r-detail-c-comment_item--author .r-community-r-detail-c-comment_item--author_link,
                  .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_item .r-community-r-detail-c-comment_reply--content_container .r-community-r-detail-c-comment_reply--author .r-community-r-detail-c-comment_reply--author_link,
                  .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_bottom .r-community-r-detail-c-comment_reply--preview a,
                  .r-community-r-detail--forum_container .r-community-r-detail--forum_user_info .r-community-r-detail--author .r-community-r-detail--author_link,
                  .r-message-c-buy--buy_list .r-message-c-buy--buy_item .r-message-c-buy--contnet p .r-message-c-buy--name,
                  .r-message-c-comments--comments_list .r-message-c-comments--comments_item .r-message-c-comments--contnet p .r-message-c-comments--name,
                  .r-message-c-system_message--system_list .r-message-c-system_message--system_item .r-message-c-system_message--contnet .r-message-c-system_message--user_name,
                  .index__my-question___2I98d,
                  .index__tipTitle___MZgHE p,
                  .index__novel-recommend-item___1HYuh .index__novel-recommend-tit___e0WTT,
                  .index__tip-box-wrap___3onXb .index__tipBoxCont___V-04z,
                  .index__tipBoxCont___V-04z a,
                  .index__novel_like_cont___BiHqI p{
                      color:#ddd!important
                  }
                  .r-community-r-detail-c-comment_item--content_container .r-community-r-detail-c-comment_item--author .r-community-r-detail-c-comment_item--right_options .r-community-r-detail-c-comment_item--icon_menu,
                  .r-community-r-detail--forum_container .r-community-r-detail--forum_title .r-community-r-detail--right_options .r-community-r-detail--icon_menu,
                  .r-work-c-player--work_player_container .r-work-c-player--player_fun .r-work-c-player--player_refresh i,
                  .r-work-c-player--work_player_container .r-work-c-player--player_fun .r-work-c-player--player_full_screen i,
                  .r-work-c-work_interaction--work_interaction_container .r-work-c-work_interaction--button_wrap .r-work-c-work_interaction--report_btn i,
                  .c-model_box--dialog_wrap .c-model_box--content_box .c-model_box--close.c-model_box--bind_phone_close i{
                      filter: drop-shadow(100vw 0px 0px #fff);
                      transform: translateX(-100vw);
                  }
                  .r-work_manager--work_manager_wrap .r-work_manager--content_wrap .r-work_manager--content_container .r-work_manager--content .r-work_manager--blank_content .r-work_manager--wrap .r-work_manager--empty_img,
                  .r-work_shop-r-manage-c-check_apply--apply_wrap .r-work_shop-r-manage-c-check_apply--apply_list .r-work_shop-r-manage-c-check_apply--no_apply_wrap .r-work_shop-r-manage-c-check_apply--no_apply_img,
                  .r-work_shop-r-details-component-project_dialog--empty .r-work_shop-r-details-component-project_dialog--empty_img,
                  .r-user-c-bad--bad .r-user-c-bad--background {
                      filter: invert(0.68);
                  }
                  </style>
                  `);
        }
        $("body").after(`<style id="custom-setts"></style>`);
        $("#custom-sett textarea").on("change", () => {
          localStorage.setItem("custom-sett", document.querySelector("#custom-sett textarea").value);
          document.querySelector("#custom-setts").innerHTML = document.querySelector("#custom-sett textarea").value;
        });
        $("input#main-color").on("change", () => {
          localStorage.setItem("main-color", document.querySelector("input#main-color").value);
          if (theme == "light") {
            document.documentElement.style.setProperty("--main-color", document.querySelector("input#main-color").value);
            document.querySelector('meta[name="theme-color"]').content = localStorage.getItem("main-color") || "#fec433";
          }
        });
        $("input#second-color").on("change", () => {
          if (theme == "light") {
            document.documentElement.style.setProperty("--second-color", document.querySelector("input#second-color").value);
          }
          localStorage.setItem("second-color", document.querySelector("input#second-color").value);
        });
        $("input#highlight-color").on("change", () => {
          document.documentElement.style.setProperty("--highlight-color", document.querySelector("input#highlight-color").value);
          localStorage.setItem("highlight-color", document.querySelector("#highlight-color").value);
        });
        $("input#level-shown").on("change", () => {
          if (document.querySelector("input#level-shown").checked) {
            document.documentElement.style.setProperty("--isLevelShown", "");
            localStorage.setItem("isLevelShown", "");
          } else {
            document.documentElement.style.setProperty("--isLevelShown", "none");
            localStorage.setItem("isLevelShown", "none");
          }
        });
        $("input#auto-turn").on("change", () => {
          if (document.querySelector("input#auto-turn").checked) {
            localStorage.setItem("auto-turn", "true");
          } else {
            localStorage.setItem("auto-turn", "");
            swal("将要刷新页面以保存修改", { buttons: ["取消", "确认"] }).then((value) => {
              if (value) {
                window.location.reload();
              }
            });
          }
        });
        $("input#md-use").on("change", () => {
          if (document.querySelector("input#md-use").checked) {
            localStorage.setItem("md-use", "true");
          } else {
            localStorage.setItem("md-use", "");
            remove_md();
          }
        });
        $("input#customLogo").on("change", () => {
          localStorage.setItem("customLogo", document.querySelector("input#customLogo").value);
          $(".c-navigator--logo_wrap img").remove();
          let PICKCAT = localStorage.getItem("customLogo") || "PICKCAT";
          if (document.querySelector(".pickcat")) {
            document.querySelector(".pickcat").innerHTML = PICKCAT;
          } else {
            $(".c-navigator--logo_wrap").append(`<span class='pickcat'>${PICKCAT}</span>`);
          }
        });
        $('input[value="pic"]').on("change", () => {
          document.documentElement.style.setProperty("--person-color", "");
          document.documentElement.style.setProperty(
            "--person-bg",
            localStorage.getItem("person-bg") || "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)"
          );
          localStorage.setItem("person-setting", "pic");
          document.documentElement.style.setProperty("--person-setting", "pic");
          document.querySelector("#person-bg-btn").style.display = "block";
          document.querySelector("#person-color").style.display = "none";
          if (window.location.href.indexOf("user") != -1 && response.user_id != parseInt(window.location.href.slice(25 + 5))) {
            $.ajax({
              type: "GET",
              url: "https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=" + parseInt(window.location.href.slice(25 + 5)),
              contentType: "application/json;charset=UTF-8",
              dataType: "json",
              xhrFields: {
                withCredentials: true,
              },
              success: function (response) {
                if (response.user_cover == "") {
                  document.documentElement.style.setProperty("--person-bg", "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)");
                  document.documentElement.style.setProperty("--person-color", "");
                } else {
                  document.documentElement.style.setProperty("--person-bg", "url(" + response.user_cover + ")");
                  document.documentElement.style.setProperty("--person-color", "");
                }
              },
            });
          }
        });
        $('input[value="color"]').on("change", () => {
          document.documentElement.style.setProperty("--person-color", localStorage.getItem("person-color") || "#000");
          document.documentElement.style.setProperty("--person-bg", "");
          localStorage.setItem("person-setting", "color");
          document.documentElement.style.setProperty("--person-setting", "color");
          document.querySelector("#person-bg-btn").style.display = "none";
          document.querySelector("#person-color").style.display = "block";
          if (window.location.href.indexOf("user") != -1 && response.user_id != parseInt(window.location.href.slice(25 + 5))) {
            $.ajax({
              type: "GET",
              url: "https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=" + parseInt(window.location.href.slice(25 + 5)),
              contentType: "application/json;charset=UTF-8",
              dataType: "json",
              xhrFields: {
                withCredentials: true,
              },
              success: function (response) {
                if (response.user_cover == "") {
                  document.documentElement.style.setProperty("--person-bg", "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)");
                  document.documentElement.style.setProperty("--person-color", "");
                } else {
                  document.documentElement.style.setProperty("--person-bg", "url(" + response.user_cover + ")");
                  document.documentElement.style.setProperty("--person-color", "");
                }
              },
            });
          }
        });
        $("input[fish]").on("change", function () {
          if (document.querySelector('li[data-watch_event="' + this.value + '-入口tab"]')) {
            document.querySelector('li[data-watch_event="' + this.value + '-入口tab"]').style.display = this.checked ? "" : "none";
          } else {
            for (h of document.querySelectorAll(".index__first-nav-content___1Ea0w")) {
              if (
                h.getElementsByTagName("a")[0].innerHTML == this.value ||
                (h.getElementsByTagName("a")[0].getElementsByTagName("span")[1] && h.getElementsByTagName("a")[0].getElementsByTagName("span")[1].innerHTML == this.value)
              ) {
                h.style.display = this.checked ? "" : "none";
              }
            }
          }

          localStorage.setItem("isShown" + this.value, this.checked);
        });
        $("input[fish2]").on("change", function () {
          document.documentElement.style.setProperty(this.value, this.checked ? "" : "none");
          localStorage.setItem(this.value, this.checked ? "" : "none");
        });

        $('input[value="light"]').on("change", function () {
          localStorage.setItem("theme", "light");
          to_light();
        });
        $('input[value="dark"]').on("change", function () {
          localStorage.setItem("theme", "dark");
          to_dark();
        });
        $('input[value="auto"]').on("change", function () {
          localStorage.setItem("theme", "auto");
          if (!window.matchMedia("(prefers-color-scheme: light)").matches) {
            to_dark();
          } else {
            to_light();
          }
        });
        let junkComment = 0;
        let searching = 0;
        let junkCommentID = [];
        let junkContent = [];

        function afterGetJunk(workid) {
          // console.log(junkComment, junkCommentID);
          let junkCommentTotal = document.createElement("div");
          junkCommentTotal.style = `
            max-height: 400px;
            overflow: auto;
            `;
          for (let conut = 0; conut < junkComment; conut++) {
            let aaa = document.createElement("input");
            aaa.type = "checkbox";
            aaa.checked = true;
            aaa.value = junkCommentID[conut];
            let bbb = document.createElement("span");
            bbb.innerHTML = junkContent[conut];
            let ccc = document.createElement("div");
            ccc.appendChild(aaa);
            ccc.appendChild(bbb);
            ccc.style = `
              display: flex;
              justify-content: flex-start;
              align-items: baseline;
              `;
            aaa.onchange = function () {
              if (this.checked) {
                junkCommentID.push(parseInt(this.value));
              } else {
                junkCommentID.splice(junkCommentID.indexOf(parseInt(this.value)), 1);
              }
              junkComment = junkCommentID.length;
              // console.log(junkCommentID);
            };
            junkCommentTotal.appendChild(ccc);
          }
          swal({
            title: "注意",
            text: "你有" + junkComment + "条广告，是否需要直接删除",
            content: junkCommentTotal,
            icon: "info",
            buttons: ["取消", "确认"],
          }).then((value) => {
            if (value) {
              let cleaning = 0;
              let fail = 0;
              for (let id of junkCommentID) {
                $.ajax({
                  type: "DELETE",
                  url: `https://api.codemao.cn/creation-tools/v1/works/${workid}/comment/${id}`,
                  contentType: "application/json;charset=UTF-8",
                  async: true,
                  xhrFields: {
                    withCredentials: true,
                  },
                  success: function () {
                    cleaning++;
                    if (cleaning === junkComment) {
                      swal({
                        title: "成功",
                        text: "还你一个干净的评论区～",
                        icon: "success",
                      });
                    } else {
                      swal({
                        title: "清理中···",
                        text: `正在清理，现在已清理${cleaning}/${junkComment}条`,
                        icon: "info",
                        buttons: false,
                        closeOnClickOutside: false,
                        closeOnEsc: false,
                      });
                    }
                  },
                  error: function (res) {
                    if (fail !== 1) {
                      cleaning++;
                      swal({
                        title: "错误",
                        text: res.responseJSON.error_message,
                        icon: "error",
                      });
                      // console.log(res.responseJSON);
                      fail = 1;
                    }
                  },
                });
              }
              if (junkComment !== 0) {
                swal({
                  title: "清理中···",
                  text: `正在清理，现在已清理0/${junkComment}条`,
                  icon: "info",
                  buttons: false,
                  closeOnClickOutside: false,
                  closeOnEsc: false,
                });
              } else {
                swal({
                  title: "成功",
                  text: "还你一个干净的评论区～",
                  icon: "success",
                });
              }
            }
          });
        }

        function readComment(offset, workid, limit) {
          $.ajax({
            type: "GET",
            url: `https://api.codemao.cn/creation-tools/v1/works/${workid}/comments?offset=${offset}&limit=20`,
            contentType: "application/json;charset=UTF-8",
            async: true,
            xhrFields: {
              withCredentials: true,
            },
            success: function (res) {
              for (let com of res.items) {
                if (eval("/" + localStorage.getItem("JunkWord") + "/").test(com.content)) {
                  junkContent.push(`${com.id} ${com.user.nickname}:${com.content}`);
                  junkComment++;
                  junkCommentID.push(com.id);
                }
                if (com.replies) {
                  for (let rep of com.replies.items) {
                    if (eval("/" + localStorage.getItem("JunkWord") + "/").test(rep.content)) {
                      junkContent.push(`${rep.id} ${rep.reply_user.nickname}${rep.parent_user ? " 回复 " + rep.parent_user.nickname : ""}:${rep.content}`);
                      junkComment++;
                      junkCommentID.push(com.id);
                    }
                  }
                }
                searching++;
                swal({
                  title: "查找中···",
                  text: `正在查找垃圾评论，目前进度${searching}/${limit}`,
                  icon: "info",
                  buttons: false,
                  closeOnClickOutside: false,
                  closeOnEsc: false,
                });
              }
              if (offset < limit) {
                readComment(offset + 20, workid, limit);
              } else {
                afterGetJunk(workid);
              }
            },
            error: function (res) {
              swal({
                title: "错误",
                text: res.responseJSON.error_message,
                icon: "error",
              });
              // console.log(res.responseJSON);
            },
          });
        }

        $("#Junkcomment-btn").on("click", () => {
          if (!localStorage.getItem("JunkWord")) {
            localStorage.setItem("JunkWord", "(点|点个|互|给个)(赞|再创作|收藏|关|关注)|不喜可删|广告|(升|冲)(高手|传说|大佬)|协作项目|(来|可以)看一下(我的|我的作品)|已赞");
          }
          swal("请选择你的操作（如果你不懂正则表达式，请选择添加，否则选择修改）", {
            buttons: {
              add: {
                text: "添加屏蔽词",
              },
              change: {
                text: "修改屏蔽词",
              },
              watch: {
                text: "查看屏蔽词",
              },
            },
          }).then((value) => {
            switch (value) {
              case "add":
                swal("请输入你要添加的单个屏蔽词", {
                  content: "input",
                }).then((value) => {
                  if (value) {
                    localStorage.setItem("JunkWord", localStorage.getItem("JunkWord") + "|" + value);
                  }
                });
                break;
              case "change":
                var inputment = document.createElement("input");
                inputment.className = "swal-content__input";
                inputment.value = localStorage.getItem("JunkWord");
                swal("请输入你要修改的正则表达式", {
                  content: inputment,
                }).then((value) => {
                  if (value && inputment.value) {
                    localStorage.setItem("JunkWord", inputment.value);
                  }
                });
                break;
              case "watch":
                swal({
                  title: "你的正则表达式为",
                  text: localStorage.getItem("JunkWord"),
                  icon: "info",
                });
                break;
              default:
                break;
            }
          });
        });

        $("#commentCheck-btn").on("click", () => {
          if (!localStorage.getItem("JunkWord")) {
            localStorage.setItem("JunkWord", "(点|点个|互|给个)(赞|再创作|收藏|关|关注)|不喜可删|广告|(升|冲)(高手|传说|大佬)|协作项目|(来|可以)看一下(我的|我的作品)|已赞");
          }
          var inputment = document.createElement("input");
          inputment.className = "swal-content__input";
          if (window.location.href.indexOf("work/") != -1 && parseInt(window.location.href.slice(25 + 5))) {
            inputment.value = parseInt(window.location.href.slice(25 + 5));
          } else {
            inputment.value = "";
          }
          swal("请输入你要查询的作品ID", {
            content: inputment,
          }).then((value) => {
            if (value) {
              if (inputment.value != "") {
                $.ajax({
                  type: "GET",
                  url: `https://api.codemao.cn/creation-tools/v1/works/${inputment.value}/comments?offset=0&limit=5`,
                  contentType: "application/json;charset=UTF-8",
                  dataType: "json",
                  xhrFields: {
                    withCredentials: true,
                  },
                  success: function (response) {
                    if (response == undefined) {
                      swal({
                        title: "错误",
                        text: "未知原因",
                        icon: "error",
                      });
                    } else if (response.error_message !== undefined) {
                      swal({
                        title: "错误",
                        text: response.error_message,
                        icon: "error",
                      });
                    } else {
                      junkComment = 0;
                      junkCommentID = [];
                      searching = 0;
                      junkContent = [];
                      readComment(0, inputment.value, response.page_total);
                      swal({
                        title: "查找中···",
                        text: `正在查找垃圾评论，目前进度0/${response.page_total}`,
                        icon: "info",
                        buttons: false,
                        closeOnClickOutside: false,
                        closeOnEsc: false,
                      });
                    }
                  },
                });
              } else {
                swal({
                  title: "错误",
                  text: "请输入作品ID！",
                  icon: "error",
                });
              }
            }
          });
        });

        $("#person-color").on("change", function () {
          document.documentElement.style.setProperty("--person-color", this.value);
          localStorage.setItem("person-color", this.value);
        });
        $("#person-bg-btn").on("click", function () {
          document.querySelector("#person-bg").click();
        });
        if (localStorage.getItem("isLevelShown") == "none") {
          document.querySelector("input#level-shown").checked = false;
        } else {
          document.querySelector("input#level-shown").checked = true;
        }
        var i, h;
        for (i of document.querySelectorAll("input[fish]")) {
          if (localStorage.getItem("isShown" + i.value) != null) {
            if (localStorage.getItem("isShown" + i.value) == "true") {
              if (document.querySelector('li[data-watch_event="' + i.value + '-入口tab"]')) {
                document.querySelector('li[data-watch_event="' + i.value + '-入口tab"]').style.display = "";
                i.checked = true;
              } else if (document.querySelector(".index__first-nav-content___1Ea0w")) {
                for (h of document.querySelectorAll(".index__first-nav-content___1Ea0w")) {
                  if (
                    h.getElementsByTagName("a")[0].innerHTML == i.value ||
                    (h.getElementsByTagName("a")[0].getElementsByTagName("span")[1] && h.getElementsByTagName("a")[0].getElementsByTagName("span")[1].innerHTML == i.value)
                  ) {
                    h.style.display = "";
                    i.checked = true;
                  }
                }
              }
            } else {
              if (document.querySelector('li[data-watch_event="' + i.value + '-入口tab"]')) {
                document.querySelector('li[data-watch_event="' + i.value + '-入口tab"]').style.display = "none";
                i.checked = false;
              } else if (document.querySelector(".index__first-nav-content___1Ea0w")) {
                for (h of document.querySelectorAll(".index__first-nav-content___1Ea0w")) {
                  if (
                    h.getElementsByTagName("a")[0].innerHTML == i.value ||
                    (h.getElementsByTagName("a")[0].getElementsByTagName("span")[1] && h.getElementsByTagName("a")[0].getElementsByTagName("span")[1].innerHTML == i.value)
                  ) {
                    h.style.display = "none";
                    i.checked = false;
                  }
                }
              }
            }
          }
        }
        for (i of document.querySelectorAll("input[fish2]")) {
          if (localStorage.getItem(i.value) != null) {
            if (localStorage.getItem(i.value) == "none") {
              document.documentElement.style.setProperty(i.value, "none");
              i.checked = false;
            } else {
              document.documentElement.style.setProperty(i.value, "");
              i.checked = true;
            }
          }
        }
        $("#person-bg").on("change", function () {
          var file = this.files[0];
          if (!/image\/\w+/.test(file.type)) {
            return false;
          }
          if (typeof FileReader != "undefined") {
            var reader = new FileReader();
            var imgFile;
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              imgFile = e.target.result;
              document.documentElement.style.setProperty("--person-bg", "url(" + imgFile + ")");
              localStorage.setItem("person-bg", "url(" + imgFile + ")");
            };
          } else {
            var URL = window.URL || window.webkitURL;
            var imageURL = URL.createObjectURL(file);
            document.documentElement.style.setProperty("--person-bg", "url(" + imageURL + ")");
            localStorage.setItem("person-bg", "url(" + imageURL + ")");
          }
        });
        function remixCheck(num, list) {
          if (num.length == 0) {
            return list;
          }
          for (var a of num) {
            if (a.is_published == 1 || a.is_published == 0) {
              try {
                list[0].push(a.id);
                list[1].push(a.author.nickname);
                list[2].push(a.is_published);
              } catch (e) {}
            }
            if (a.children != "[]") {
              remixCheck(a.children);
            }
          }
          return list;
        }
        $("#remixCheck-btn").on("click", () => {
          var inputment = document.createElement("input");
          inputment.className = "swal-content__input";
          if (window.location.href.indexOf("work/") != -1 && parseInt(window.location.href.slice(25 + 5))) {
            inputment.value = parseInt(window.location.href.slice(25 + 5));
          } else {
            inputment.value = "";
          }
          swal("请输入你要查询的作品ID", {
            content: inputment,
          }).then((value) => {
            if (value) {
              if (inputment.value != "") {
                $.ajax({
                  type: "GET",
                  url: "https://api.codemao.cn/tiger/work/tree/" + inputment.value,
                  contentType: "application/json;charset=UTF-8",
                  dataType: "json",
                  xhrFields: {
                    withCredentials: true,
                  },
                  success: function (response) {
                    if (response == undefined) {
                      swal({
                        title: "错误",
                        text: "未知原因",
                        icon: "error",
                      });
                    } else if (response.children == undefined) {
                      swal({
                        title: "错误",
                        text: "请检查一下自己的作品ID是否输入正确！",
                        icon: "error",
                      });
                    } else {
                      var s = remixCheck(response.children, [[], [], []]);
                      if (s[0].length != 0) {
                        var copymefuck = document.createElement("table");
                        copymefuck.style = "width:100%;border-spacing: 10px;";
                        for (var ppp = 0; ppp < s[0].length; ppp++) {
                          var aaa = document.createElement("tr");
                          aaa.setAttribute("published", s[2][ppp]);
                          aaa.innerHTML +=
                            "<td><a style='color:var(--main-color)' target='_blank' href='https://shequ.codemao.cn/work/" +
                            s[0][ppp] +
                            "'>" +
                            s[0][ppp] +
                            "</a></td><td>" +
                            s[1][ppp] +
                            "</td>";
                          copymefuck.appendChild(aaa);
                        }

                        swal({
                          content: copymefuck,
                          title: "有" + s[0].length + "个再创作了！",
                          icon: "warning",
                        });
                        document.querySelector(".swal-content").style = "max-height: 400px;overflow: auto;";
                        $(copymefuck).before("<p id='hidenotpub' class='pubornot'>隐藏未发布的</p>");
                        $(copymefuck).before(`<p>原作品ID：<a href="https://shequ.codemao.cn/work/${response.id}" target="_blank">${response.id}</a></p>`);
                        $(".pubornot").on("click", function () {
                          if (document.querySelector(".pubornot").id == "hidenotpub") {
                            $('tr[published="0"]').css("display", "none");
                            document.querySelector(".swal-title").innerHTML = "有" + document.querySelectorAll('tr[published="1"]').length + "个再创作并发布的了！";
                            document.querySelector(".pubornot").id = "shownotpub";
                            document.querySelector(".pubornot").innerHTML = "显示未发布的";
                          } else {
                            $('tr[published="0"]').css("display", "");
                            document.querySelector(".swal-title").innerHTML = "有" + s[0].length + "个再创作了！";
                            document.querySelector(".pubornot").id = "hidenotpub";
                            document.querySelector(".pubornot").innerHTML = "隐藏未发布的";
                          }
                        });
                      } else {
                        swal({
                          title: "好耶！",
                          text: "目前没有人再创作并发布此作品！",
                          icon: "success",
                        });
                      }
                    }
                  },
                });
              } else {
                swal({
                  title: "错误",
                  text: "请输入作品ID！",
                  icon: "error",
                });
              }
            }
          });
        });
        $("#username-btn").on("click", () => {
          var inputment = document.createElement("input");
          inputment.className = "swal-content__input";
          swal({
            title: "请输入你要更改的登录用户名",
            text: "这个用户名将作为你的登录账号使用",
            content: inputment,
          }).then((value) => {
            if (value) {
              if (inputment.value != "") {
                swal({
                  title: "警告",
                  text: `你的用户名是：${inputment.value}\n这里作再三强调，只能修改一次\n你确定吗？`,
                  icon: "warning",
                  dangerMode: true,
                  buttons: true,
                }).then((value) => {
                  if (value) {
                    $.ajax({
                      type: "PATCH",
                      url: "https://api.codemao.cn/tiger/v3/web/accounts/username",
                      contentType: "application/json;charset=UTF-8",
                      data: JSON.stringify({
                        username: inputment.value,
                      }),
                      dataType: "json",
                      xhrFields: {
                        withCredentials: true,
                      },
                      success: function () {
                        swal({
                          title: "成功",
                          text: `你现在的用户名是：${inputment.value}\n以后你就可以用这个来登录你的编程猫账号了！`,
                          icon: "success",
                        });
                      },
                      error: function (res) {
                        swal({
                          title: "错误",
                          text: res.responseJSON.error_message,
                          icon: "error",
                        });
                        // console.log(res.responseJSON);
                      },
                    });
                  }
                });
              } else {
                swal({
                  title: "错误",
                  text: "请输入用户名！",
                  icon: "error",
                });
              }
            }
          });
        });
        /*这里不知道为啥不能for整，所以只好这样*/
        $("#mess-del-btn").on("click", () => {
          swal({
            text: "开始清除！",
            buttons: false,
            timer: 3000,
          });
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/web/message-record?query_type=LIKE_FORK&limit=200&offset=0",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              for (var y = 0; y < response.total; y += 200) {
                messDel(y, "LIKE_FORK");
              }
            },
          });
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/web/message-record?query_type=SYSTEM&limit=200&offset=0",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              for (var y = 0; y < response.total; y += 200) {
                messDel(y, "SYSTEM");
              }
            },
          });
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/web/message-record?query_type=COMMENT_REPLY&limit=200&offset=0",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              for (var y = 0; y < response.total; y += 200) {
                messDel(y, "COMMENT_REPLY");
              }
              swal({
                text: "你的铃铛红点已清除，再也不会急死强迫症的你了～",
                buttons: false,
                timer: 3000,
              });
            },
          });
        });

        async function messDel(offset, types) {
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/web/message-record?query_type=" + types + "&limit=200&offset=" + offset,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {},
          });
        }

        const addRipple = function (e) {
          let overlay = $("<div class='ripple'></div>");
          overlay.removeClass("animate");
          const x = parseInt(e.pageX - $(this).offset().left) - overlay.width() / 2;
          const y = parseInt(e.pageY - $(this).offset().top) - overlay.height() / 2;
          overlay
            .css({
              left: x,
              top: y,
            })
            .addClass("animate");
          $(this).append(overlay);
          setTimeout(() => {
            overlay.remove();
          }, 500);
        };
        let rippleList = [
          ".c-navigator--header-content .c-navigator--nav_wrap .c-navigator--item a",
          ".c-navigator--dropdown-wrap li a",
          ".r-community--send_btn",
          "li[data-watch_event='旋转-入口tab']",
          ".r-community-c-forum_sender--option",
          ".r-home-c-community_star--user_recommend_item",
          ".r-user-c-banner--btn",
          ".c-navigator--logout",
          ".c-navigator--cont .c-navigator--item",
          ".r-community-c-forum_sender--select_area span",
          ".r-community--forum_list div li",
          ".r-community--forum_list2 div li",
          ".r-community--board_item",
          ".r-home-c-work_card--work_card",
          ".r-community--search_container .r-community--my_options .r-community--option",
          ".r-gallery-c-theme_card--card_item",
        ];
        setInterval(() => {
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/creation-tools/v1/user/center/honor",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              var options, info;
              if (response.user_id) {
                if (Notification.permission !== "denied") {
                  Notification.requestPermission().then((permission) => {});
                }
                if (!localStorage.getItem("user" + response.user_id)) {
                  localStorage.setItem("user" + response.user_id, response.fans_total + "," + response.liked_total);
                }
                if (localStorage.getItem("user" + response.user_id).split(",")[0] != response.fans_total) {
                  info = response.fans_total - localStorage.getItem("user" + response.user_id).split(",")[0] > 0 ? "多" : "少";
                  options = {
                    body: `现在你的粉丝数为：${response.fans_total}，比上次${info}了${Math.abs(
                      response.fans_total - localStorage.getItem("user" + response.user_id).split(",")[0]
                    )}个`,
                    icon: "https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3",
                    tag: "fans_total",
                  };
                  if (n) n.close();
                  var n = new Notification("粉丝数", options); // 显示通知
                }
                if (localStorage.getItem("user" + response.user_id).split(",")[1] != response.liked_total) {
                  info = response.liked_total - localStorage.getItem("user" + response.user_id).split(",")[1] > 0 ? "多" : "少";
                  options = {
                    body: `现在你的点赞数为：${response.liked_total}，比上次${info}了${Math.abs(
                      response.liked_total - localStorage.getItem("user" + response.user_id).split(",")[1]
                    )}个`,
                    icon: "https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3",
                    tag: "liked_total",
                  };
                  if (k) k.close();
                  var k = new Notification("点赞数", options); // 显示通知
                }
                localStorage.setItem("user" + response.user_id, response.fans_total + "," + response.liked_total);
              }
            },
          });
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/web/message-record/count",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              try {
                $("li[data-watch_event='消息-评论'] a .c-navigator--reply_count").css("display", "none");
                $("li[data-watch_event='消息-赞'] a .c-navigator--reply_count").css("display", "none");
                $("li[data-watch_event='消息-系统'] a .c-navigator--reply_count").css("display", "none");
                $(".c-navigator--message span").css("display", "none");
              } catch (error) {}
              if (response[0]) {
                if (response[0].count == 0) {
                  if (document.querySelector("li[data-watch_event='消息-评论'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-评论'] a .c-navigator--reply_count").css("display", "none");
                  } else if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] .index__reply_count___1nqAb").css("display", "none");
                  }
                } else {
                  if (document.querySelector("li[data-watch_event='消息-评论'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-评论'] a .c-navigator--reply_count:first-child").css("display", "");
                    document.querySelector("li[data-watch_event='消息-评论'] a .c-navigator--reply_count").innerHTML = `(${response[0].count})`;
                  } else {
                    $("li[data-watch_event='消息-评论'] a").append(`<span class='c-navigator--reply_count'>(${response[0].count})</span>`);
                  }
                  if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] a span.index__reply_count___1nqAb:nth-child(2)").css("display", "");
                    document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] .index__reply_count___1nqAb").innerHTML = `(${response[0].count})`;
                  } else {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.0'] a").append(`<span class='index__reply_count___1nqAb'>(${response[0].count})</span>`);
                  }
                }
                if (response[1].count == 0) {
                  if (document.querySelector("li[data-watch_event='消息-赞'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-赞'] a .c-navigator--reply_count").css("display", "none");
                  } else if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] .index__reply_count___1nqAb").css("display", "none");
                  }
                } else {
                  if (document.querySelector("li[data-watch_event='消息-赞'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-赞'] a .c-navigator--reply_count:first-child").css("display", "");
                    document.querySelector("li[data-watch_event='消息-赞'] a .c-navigator--reply_count").innerHTML = `(${response[1].count})`;
                  } else {
                    $("li[data-watch_event='消息-赞'] a").append(`<span class='c-navigator--reply_count'>(${response[1].count})</span>`);
                  }
                  if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] a span.index__reply_count___1nqAb:nth-child(2)").css("display", "");
                    document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] .index__reply_count___1nqAb").innerHTML = `(${response[1].count})`;
                  } else {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.1'] a").append(`<span class='index__reply_count___1nqAb'>(${response[1].count})</span>`);
                  }
                }
                if (response[2].count == 0) {
                  if (document.querySelector("li[data-watch_event='消息-系统'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-系统'] a .c-navigator--reply_count").css("display", "none");
                  } else if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] .index__reply_count___1nqAb").css("display", "none");
                  }
                } else {
                  if (document.querySelector("li[data-watch_event='消息-系统'] a .c-navigator--reply_count")) {
                    $("li[data-watch_event='消息-系统'] a .c-navigator--reply_count:first-child").css("display", "");
                    document.querySelector("li[data-watch_event='消息-系统'] a .c-navigator--reply_count").innerHTML = `(${response[2].count})`;
                  } else {
                    $("li[data-watch_event='消息-系统'] a").append(`<span class='c-navigator--reply_count'>(${response[2].count})</span>`);
                  }
                  if (document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] .index__reply_count___1nqAb")) {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] a span.index__reply_count___1nqAb:nth-child(2)").css("display", "");
                    document.querySelector("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] .index__reply_count___1nqAb").innerHTML = `(${response[2].count})`;
                  } else {
                    $("li[data-reactid='.0.0.0.0.0.3.0.0.1.0.2'] a").append(`<span class='index__reply_count___1nqAb'>(${response[2].count})</span>`);
                  }
                }
                if (response[0].count + response[1].count + response[2].count == 0) {
                  if (document.querySelector(".c-navigator--message span")) {
                    $(".c-navigator--message span").css("display", "none");
                  } else if (document.querySelector(".index__user_wrap___11XZU .index__message___3tAMD span")) {
                    $(".index__user_wrap___11XZU .index__message___3tAMD span").css("display", "none");
                  }
                } else {
                  if (document.querySelector(".c-navigator--message span")) {
                    $(".c-navigator--message span:first-child").css("display", "");
                    document.querySelector(".c-navigator--message span").innerHTML = `${
                      response[0].count + response[1].count + response[2].count > 99 ? "99+" : response[0].count + response[1].count + response[2].count
                    }`;
                  } else {
                    $(".c-navigator--message").append(
                      `<span>${response[0].count + response[1].count + response[2].count > 99 ? "99+" : response[0].count + response[1].count + response[2].count}</span>`
                    );
                  }
                  if (document.querySelector(".index__user_wrap___11XZU .index__message___3tAMD span")) {
                    $(".index__user_wrap___11XZU .index__message___3tAMD span:first-child").css("display", "");
                    document.querySelector(".index__user_wrap___11XZU .index__message___3tAMD span").innerHTML = `${
                      response[0].count + response[1].count + response[2].count > 99 ? "99+" : response[0].count + response[1].count + response[2].count
                    }`;
                  } else {
                    $(".index__user_wrap___11XZU .index__message___3tAMD").append(
                      `<span>${response[0].count + response[1].count + response[2].count > 99 ? "99+" : response[0].count + response[1].count + response[2].count}</span>`
                    );
                  }
                }
              }
            },
          });
        }, 1000);
        let url;
        setInterval(() => {
          try {
            $(
              ".r-home-c-creativityComponent--creativity .r-home-c-creativityComponent--box .r-home-c-creativityComponent--detail .r-home-c-creativityComponent--text-box .r-home-c-creativityComponent--introduction img"
            ).attr("src", "https://static.codemao.cn/coco/player/unstable/r1Z2a8yEj.image/png?hash=Fpf08Z93Z-LgvoMLKzbyACyAvroC");
          } catch (e) {}

          for (i of rippleList) {
            for (h of document.querySelectorAll(i)) {
              if (!$(h).hasClass("yzf-animate")) {
                $(h).addClass("yzf-animate");
                $(h).css({
                  position: "relative",
                  overflow: "hidden",
                  transition: "0.1s ease-in",
                });
                if (i == ".r-home-c-community_star--user_recommend_item") {
                  $(h).children("a").mousedown(addRipple);
                } else {
                  $(h).mousedown(addRipple);
                }
              }
            }
          }
          if (
            (window.location.href.indexOf("community") != -1 || window.location.href.indexOf("wiki") != -1) &&
            !parseInt(window.location.href.slice(25 + 10)) &&
            window.location.href.indexOf("wiki/forum/") == -1 &&
            window.location.href.indexOf("wiki/book") == -1 &&
            window.location.href.indexOf("wiki/cartoon") == -1 &&
            window.location.href.indexOf("wiki/novel") == -1
          ) {
            if (Boolean(localStorage.getItem("md-use")) && document.getElementsByClassName("r-community-c-forum_sender--option")[0].style.display != "none") {
              bcm_markdown();
            }
            if (Boolean(localStorage.getItem("md-use"))) {
              $(".forum_editor .mce-tinymce.mce-container.mce-panel").hide();
            }
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            $(".r-community--scroll_to_top").remove();
            if (document.querySelector("#yzfnb") == null) {
              $(".r-index--main_cont").after('<div id="yzfnb" style="width:100%;height:30px"></div>');
            }
            if (scrollTop + windowHeight >= scrollHeight) {
              try {
                if (Boolean(localStorage.getItem("auto-turn")) && !document.querySelector("#loading")) {
                  // document.documentElement.scrollTop = scrollHeight - windowHeight - 10;
                  document.querySelector(".r-community--forum_list .c-pagination--btn.c-pagination--page-container li:last-child").click();
                  if (!document.querySelector(".r-community--forum_list .c-pagination--btn.c-pagination--page-container li:last-child.c-pagination--nomore")) {
                    $(".r-community--forum_list2").after("<p class='r-community--loading' id='loading'>加载中</p>");
                  }
                }
              } catch (err) {}
            }
          }
          try {
            var reactTinymce = document.querySelector(".mce-edit-area iframe");
            for (i of reactTinymce.contentWindow.document.querySelectorAll("img")) {
              if (i.className.indexOf("encode") == -1) {
                i.src = i.src;
                i.className = "encode";
                i.removeAttribute("alt");
              }
            }
          } catch (e) {}
          if ((window.location.href.indexOf("community") != -1 || window.location.href.indexOf("wiki/forum/") != -1) & Boolean(localStorage.getItem("auto-turn"))) {
            if (document.querySelector(".r-community--forum_list2") == null) {
              $(".r-community--forum_list").after("<div class='r-community--forum_list2'></div>");
              url = [];
            }
            if (
              document.querySelector(".r-community--forum_list div:not(div[class])") != null &&
              (document.querySelector(".r-community--forum_filter") != null || document.querySelector(".r-community--content_my_container") != null) &&
              (document.querySelector("#fan") == null || document.querySelector(".r-community--content_my_container") != null)
            ) {
              if (!document.querySelector(".c-pagination--activePage") || document.querySelector(".c-pagination--activePage").innerHTML == "1") {
                $(".r-community--forum_list2").empty();
                url = [];
              }
              var forum_list = document.querySelectorAll(".r-community--forum_list div:not(div[class])");
              for (i of forum_list) {
                unsafeWindow.geturl = (u) => {
                  // console.log(u);
                  url.push(u);
                };
                unsafeWindow.open = unsafeWindow.geturl;
                i.querySelector("li").click();
                let oCopy = i.cloneNode(true);
                oCopy.querySelector("li").classList.remove("yzf-animate");
                $(".r-community--forum_list2").append(oCopy);
              }
              unsafeWindow.open = unsafeWindow.openurl;
              // console.log(url);
              $(".r-community--forum_list div:not(div[class])").css("display", "none").addClass("dec");
              for (i = 0; i < document.querySelectorAll(".r-community--forum_list2 div:not(div[class]) li").length; i++) {
                let onurl = url[i];
                document.querySelectorAll(".r-community--forum_list2 div:not(div[class]) li")[i].onclick = () => {
                  unsafeWindow.open(onurl);
                  // console.log(onurl);
                };
              }
              if (Boolean(localStorage.getItem("auto-turn"))) {
                $(".r-community--page_contianer").hide();
              }
              $(".r-community--forum_list").append("<div id='fan' class></div>");
              $("#loading").remove();
            }
          }
          if (window.location.href.indexOf("/message") != -1) {
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            try {
              document.querySelector(".r-message--load_more").style.opacity = 0;
            } catch (err) {}

            if (scrollTop + windowHeight >= scrollHeight) {
              try {
                document.querySelector(".r-message--load_more").click();
              } catch (err) {}
            }
            var user_face;
            for (user_face of document.querySelectorAll(".r-message-c-comments--user_face")) {
              if (user_face.className.indexOf("encode") == -1) {
                user_face.classList.add("encode");
                user_face_now(user_face);
              }
            }
            for (user_face of document.querySelectorAll(".r-message-c-buy--user_face")) {
              if (user_face.className.indexOf("encode") == -1) {
                user_face.classList.add("encode");
                user_face_now(user_face);
              }
            }
            for (user_face of document.querySelectorAll(".r-message-c-system_message--user_face")) {
              if (user_face.className.indexOf("encode") == -1) {
                user_face.classList.add("encode");
                user_face_now(user_face);
              }
            }
          }
        }, 100);
        function user_face_now(user_face) {
          $.ajax({
            type: "GET",
            url: "https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=" + user_face.href.slice(25 + 5),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            xhrFields: {
              withCredentials: true,
            },
            success: function (response) {
              if (!response.avatar_url) {
                user_face.style.backgroundImage = "url('https://cdn-community.codemao.cn/47/community/d2ViXzEwMDFfMTYwMTg3NDJfMTYwMTg3NDJfMTYyNjU3ODkzOTI2M185MGJlYmIyNQ.png')";
                user_face.style.filter = "grayscale(1)";
              } else {
                user_face.style.backgroundImage = "url('" + response.avatar_url + "')";
              }
            },
          });
        }
        document.querySelector("#custom-sett textarea").value = localStorage.getItem("custom-sett");
        document.querySelector("#custom-setts").innerHTML = document.querySelector("#custom-sett textarea").value;
        $("head").append(`
              <style>
                  .ripple {
                      background-color: rgba(0, 0, 0, 0.2);
                      border-radius: 100%;
                      height: 0px;
                      width: 0px;
                      position: absolute;
                      -webkit-transform: translate(-50%, -50%);
                      transform: translate(-50%, -50%);
                  }
                  .animate {
                      -webkit-animation: ripple 0.4s linear;
                      animation: ripple 0.4s linear;
                  }
                  @-webkit-keyframes ripple {
                      100% {
                          height: 2000px;
                          width: 2000px;
                          background-color: transparent;
                      }
                  }
                  @keyframes ripple {
                      100% {
                          height: 2000px;
                          width: 2000px;
                          background-color: transparent;
                      }
                  }
                  #player_cover{
                      transform: var(--rotateDeg)
                  }
                  .CUI-player-cover-container,.CUI-player-loader-loader-wrapper{
                      transform: var(--OppoRotateDeg)
                  }
                  .overlay {
                      position: absolute;
                      height: 400px;
                      width: 400px;
                      background-color: #fff;
                      top: 0;
                      left: 0;
                      transform: translate(-50%, -50%);
                      border-radius: 50%;
                      opacity: .5;
                      animation: blink .5s linear infinite;
                  }
              </style>
              `);
        $("head").append(`
      <style>
      @font-face{
          font-family: 'product-sans';
          src: url('https://static.codemao.cn/coco/player/unstable/Bksol2Lcj.font/ttf?hash=FtvIDNqEswCHDw4sklGgfw964qEY');
      }
      @font-face{
          font-family: 'shishang';
          src: url('https://static.codemao.cn/coco/player/unstable/HkdooRPM3.font/ttf?hash=FiSOCV6lE1SQ60Pr5swjUhtAZDIt');
      }
      .c-navigator--logo_wrap{
          display: flex;
          align-items: center;
          justify-content: center;
      }
      .pickcat{
          font-family: 'product-sans','shishang';
          font-size: 25px;
          color:#fff;
      }
      @media (max-width: 1280px) {
          .c-navigator--header-content {
              width: 95%!important;
          }
      }
      .c-navigator--header-content .c-navigator--logo_wrap {
          width: unset !important;
      }
      .pickcat:not(.pickcat:first-child){
          display:none;
      }
      .r-community-r-detail-c-report_posts--option:hover,
      .mce-foot .mce-first.mce-primary:hover,
      .r-community-c-forum_editor--save:hover,
      .r-community-r-detail--send_btn:hover,
      .r-community-r-detail--add_reply:hover,
      .r-community-r-detail-c-report_comment--option:hover,
      .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_bottom .r-community-r-detail-c-comment_reply--reply_sender .r-community-r-detail-c-comment_reply--reply_send a:hover,
      .r-community-c-forum_sender--option:hover,
      .r-community--send_btn:hover,
      .r-user-c-banner--btn:not(.r-user-c-banner--attentioned):hover,
      .r-work-c-report_work--option:hover,
      .r-work-c-comment_area--comment_btn:hover,
      .c-dialog-c-confirm_box_center--btns .c-dialog-c-confirm_box_center--confirm:hover,
      .r-work-c-author_info--focus_btn.r-work-c-author_info--not_focus:hover,
      .r-setting--main_area .r-setting--btn_save:hover,
      .c-navigator--header-content .c-navigator--nav_wrap .c-navigator--selected,
      .c-navigator--header-content .c-navigator--nav_wrap .c-navigator--item:hover,
      .c-navigator--header-content .c-navigator--user_wrap .c-navigator--avatar_wrap:hover,
      .c-navigator--header-content .c-navigator--user_wrap .c-navigator--message_wrap:hover,
      .r-user-c-empty--mian-project a:hover,
      .commons-styles--no_submit:hover,
      .c-verify_button--input.c-verify_button--btn_normal_yanzheng:hover,
      .r-user-c-button-panel--bottom .r-user-c-button-panel--submit span:last-child:hover,
      .r-work-c-comment_area-c-report_comment--option:hover,
      .r-user-c-person--person.r-user-c-person--normal .r-user-c-person--right-box .r-user-c-person--btn.r-user-c-person--add:hover,
      .line,
      .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_bottom .r-work-c-comment_area-c-comment_reply--reply_sender .r-work-c-comment_area-c-comment_reply--reply_send a:hover,
      .r-setting--setting_btn:not(.r-setting--relieve):hover,
      .r-setting-component-set_avatar--left_area_container .r-setting-component-set_avatar--btn_save:hover,
      .r-work_manager--button:hover,
      .r-work_manager-c-create_button--block:hover,
      .r-work_manager-c-create_button--download_button:hover,
      .r-work_manager-c-release_dialog--release_button:not(.r-work_manager-c-release_dialog--disable):hover,
      .r-work_manager--download:hover,
      .r-404--content a:hover,
      .r-work_shop-r-details-component-project_dialog--create_btn:hover,
      .r-work_shop-r-details--btn:not(.r-work_shop-r-details--quit_workshop,.r-work_shop-r-details--cancel):hover,
      .c-comment--comment_btn:hover,
      .c-comment-c-comment_reply--reply_send a:hover,
      .c-comment-c-report_comment--bottom_options .c-comment-c-report_comment--option:hover,
      .r-studio--right_wrap .r-studio--send_btn:hover,
      .c-post_box-forum_editor--save:hover,
      .c-post_box-forum_sender--option:hover,
      .c-post_box-post_cont--post_cont .c-post_box-post_cont--send_btn:hover,
      .r-discover--button:hover,
      .r-work_shop-r-details-component-project_dialog--btn:not(:disabled):hover,
      .r-gallery-r-detail--container .r-gallery-r-detail--banner_cont .r-gallery-r-detail--bottom_cont .r-gallery-r-detail--recommend_btn:hover,
      .r-studio-c-recommend_box--footer .r-studio-c-recommend_box--btn:not(:disabled):hover,
      .index__more_nav___2gH4S:hover,
      .index__header-nav-content___3wMTi li .index__cur-nav___2J3au,
      .index__header-nav-content___3wMTi .index__first-nav-content___1Ea0w a:not(.index__more_cont_width___QqxAH a):hover,
      .index__user_wrap___11XZU .index__message_cont___FP0k1:hover,
      .index__avatar_wrap___1djMz:hover,
      .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--manage_content .r-work_shop-r-manage--header .r-work_shop-r-manage--header_btn:hover,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap header .r-work_shop-r-manage-c-edit_workshop_info--edit_btn:hover,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--confirm:hover
      {
          background: var(--second-color)!important;
      }

      .r-community-r-detail-c-report_posts--option,
      .mce-foot .mce-first.mce-primary,
      .r-community-c-forum_editor--save,
      .r-community-r-detail--send_btn,
      .r-community-r-detail--add_reply,
      .r-community-r-detail-c-report_comment--container .r-community-r-detail-c-report_comment--label_group .r-community-r-detail-c-report_comment--item_point i,
      .r-community-r-detail-c-report_comment--option,
      .r-community-r-detail-c-comment_reply--reply_container .r-community-r-detail-c-comment_reply--reply_bottom .r-community-r-detail-c-comment_reply--reply_sender .r-community-r-detail-c-comment_reply--reply_send a,
      .r-community--forum_filter .r-community--filter_tab.r-community--active span,
      .r-community-c-forum_sender--option,
      .r-community--send_btn,
      .r-discover-c-tagList--sort_cont .r-discover-c-tagList--sort_item.r-discover-c-tagList--select,
      .r-user-c-banner--btn:not(.r-user-c-banner--attentioned),
      .r-message--container .r-message--nav_item.r-message--cur_nav:after,
      .c-pagination--btn.c-pagination--page-container .c-pagination--activePage,
      .r-work-c-report_work--option,
      .r-work-c-comment_area--comment_btn,
      .c-dialog-c-confirm_box_center--btns .c-dialog-c-confirm_box_center--confirm,
      .r-work-c-author_info--focus_btn.r-work-c-author_info--not_focus,
      .r-setting--main_area .r-setting--btn_save,
      .c-navigator--navigator,
      .c-navigator--header-content,
      .r-user-c-empty--mian-project a,
      .commons-styles--no_submit,
      .c-verify_button--input.c-verify_button--no_submit,
      .c-verify_button--input.c-verify_button--btn_normal_yanzheng,
      .commons-styles--agree_cont .commons-styles--no_agree.commons-styles--agree,
      .r-home-c-creativityComponent--btn,
      .r-user-c-button-panel--bottom .r-user-c-button-panel--submit span:last-child,
      .r-work-c-comment_area-c-report_comment--option,
      .r-work-c-comment_area-c-report_comment--item_point i,
      .r-user-c-person--person.r-user-c-person--normal .r-user-c-person--right-box .r-user-c-person--btn.r-user-c-person--add,
      .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_bottom .r-work-c-comment_area-c-comment_reply--reply_sender .r-work-c-comment_area-c-comment_reply--reply_send a,
      .r-setting--setting_btn:not(.r-setting--relieve),
      .r-setting-component-set_avatar--left_area_container .r-setting-component-set_avatar--btn_save,
      .r-work_manager-c-sidebar--work_type_item.r-work_manager-c-sidebar--selected,
      .r-work_manager-c-action_button--action_button:hover,
      .r-work_manager--button,
      .r-work_manager-c-normal_work_card--publish_tag,
      .r-work_manager--status_tab.r-work_manager--selected,
      .r-work_manager-c-create_button--block,
      .r-work_manager-c-create_button--download_button,
      .r-work_manager-c-coco_work_card--published_tag,
      .r-work_manager-c-release_dialog--selected i,
      .r-work_manager-c-release_dialog--release_button:not(.r-work_manager-c-release_dialog--disable),
      .r-work_manager-c-release_dialog--label.r-work_manager-c-release_dialog--selected,
      .r-work_manager--download,
      .r-work_manager-c-nemo_work_card--published_tag,
      .r-404--content a,
      .r-work_shop-r-details--btn:not(.r-work_shop-r-details--quit_workshop,.r-work_shop-r-details--cancel,.r-work_shop-r-details--disable),
      .r-work_shop-r-details-component-project_dialog--workshop_name,
      .r-work_shop-r-details-component-project_dialog--create_btn,
      .c-comment--comment_btn,
      .c-comment-c-comment_reply--reply_send a,
      .r-work_shop-r-details--select:after,
      .c-comment-c-report_comment--item_point.c-comment-c-report_comment--select i,
      .c-comment-c-report_comment--bottom_options .c-comment-c-report_comment--option,
      .r-studio--right_wrap .r-studio--send_btn,
      .c-post_box-forum_editor--save,
      .c-post_box-forum_sender--option,
      .c-post_box-post_cont--post_cont .c-post_box-post_cont--send_btn,
      .r-work_shop-c-user_card--user_item.r-work_shop-c-user_card--one_bg,
      .r-discover--button,
      .r-work_shop-r-details-component-project_dialog--btn:not(:disabled),
      .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li.r-gallery-r-detail--select:after,
      .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li:hover:after,
      .r-gallery-r-detail--container .r-gallery-r-detail--banner_cont .r-gallery-r-detail--bottom_cont .r-gallery-r-detail--recommend_btn,
      .r-studio-c-recommend_box--footer .r-studio-c-recommend_box--btn:not(:disabled),
      .index__header-wrap___3Aq42,
      .r-work_shop-r-manage-c-manage_staff--member_list_wrap .r-work_shop-r-manage-c-manage_staff--member_list .r-work_shop-r-manage-c-manage_staff--member.r-work_shop-r-manage-c-manage_staff--leader,
      .r-work_shop-r-manage-c-manage_staff--member_list_wrap .r-work_shop-r-manage-c-manage_staff--member_list .r-work_shop-r-manage-c-manage_staff--member.r-work_shop-r-manage-c-manage_staff--deputy_leader .r-work_shop-r-manage-c-manage_staff--workshop_title,
      .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--manage_content .r-work_shop-r-manage--header .r-work_shop-r-manage--header_btn,
      .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--sidebar .r-work_shop-r-manage--sidebar_item.r-work_shop-r-manage--selected:before,
      .r-work_shop-r-manage--manage_workshop_container .r-work_shop-r-manage--sidebar .r-work_shop-r-manage--sidebar_item:hover,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap header .r-work_shop-r-manage-c-edit_workshop_info--edit_btn,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--confirm
      {
          background: var(--main-color)!important;
      }
      .r-work_manager-c-sidebar--work_type_item:not(.r-work_manager-c-sidebar--selected):hover,
      .r-work_manager-c-release_dialog--label:not(.r-work_manager-c-release_dialog--selected):hover{
          background: #0001!important;
      }
      .r-gallery--labels .r-gallery--label_active{
          background: var(--second-color)!important;
          color: white!important;
      }

      .mce-btn:hover,
      .r-community-r-detail--roules_btn:hover,
      .r-community-r-detail-c-comment_reply--reply_btn:hover,
      .r-community-r-detail-c-comment_item--content_container .r-community-r-detail-c-comment_item--content_bottom .r-community-r-detail-c-comment_item--content_praise.r-community-r-detail-c-comment_item--active i,
      .r-community-r-detail-c-comment_item--active,
      .r-community--forum_filter .r-community--filter_tab.r-community--active,
      .r-community--forum_filter .r-community--filter_tab:hover,
      .r-community--roules_btn:hover,
      .r-discover-c-workcard--work_item .r-discover-c-workcard--author a:hover,
      .r-discover-c-tagList--sort_cont .r-discover-c-tagList--sort_item:not(.r-discover-c-tagList--select):hover,
      .r-discover--header .r-discover--switch-box li:hover,
      .r-discover--active,
      .r-discover-c-banner--banner_cont .r-discover-c-banner--item p:hover,
      .r-home-c-section_header--right_text,
      .r-message-c-comments--work_name,
      .r-message-c-system_message--work_name,
      .r-message--nav_item:hover,
      .r-message--nav_item:hover span,
      .r-message--load_more:hover,
      .r-message-c-buy--work_name,
      .r-message--container .r-message--nav_item.r-message--cur_nav, .r-message--container .r-message--nav_item.r-message--cur_nav span,
      .r-work-c-work_info--work_tool,
      .r-work-c-comment_area-c-comment_item--active,
      .r-work-c-comment_area-c-comment_item--active i,
      .r-user-r-project--project .r-user-r-project--guide>span.r-user-r-project--active,
      .r-user-r-project--project .r-user-r-project--guide>span:hover,
      .r-user-c-empty--collect a,
      .r-user-c-banner--banner .r-user-c-banner--nav-box ul p.r-user-c-banner--active span,
      .r-user-c-banner--banner .r-user-c-banner--nav-box ul p:hover > span,
      .r-user-c-empty--project a,
      .commons-styles--agree_cont a,
      .r-user-c-button-panel--bottom .r-user-c-button-panel--submit span:first-child:hover,
      .mce-foot .mce-btn.mce-last:hover>button .mce-txt,
      .r-community--search_container .r-community--search_header .r-community--roules_btn:hover,
      .r-community-r-detail-c-comment_reply--content_praise.r-community-r-detail-c-comment_reply--active,
      .r-community-r-detail-c-comment_reply--content_praise.r-community-r-detail-c-comment_reply--active i,
      .r-work-c-comment_area-c-comment_reply--content_praise.r-work-c-comment_area-c-comment_reply--active,
      .r-work-c-comment_area-c-comment_reply--content_praise.r-work-c-comment_area-c-comment_reply--active i,
      .r-work-c-comment_area-c-comment_editor--insert_emotiion:hover,
      .r-work-c-comment_area-c-comment_editor--insert_emotiion.r-work-c-comment_area-c-comment_editor--active,
      .loading_container,
      .c-dialog-c-confirm_box_center--cancel:hover,
      .r-setting--left_area a.r-setting--active,
      .r-work_manager--status_tab:hover,
      .c-logout--content p a,
      .r-work_manager--tab:not(.r-work_manager--selected):hover,
      .r-work_shop-r-details--news_guide,
      .c-comment-c-comment_editor--insert_emotiion:hover,
      .c-comment-c-comment_editor--active,
      .c-comment-c-comment_item--content_praise.c-comment-c-comment_item--active,
      .c-comment-c-comment_item--content_praise.c-comment-c-comment_item--active i,
      .c-comment-c-comment_reply--content_praise.c-comment-c-comment_reply--active,
      .c-comment-c-comment_reply--content_praise.c-comment-c-comment_reply--active i,
      .r-work_shop-r-details--select,
      .r-work_shop-r-details--tab:hover,
      .c-comment-c-comment_item--content a:hover,
      .r-studio--tap.r-studio--active a,
      .r-studio-c-card_item--author a:hover,
      .r-studio--right_wrap .r-studio--roules_btn:hover,
      .r-studio-c-user_item--nickname:hover,
      .r-studio--share:hover span,
      .c-post_box-post_cont--post_cont .c-post_box-post_cont--roules_btn:hover,
      .r-work_shop-c-user_card--user_item:not(.r-work_shop-c-user_card--one_bg) .r-work_shop-c-user_card--nickname:hover,
      .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li.r-gallery-r-detail--select,
      .r-gallery-r-detail--container .r-gallery-r-detail--nav_wrap .r-gallery-r-detail--nav_cont ul li:hover,
      .r-gallery-c-user_card--user_item .r-gallery-c-user_card--nickname:hover,
      .r-gallery-r-detail--container .r-gallery-r-detail--banner_cont .r-gallery-r-detail--bottom_cont .r-gallery-r-detail--like_cont.r-gallery-r-detail--is_like .r-gallery-r-detail--text,
      .r-gallery-r-detail--like_cont:hover .r-gallery-r-detail--text,
      .r-gallery-r-detail--share_cont:hover .r-gallery-r-detail--text,
      .c-work_card--work_item .c-work_card--author a:hover,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--cancel:hover
      {
          color: var(--main-color)!important;
      }

      .r-community-r-detail-c-report_posts--editor:focus,
      .mce-foot .mce-btn:hover,
      .r-community-r-detail-c-report_comment--editor:focus,
      .r-community-r-detail-c-report_comment--container .r-community-r-detail-c-report_comment--label_group .r-community-r-detail-c-report_comment--item_point:hover,
      .r-community-r-detail-c-report_comment--container .r-community-r-detail-c-report_comment--label_group .r-community-r-detail-c-report_comment--item_point.r-community-r-detail-c-report_comment--select,
      .r-community-r-detail-c-comment_reply--reply_editor:focus,
      .r-community-r-detail-c-comment_reply--reply_btn:hover,
      .r-community--small:focus,
      .r-community-c-forum_sender--title_input:focus,
      .r-discover--header .r-discover--search-box input:focus,
      .r-discover-c-tagList--sort_cont .r-discover-c-tagList--sort_item.r-discover-c-tagList--select,
      .r-discover-c-tagList--sort_cont .r-discover-c-tagList--sort_item:hover,
      .r-message--load_more:hover,
      .c-pagination--btn.c-pagination--page-container .c-pagination--activePage,
      .c-dialog-c-confirm_box_center--confirm,
      .r-user-c-banner--banner .r-user-c-banner--nav-box ul p.r-user-c-banner--active span,
      .c-navigator--header-content .c-navigator--user_wrap .c-navigator--avatar_default,
      .r-user-c-button-panel--bottom .r-user-c-button-panel--submit span:last-child,
      .r-user-c-button-panel--bottom .r-user-c-button-panel--submit span:first-child:hover,
      .r-user-c-button-panel--bottom.r-user-c-button-panel--focus,
      .r-community-r-detail-c-report_posts--reason_select:focus,
      .r-work-c-comment_area-c-comment_editor--content_container .r-work-c-comment_area-c-comment_editor--editor:focus,
      .r-work-c-comment_area-c-report_comment--item_point,
      .r-work-c-report_work--editor:focus,
      .r-work-c-report_work--reason_select:focus,
      .r-work-c-comment_area-c-comment_editor--insert_emotiion:hover,
      .r-work-c-comment_area-c-comment_editor--insert_emotiion.r-work-c-comment_area-c-comment_editor--active,
      .r-work-c-comment_area-c-comment_reply--reply_container .r-work-c-comment_area-c-comment_reply--reply_bottom .r-work-c-comment_area-c-comment_reply--reply_sender .r-work-c-comment_area-c-comment_reply--reply_editor:focus,
      .c-dialog-c-confirm_box_center--cancel:hover,
      .r-setting--setting_form .r-setting--form_item .r-setting--radio_input.r-setting--selected:before,
      .r-work_manager-c-release_dialog--selected,
      .r-work_manager-c-release_dialog--fork_enable_check_list:not(.r-work_manager-c-release_dialog--selected) label:hover,
      .r-work_shop--search_form input:focus,
      .c-comment-c-comment_editor--editor:focus,
      .c-comment-c-comment_editor--insert_emotiion:hover,
      .c-comment-c-comment_editor--active,
      .c-comment-c-comment_reply--reply_editor:focus,
      .r-community--search_form input:focus,
      .c-comment-c-report_comment--item_point.c-comment-c-report_comment--select,
      .c-comment-c-report_comment--label_item:hover .c-comment-c-report_comment--item_point,
      .r-studio--search_form input:focus,
      .c-post_box-forum_sender--container .c-post_box-forum_sender--form_item .c-post_box-forum_sender--title_input:focus,
      .c-post_box-post_cont--post_cont .c-post_box-post_cont--search_form input:focus,
      .r-discover--search-header input:focus,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--cancel:hover,
      .r-work_shop-r-manage-c-edit_workshop_info--edit_wrap .r-work_shop-r-manage-c-edit_workshop_info--edit_btns .r-work_shop-r-manage-c-edit_workshop_info--confirm
      {
          border-color:var(--main-color)!important;
      }

      .r-discover--header .r-discover--search-box input:focus + div > .r-discover--icon,
      .c-post_box-post_cont--icon_search.c-post_box-post_cont--focus,
      .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--link,
      .r-community--search_form .r-community--search_btn .r-community--icon_search.r-community--focus,
      .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--release,
      .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--recover,
      .r-studio--icon_search.r-studio--focus,
      .r-studio--share:hover i
      {
          filter: drop-shadow(-100vw 0px 0px var(--main-color));
          transform: translateX(100vw);
      }
      .r-work_shop--container .r-work_shop--cont .r-work_shop--title .r-work_shop--search_cont .r-work_shop--search_form .r-work_shop--icon{
          background: url(https://cdn-community.codemao.cn/community_frontend/asset/lv_d1f63.svg) no-repeat -12px -132px !important;
      }
      .r-work_manager-c-action_button--action_button:hover .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--link,
      .r-work_manager-c-action_button--action_button:hover .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--release,
      .r-work_manager-c-action_button--action_button:hover .r-work_manager-c-action_button--icon.r-work_manager-c-action_button--recover{
          filter: none;
          transform: translateX(0);
      }
      .c-verify_button--input.c-verify_button--no_submit{
          opacity: .7;
      }
      .r-community--notic_item_icon.r-community--sort_0,
      .r-community--notic_item_icon.r-community--sort_1{
          background-image: url(https://static.codemao.cn/coco/player/unstable/rynzhrEzj.image/svg+xml?hash=FuzcLsihkqej0iPVb6rfMO2aBIUv)!important;
          background-color: var(--second-color)!important;
          border-radius: 2px;
      }

      .r-community--notic_item_icon.r-community--sort_2,
      .r-community--notic_item_icon.r-community--sort_3{
          background-image: url(https://static.codemao.cn/coco/player/unstable/rynzhrEzj.image/svg+xml?hash=FuzcLsihkqej0iPVb6rfMO2aBIUv)!important;
          background-color: var(--main-color)!important;
          border-radius: 2px;
      }

      .r-work-c-comment_area-c-comment_editor--content_container .r-work-c-comment_area-c-comment_editor--edit_emotion .r-work-c-comment_area-c-comment_editor--insert_emotiion.r-work-c-comment_area-c-comment_editor--active .r-work-c-comment_area-c-comment_editor--icon_emotion,
      .r-work-c-comment_area-c-comment_editor--content_container .r-work-c-comment_area-c-comment_editor--edit_emotion .r-work-c-comment_area-c-comment_editor--insert_emotiion:hover .r-work-c-comment_area-c-comment_editor--icon_emotion,
      .c-post_list--post_container .c-post_list--post_title .c-post_list--status_icon.c-post_list--up,
      .r-work_shop-r-details--share:hover i,
      .c-comment-c-comment_editor--insert_emotiion:hover i,
      .c-comment-c-comment_editor--active i,
      .r-work_shop-r-details--select i,
      .r-work_shop-r-details--tab:hover i,
      .r-gallery-r-detail--container .r-gallery-r-detail--banner_cont .r-gallery-r-detail--bottom_cont .r-gallery-r-detail--like_cont.r-gallery-r-detail--is_like .r-gallery-r-detail--like,
      .r-gallery-r-detail--like_cont:hover .r-gallery-r-detail--like,
      .r-gallery-r-detail--share_cont:hover .r-gallery-r-detail--share
      {
          filter: drop-shadow(100vw 0px 0px var(--main-color))!important;
          transform: translateX(-100vw);
      }
      .c-post_list--post_container .c-post_list--post_footer .c-post_list--has_reply,
      .r-work_manager--status_tab.r-work_manager--selected,
      .r-work_manager-c-release_dialog-component-avatar--upload_img,
      .r-work_manager--tab.r-work_manager--selected,
      .r-work_manager-c-clear_button--clear_button:not(.r-work_manager-c-clear_button--empty),
      .r-work_shop--title .r-work_shop--nav_cont span:not(.r-work_shop--select):hover,
      .r-work_shop--select,
      .r-work_shop-r-details-component-project_dialog--tab:not(.r-work_shop-r-details-component-project_dialog--selected):hover,
      .r-work_shop-r-details-component-project_dialog--tab.r-work_shop-r-details-component-project_dialog--selected,
      .r-course-c-block--block .r-course-c-block--area .r-course-c-block--tag:hover,
      .r-course-c-block--block .r-course-c-block--area .r-course-c-block--tag.r-course-c-block--active{
          background: var(--main-color)!important;
          color: white!important;
          opacity: .6;
      }
      .c-post_list--post_container .c-post_list--post_footer .c-post_list--has_reply:hover,
      .r-work_manager-c-release_dialog-component-avatar--upload_img:hover,
      .r-work_manager-c-clear_button--clear_button:not(.r-work_manager-c-clear_button--empty):hover{
          background: var(--second-color)!important;
      }
      .c-navigator--header-content .c-navigator--ide_link,
      .r-gallery-r-detail--container .r-gallery-r-detail--banner_cont .r-gallery-r-detail--bottom_cont .r-gallery-r-detail--create_btn,
      .index__ide_link___3aGRo,
      .r-work_shop-r-manage-c-manage_staff--member_list_wrap .r-work_shop-r-manage-c-manage_staff--member_list .r-work_shop-r-manage-c-manage_staff--member.r-work_shop-r-manage-c-manage_staff--leader .r-work_shop-r-manage-c-manage_staff--workshop_title{
          background: var(--highlight-color)!important;
      }
      .c-navigator--header-content .c-navigator--ide_link:hover,
      .index__ide_link___3aGRo:hover{
          filter: grayscale(0.2);
      }
      .r-work_manager-c-clear_button--clear_button .r-work_manager-c-clear_button--icon{
          background: url(https://cdn-community.codemao.cn/community_frontend/asset/icon_sprite_95afc.svg) no-repeat -270px -230px !important;
      }
      .r-work_shop-c-user_card--user_item .r-work_shop-c-user_card--bg_img{
          filter: drop-shadow(100vw 0px 0px var(--second-color));
          transform: translateX(-100vw);
      }
      #yzf-settings{
          transition: transform 0.2s ease 0s;
          display: none;
          text-align: left;
          background: white;
          border-radius: 5px;
          position: fixed;
          width: 500px;
          height: 70vh;
          top: 0px;
          left: 0px;
          z-index: 100;
          margin: 15vh calc(50vw - 250px);
          transform: translateY(0px);
      }
      #yzf-main-thing{
          overflow: auto;
          height: calc(70vh - 50px);
          width: 500px;
          padding: 0 50px;
          top: 50px;
          position: absolute;
          display: flex;
          flex-direction: column;
      }
      .color-sel,.mess-del{
          display: flex;
          justify-content: space-between;
          padding: 15px 0 0 0;
      }
      .color-sel #customLogo {
          border: 1px black solid;
          text-align: center;
      }
      #person-bg-btn,#mess-del-btn,#remixCheck-btn,#username-btn,#commentCheck-btn,#Junkcomment-btn{
          font-size:15px;
          padding: 5px;
          border-radius:5px;
      }
      .bg-sel{
          padding: 15px 0 0 0;
          display: flex;
          justify-content: flex-end;
      }
      #navbar-sett,#index-sett{
          display: flex;
          flex-direction: column;
          /*padding: 15px 0 0 0;*/
      }
      #navbar-sett span,#index-sett span,#custom-sett span{
          padding: 15px 0;
      }
      #navbar-sett div span{
          width:calc(100% / 3);
          padding: 0;
      }
      #index-sett div span{
          width:calc(100% / 2);
          padding: 0;
      }
      #custom-sett{
          display: flex;
          flex-direction: column;
      }
      #custom-sett textarea{
          border: solid black 1px;
          border-radius: 5px;
          max-width: 100%;
          min-width: 100%;
          padding: 10px;
          font-family: Monaco,Menlo,"Ubuntu Mono",Consolas,source-code-pro,monospace;
      }
      .r-user-c-banner--name,
      .r-user-c-banner--des,
      .r-user-c-banner--num{
          mix-blend-mode: difference
      }
      .r-work-c-player--work_player_container .r-work-c-player--player_fun .r-work-c-player--player_rotate_screen{
          float: right;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          stroke: #666666;
          stroke-opacity: 0.4
      }
      .r-work-c-player--player_control_bar .r-work-c-player--player_rotate_screen{
          right: 76px;
          stroke: #bbb;
      }
      .r-work-c-player--player_control_bar .r-work-c-player--player_rotate_screen:hover{
          cursor: pointer !important;
      }
      .r-discover--header .r-discover--search-box div{
          position: absolute;
          cursor: pointer;
          right: 12px;
          top: 10px;
          width: 14px;
          height: 14px;
      }
      .r-discover--header .r-discover--search-box .r-discover--icon{
          background: url(https://cdn-community.codemao.cn/community_frontend/asset/icon_sprite_1fd27.svg) no-repeat -215px -202px!important;
      }

      .index__header-brand___2nK8h {
          width: 107px;
          height: 100%;
          background-repeat: no-repeat;
          display: flex;
          margin-right: 35px;
          margin-top: unset;
          float: left;
          align-items: center;
          justify-content: flex-end;
      }

      #zhichiBtnBox,
      .app__popup___SJlRS,
      .app__go-to-top___35N8W,
      .index__footer_wrap___3SAeC {
          display:none;
      }

      .c-dialog--dialog_cover {
          position: absolute;
          display: none;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: .5;
          background: #000;
      }

      .c-dialog--dialog_wrap .c-dialog--dialog_cover {
        display: unset;
      }

      button, div, input, textarea {
          outline: 0;
          padding: 0;
          border: 0;
      }
      #yzf-settings button {
          cursor: pointer;
          background-color: buttonface;
      }
      ::-webkit-scrollbar-track-piece {
          background: unset;
      }

      .r-work-c-work_info--container .r-work-c-work_info--work_name:hover {
            white-space: unset;
            overflow: unset;
            text-overflow: unset;
            height: auto;
            font-size: 24px;
      }

      .swal-footer {
        text-align: center;
      }

      .c-navigator--header-content .c-navigator--kn_wrap {
        display:none;
      }

      .r-work_manager--work_manager_wrap .r-work_manager--content_wrap .r-work_manager--content_container .r-work_manager--content {
        overflow: hidden;
      }
      .c-zhichi_wrap--zhichi-wrap button {
        background: url(https://creation.bcmcdn.com/445/kitten/d2ViXzIwMDJfNDM4NDAzXzFfMTc1Mzk0ODE3Nzg0NV8zMTAzNTNjMA==) no-repeat, linear-gradient(to top, var(--main-color) 0%, var(--main-color) 41.6%, var(--second-color) 41.6%, var(--second-color) 100%);
      }
      .c-zhichi_wrap--zhichi-wrap button:hover {
        background: url(https://creation.bcmcdn.com/445/kitten/d2ViXzIwMDJfNDM4NDAzXzFfMTc1Mzk0ODE3NzYwM19hYmFjMWUyNg==) no-repeat, linear-gradient(to top, var(--main-color) 0%, var(--main-color) 41.6%, var(--second-color) 41.6%, var(--second-color) 100%);
      }
       </style>`);
        $("li[data-watch_event='设置-入口tab']").click(function () {
          $("#yzf-settings").css("display", "block");
          $("#yzf-settings").css("transform", "translateY(0)");
          $("#yzf-close").click(() => {
            $(".c-dialog--dialog_wrap").css("opacity", "0");
            $("#yzf-settings").css("transform", "translateY(-20px)");
            setTimeout(() => {
              if (document.querySelector(".c-dialog--dialog_wrap")) {
                $(".c-dialog--dialog_wrap").removeClass("c-dialog--visiable c-dialog--show");
                $(".c-dialog--dialog_wrap").css("opacity", "");
                $("#yzf-settings").css("display", "none");
              } else {
                $(".c-dialog--dialog_cover").fadeOut(200);
                $("#yzf-settings").fadeOut(200);
              }
            }, 200);
          });
          $("#main-color").val(localStorage.getItem("main-color") || "#fec433");
          $("#second-color").val(localStorage.getItem("second-color") || "#f6b206");
          $("#person-color").val(localStorage.getItem("person-color") || "#000");
          $("#highlight-color").val(localStorage.getItem("highlight-color") || "#ec443d");
          document.querySelector("input#md-use").checked = Boolean(localStorage.getItem("md-use")) ? true : false;
          document.querySelector("input#auto-turn").checked = Boolean(localStorage.getItem("auto-turn")) ? true : false;
          if (document.querySelector(".c-dialog--dialog_wrap")) {
            $(".c-dialog--dialog_wrap").addClass("c-dialog--visiable c-dialog--show");
          } else {
            $(".c-dialog--dialog_cover").css("zIndex", "100").fadeIn(200);
          }
        });

        if (localStorage.getItem("theme") == "light" || localStorage.getItem("theme") == null) {
          document.querySelector('input[value="light"]').checked = true;
          to_light();
        } else if (localStorage.getItem("theme") == "dark") {
          document.querySelector('input[value="dark"]').checked = true;
          to_dark();
        } else {
          if (localStorage.getItem("theme") == "auto") {
            document.querySelector('input[value="auto"]').checked = true;
            const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
            if (!themeMedia.matches) {
              to_dark();
            } else {
              to_light();
            }
            themeMedia.addListener((e) => {
              if (localStorage.getItem("theme") == "auto") {
                if (!e.matches) {
                  to_dark();
                } else {
                  to_light();
                }
              }
            });
          }
        }
        if (localStorage.getItem("person-setting") == "color") {
          document.querySelector('input[value="color"]').checked = true;
          document.querySelector("#person-bg-btn").style.display = "none";
          document.querySelector("#person-color").style.display = "block";
          document.documentElement.style.setProperty("--person-color", localStorage.getItem("person-color") || "#000");
          document.documentElement.style.setProperty("--person-bg", "");
        } else {
          document.querySelector('input[value="pic"]').checked = true;
          document.querySelector("#person-bg-btn").style.display = "block";
          document.querySelector("#person-color").style.display = "none";
          document.documentElement.style.setProperty("--person-color", "");
          document.documentElement.style.setProperty(
            "--person-bg",
            localStorage.getItem("person-bg") || "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)"
          );
        }
        $.ajax({
          type: "GET",
          url: "https://api.codemao.cn/web/users/details",
          contentType: "application/json;charset=UTF-8",
          dataType: "json",
          xhrFields: {
            withCredentials: true,
          },
          success: function (response) {
            if (window.location.href.indexOf("user") != -1 && response.id != parseInt(window.location.href.slice(25 + 5))) {
              $.ajax({
                type: "GET",
                url: "https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=" + parseInt(window.location.href.slice(25 + 5)),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                xhrFields: {
                  withCredentials: true,
                },
                success: function (response) {
                  if (response.user_cover == "") {
                    document
                      .querySelector(".r-user-c-banner--banner .r-user-c-banner--background")
                      .style.setProperty("background-image", "url(https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png)", "important");
                  } else {
                    document
                      .querySelector(".r-user-c-banner--banner .r-user-c-banner--background")
                      .style.setProperty("background-image", "url(" + response.user_cover + ")", "important");
                  }
                },
              });
            }
          },
        });
      }
    }, 100);
  })();
  $("head").append(`
       <style>
       body {
           height: fit-content !important;
       }
       #yzf-settings span{
           font-size:20px;
           float: left;
       }
       #yzf-settings input[type='color']{
           width:30px;
           height:30px;
           font-size:20px;
       }
       .r-discover-c-banner--banner_cont{
           display: flex;
           justify-content: center;
       }
       .c-side_nav--slide_nav,
       .c-footer--footer_wrap,
       .r-course-c-guide--slide_nav_wrap
       {
           display:none !important
       }
       .c-badge--icon
       {
           display:var(--isLevelShown) !important
       }
       .r-home-c-box3_recommend--recommend_work{
           display: var(--box3)!important
       }
       .r-home-c-novel_area--novel_area{
           display: var(--novel)!important
       }
       .r-home-c-code_tv--novel_area{
           display: var(--code-tv)!important
       }
       .r-home--guide_part.r-home--reverse{
           display: var(--guide-part)!important
       }
       .r-home-c-recommend_work_area--recommend_work{
           display: var(--recommend-work)!important
       }
       .r-home-c-new_work_area--new_work{
           display: var(--new-work)!important
       }
       .r-home-c-box3_community--recommend_work{
           display: var(--box3-community)!important
       }
       .r-home-c-workshop_area--workshop_work{
           display: var(--workshop)!important
       }
       .r-home-c-community_star--user_recommend_area{
           display: var(--community-star)!important
       }
       .r-user-c-banner--banner .r-user-c-banner--background,
       .c-dialog-c-sign_box--header_img
       {
           background-image: var(--person-bg)!important;
           background-color: var(--person-color)!important;
           background-position: center!important;
           background-size: cover!important;
       }
       body{
           overflow-x: hidden;
       }
       *::-webkit-scrollbar {
              width: 5px !important;
              height: 5px !important;
          }
      *::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
          background-color:  var(--main-color) !important;
      }
      *::-webkit-scrollbar-thumb:hover {
          background-color:  var(--second-color) !important;
      }
      #yzf-close{
          font-size:20px;
          right: 20px;
          top: 15px;
          position: absolute;
          background-color: transparent !important;
          color: #000
      }
      #yzf-close:hover{
          color: #aaa
      }
      .r-work_shop-r-details-component-project_dialog--container {
        height: 525px !important;
      }

      .user-status {
        width: 30px;
        height: 30px;
        position: absolute;
        border: 5px solid white;
        border-radius: 50%;
        right: 15px;
        bottom: 15px;
      }

      .ne-doc-major-editor {
        height: 300px;
        border: 1px solid hsla(0,0%,40%,.28);
        border-radius: 4px;
      }

      #yuque::-webkit-scrollbar {
        display:none;
      }
       </style>`);

  function remove_md() {
    if (document.querySelector(".forum_editor.ne-doc-major-editor")) {
      $(".yuque-sender,#preview,#yuque").remove();
      $(".forum_editor .mce-tinymce.mce-container.mce-panel,.r-community-c-forum_sender--bottom_options .r-community-c-forum_sender--option").show();
      document.querySelector(".forum_editor").classList.remove("ne-doc-major-editor");
    }
  }

  function bcm_markdown() {
    if (document.querySelector(".forum_editor:not(.ne-doc-major-editor)")) {
      document.querySelector(".forum_editor").classList.add("ne-doc-major-editor");
      $(".r-community-c-forum_sender--bottom_options .r-community-c-forum_sender--option")
        .after($(".r-community-c-forum_sender--bottom_options .r-community-c-forum_sender--option").clone(true).addClass("yuque-sender"))
        .hide();
      $(".forum_editor").append(
        `<iframe style="width:100%;height:100%;" id="yuque" allowfullscreen src="https://static.codemao.cn/Chunkuposs/Hy7KAK3Oxx.html?hash=Ftdce91KXuG9Kj_kCkmt0_NHqRpO"></iframe>`
      );
      $("body").append(`<iframe id="preview" src="" style="width: 100%; height: 100%; z-index: -1; position: fixed;"></iframe>`);
      if (document.querySelector("iframe[allowfullscreen]").attachEvent) {
        document.querySelector("iframe[allowfullscreen]").attachEvent("onload", function () {
          document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
        });
        document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
      } else {
        document.querySelector("iframe[allowfullscreen]").onload = function () {
          document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
        };
        document.querySelector("iframe[allowfullscreen]").contentWindow.postMessage(theme, "*");
      }
      document.querySelector(".r-community-c-forum_sender--bottom_options .r-community-c-forum_sender--option.yuque-sender").onclick = async (e) => {
        let tag;
        e.preventDefault();
        try {
          if (
            document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value.length < 5 ||
            document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value.length > 50
          ) {
            swal({
              title: "错误",
              text: "请填写5-50字的标题",
              icon: "error",
            });
            return false;
          }
          let tags = {
            热门活动: 17,
            积木编程乐园: 2,
            "工作室&师徒": 10,
            你问我答: 5,
            神奇代码岛: 3,
            图书馆: 6,
            CoCo应用创作: 27,
            Python乐园: 11,
            源码精灵: 26,
            NOC编程猫比赛: 13,
            通天塔: 4,
            灌水池塘: 7,
            训练师小课堂: 28,
          };
          tag = tags[document.getElementsByClassName("r-community-c-forum_sender--active")[0].innerText];
          document.querySelector("#yuque").contentWindow.postMessage("data", "*");
          let texts, trueURL, previewContent;
          window.addEventListener(
            "message",
            (e) => {
              // console.log(e.data);
              if (typeof e.data === "number") {
                let content = `
                  <p style="display:none"></p>
                  <a href="${trueURL}#${e.data}">此帖子使用编程猫使用优化的语雀编辑器发送，请安装新版编程猫使用优化或者点击链接跳转来查看帖子内容</a>
                  `;
                $.ajax({
                  url: "https://api.codemao.cn/web/forums/boards/" + tag + "/posts",
                  type: "POST",
                  contentType: "application/json;charset=UTF-8",
                  dataType: "json",
                  xhrFields: {
                    withCredentials: true,
                  },
                  data: JSON.stringify({
                    title: document.getElementsByClassName("r-community-c-forum_sender--title_input")[0].value,
                    content: content,
                  }),
                  headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE .0; Windows NT 6.1; Trident/4.0; SLCC2;)",
                    Host: "api.codemao.cn",
                    Cookie: document.cookie,
                  },
                  success: function (response) {
                    console.log(response.id);
                    window.open("https://shequ.codemao.cn/community/" + response.id);
                  },
                });
              } else {
                texts = e.data;
                previewContent = `
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <title>预览</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.24.0/umd/doc.css" />
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/antd@4.24.13/dist/antd.css" />
  </head>
  <body>
    <div id="root" class="ne-doc-major-viewer"></div>
    <script>
      window.onload = function () {
        const { createOpenViewer } = window.Doc;
        // 创建阅读器
        const viewer = createOpenViewer(document.getElementById("root"), { darkMode: true });
        // 设置内容
        viewer.setDocument("text/lake", decodeURIComponent(window.atob("${texts}")));
        viewer.theme.setActiveTheme("default");
        window.viewer = viewer;
        window.addEventListener(
          "message",
          (e) => {
            if (e.data === "dark") {
              viewer.theme.setActiveTheme("dark-mode");
              document.body.style.backgroundColor = "#525252";
              console.log("dark");
            } else if (e.data === "light") {
              viewer.theme.setActiveTheme("default");
              document.body.style.backgroundColor = "";
              console.log("light");
            } else if (e.data === "height") {
              window.top.postMessage(document.querySelector("#root").scrollHeight + 50, "*");
            }
          },
          false
        );
      };
    </script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.24.0/umd/doc.umd.js"></script>
  </body>
</html>`;

                let url, fn, token, key, upload_url;
                fn = "preview.html";
                $.ajax({
                  type: "GET",
                  url: "https://oversea-api.code.game/tiger/kitten/cdn/token/1?type=text%2Fhtml&prefix=yuque%2Fpreview&bucket=static",
                  contentType: "application/json;charset=UTF-8",
                  async: false,
                  xhrFields: {
                    withCredentials: true,
                  },
                  success: function (res) {
                    upload_url = res.bucket_url;
                    token = res["data"][0]["token"];
                    key = res["data"][0]["filename"];
                  },
                });
                var formData = new FormData();
                formData.append("token", token);
                formData.append("key", key);
                formData.append("fname", fn);
                const file = new File([previewContent], fn, {
                  type: "text/html",
                });
                formData.append("file", file);
                $.ajax({
                  type: "POST",
                  url: "https://upload.qiniup.com/",
                  async: false,
                  contentType: false,
                  processData: false,
                  data: formData,
                  success: function (res) {
                    url = "/" + res.key;
                  },
                });
                trueURL = encodeURI(upload_url + url);
                // console.log(trueURL);
                $("#preview").attr("src", encodeURI(upload_url + url));
                if (document.querySelector("#preview").attachEvent) {
                  document.querySelector("#preview").attachEvent("onload", function () {
                    document.querySelector("#preview").contentWindow.postMessage("height", "*");
                  });
                } else {
                  document.querySelector("#preview").onload = function () {
                    document.querySelector("#preview").contentWindow.postMessage("height", "*");
                  };
                }
              }
            },
            false
          );
        } catch (err) {
          swal({
            title: "错误",
            text: "请选择发帖分区！",
            icon: "error",
          });
        }
      };
    }
  }
})();
