/**********************************************************************
 *JimdoRepeatプラグイン
 *sample_content.js
 *機能   (1)ジンドゥー編集で、youtube動画のリピート機能を追加します。
 *Jimdoの画面構成・構造は他のブラウザーとは少し異なっているようです。そのため、
 *DOMアクセスが難しくなっています。
 *編集画面で、リピート機能を保存しようとしましたが、うまくできませんでした。
 *そのため、動的にリピート機能を設定する方法をとっています。
 *あらかじめ、jquery.jsをロードしています。
 ***********************************************************************/
let tabId;
let frm_arr = [];
/***********************************************************************
*共通パターン　ここから
*xxxxxメッセージを送信し、その応答を受け取るまで
*同期型  
*************************************************************************/
function sendMessage_xxxxx() {
        //promiseを返却
        return new Promise(function (resolve) {
            //background.jsへxxxxxメッセージを送信
            console.log("sendMessage({type: 'xxxxx'}を送信します。");
            
            chrome.runtime.sendMessage({type: "xxxxx"}, function (response) {
                //応答が返ります。
                console.log(response.xxxxx);
                //promiseをresolveします。解決しました。
                resolve(response.xxxxx);
            });
        });

}
/*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
 *xxxxx
 * 
 *◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
$("#xxxxx").on('click', (e) => {
        /*
         * 
         */
        sendMessage_xxxxx().then(response => {
            //応答を表示します。
            //
            $("#popup").html("xxxxx " + response);
            $("#popup").css({"display": "block", "zoom": 2});

        });
});
/***********************************************************************
*共通パターン　ここまで
*
*  
*************************************************************************/


/*●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
 *check_iframe()
 * 
 *●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●*/
function check_iframe() {
    //iframe要素自体の属性は取得できる。
    let aaa = document.querySelectorAll(".cc-m-video-container");
    //let ccc = aaa.querySelectorAll(".cc-m-video");
    //let bbb = aaa.querySelector(".cc-m-video").querySelectorAll(".cc-m-video-container")[0].src;
    let sw = 0;
    let vid;
    for (let i = 0; i < aaa.length; i++) {

        //
        bbb = aaa[i].src;
        //ここで、vidを取得
        vid = bbb.split("?")[0].split("/")[4];

        //ここで、リピートを追加
        if (bbb.indexOf("&vq=hd1080") !== -1) {
            //?があれば
            if (bbb.indexOf("&autoplay") !== -1) {
                continue;
            }
            else {
                //let src = val.src;    
                //リピート追加
                //?autoplay=1&amp;loop=1&amp;playlist=
                aaa[i].src = aaa[i].src.replace(/&vq=hd1080/, "&vq=hd1080&autoplay=1&amp;loop=1&amp;playlist=" + vid);
                sw = 1;
                continue;
            }
        }

    }
    //alert("リピート");
    //
    if (sw === 1) {
        //alert("リピート機能を追加しました。");
    }
    else {

        //alert("リピート設定されています。");    
    }


}
/*◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
◆$("body").on('click' 
◆ 
◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
$("body").on('click', (e) => {
    if (e.ctrlKey === true) {
        /*************************************************************************************
         *ここが、何回も自動で呼ばれることがあるのは????? 
         *このリスナーが蓄積されているからか? 
         *リロードされるたびに、蓄積されるか??? 
         * 
         **************************************************************************************/
        if (location.href.indexOf("https://tecoyan-net.jimdofree.com/") !== -1 && $(".cc-m-video-container").length !== 0) {
            //alert("clickSetメッセージを送信します。");
            //ここで、リピートを追加
            check_iframe();
            /**********************************************************************************
             *popパネルの枠を表示 
             *動画情報表示用
             *すでにあれば、スキップ 
             ***********************************************************************************/
            if ($("#pop").length === 0) {
                let html = "";
                html += "<div id='pop' style='z-index:9999;padding:13px;overflow:scroll;background-color:lightpink;position:fixed;top:0%;left:50%;width:800px;height:550px;'>\n\
<h2 style='float:left;background-color:lightyellow;'>動画データ(デバッグエイド)</h2>\n\
<span id='hover' style='position:absolute;margin-top:1.5%;margin-left:1%;background-color:lightgreen;width:400px;height:25px;float:left;'></span><br>\n\
<button id='tabId' title='先にこのボタンでtabIdを設定してから、他のボタンのテストを行います。' style='position:absolute;top:7%;left:0%;zoom:1.1;margin-top:10px;margin-left:10px;float:left;'>tabId取得</button>\n\
<button id='frameIds' style='position:absolute;top:7%;left:10%;zoom:1.1;margin-top:10px;margin-left:10px;float:left;'>frameIds取得</button>\n\
<button id='webNavi' style='position:absolute;top:9%;left:24.3%;zoom:1.3;float:right;'>webNavi</button>\n\
<button id='save_disp' style='position:absolute;top:9%;left:35%;float:right;'>表示</button>\n\
<button id='hovertrigger' style='position:absolute;top:9%;left:45%;zoom:1.3;float:right;'>保存</button>\n\
<button id='reset' style='position:absolute;top:9%;left:70%;float:right;'>リセット</button>\n\
<div id='popup' style='position:relative;top:3%;width:800px;height200px;clear:both;'></div>\n\
<div id='videoInfo' style='position:relative;top:10%;width:800px;height200px;clear:both;'></div>\n\
</div>";
                $(".cc-page").append(html);
                $("#pop").draggable();

/*◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
◆$("#webNavi").on('click' 
◆ 
◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
function sendMessage_webNavi() {
        //promiseを返却
        return new Promise(function (resolve) {
            //background.jsへwebNaviメッセージを送信
            console.log("sendMessage({type: 'webNavi'}を送信します。");
            //
            chrome.runtime.sendMessage({type: "webNavi"}, response=> {
                //応答が返ります。
                console.log(response);
                resolve(response);
            });
        });

}
/*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
 *webNavi
 * 
 *◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
$("#webNavi").on('click', (e) => {
        //
        sendMessage_webNavi().then(message => {
            //応答を表示します。
            //
            let webNavi = message.content;
            //ここで、pop画面に表示
            let html = "<br>";
            for (let i = 0; i < message.frm_arr.length; i++) {
                html += message.frm_arr[i] + "<br>";
            }

            $("#popup").html("webNavi " + webNavi + "  " + html);
            $("#popup").css({"display": "block", "zoom": 2});            


        });
});
                 /*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
                 *hoverTriggerメッセージ送信 
                 * 
                 *■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
                function sendMessage_hoverTrigger() {
                        return new Promise(function (resolve) {
                            //background.jsへ送信
                            console.log("sendMessage({type: 'hoverTrigger'}を送信します。");
                            chrome.runtime.sendMessage({type: "hoverTrigger"}, response => {
                                console.log("hoverTriggerの応答が来ました。　" + response);
                                resolve(response);
                            });
                            return true;
                        });

                }
                /*◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
                 ◆$("#hovertrigger").on('click' 
                 ◆保存
                 ◆ 
                 ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
                $("#hovertrigger").on('click', (e) => {
                        //
                        sendMessage_hoverTrigger().then(response => {
                            //  
                            //  
                            $("#popup").html("保存 " + response);
                            $("#popup").css({"display": "block", "zoom": 2});

                        });

                });
                /*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
                 *get_frameIdメッセージ送信 
                 * 
                 *■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
                function get_frameIdAll_message() {
                        return new Promise(function (resolve) {
                            //background.jsへ送信
                            chrome.runtime.sendMessage({type: "get_frameIdAll"},response=>{
                                         console.log("get_frameIdAllの応答が来ました。　" + response);
                                         resolve(response);
                                
                            });

                        });
                };
                /***************************************************************
                 *get_frameIdAll() 
                 *同期型 
                 ******************************************************************/
//                async function get_frameIdAll() {
//                        const resp = await get_frameIdAll_message();
//                        console.log(resp);
//                        return resp;
//
//                };
                /*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
                 *$("#frameIds").on('click' 
                 * 
                 *◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
                $("#frameIds").on('click', (e) => {
                        console.log("get_frameIdAll()コール　");
                         get_frameIdAll_message().then(resp => {
                                frm_arr = resp;
                                 //ここで、pop画面に表示
                                 let html = "framesId  <br>";
                                 $.each(frm_arr, (i, val) => {
                                     //  
                                     html += val + "<br>";
                                 });
                                 if (html === "framesId  <br>") {
                                     $("#frameIds").trigger('click');

                                 }
                                 else {
                                     $("#popup").html(html);
                                     $("#popup").css({"display": "block", "zoom": 2});
                                 }
                        
                        
                         });

                });
                /*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
                 *get_tabIdメッセージ送信 
                 * 
                 *■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
//                function handleResponse_sample(message) {
//                        console.log(`バックグラウンドスクリプトが応答しました: ${message}`);
//                        $("#popup").html("tabId " + message);
//                        $("#popup").css({"display": "block", "zoom": 2});
//
//                }

                function handleError(error) {
                        console.log(`Error: ${error}`);
                }

                function sendMessage_sample() {
                        return new Promise(function (resolve) {
                            (async()=>{
                                    //background.jsへ送信
                                    console.log("sendMessage({type: 'get_tabId'}を送信します。");
                                    await chrome.runtime.sendMessage({type: "get_tabId"}, function(response) {
                                        console.log(response);
                                        resolve(response.tabId);
                                        //return response.tabId;
                                    });
                            })();
                        });

                }
                /*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
                 *$("#tabId").on('click' 
                 * 
                 *◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
                $("#tabId").on('click', (e) => {
                        /*
                         * 
                         */
                        sendMessage_sample().then(response => {
                            //応答
                            //
                            tabId = response;
                            $("#popup").html("tabId " + response);
                            $("#popup").css({"display": "block", "zoom": 2});

                        });
                });


            }
            //
            function handleResponse_clickSet(msg) {

                //応答
                if (msg.sts === "テスト") {
                        //ここで、tabIdとfrm_arr[]をもらう。
                        tabId = msg.tabId;
                        frm_arr = msg.frm_arr;
                        alert("completedが返されました。");
    //
                        //ここで削除すると、以後は、リロードしない限り、clickが効かない
                        $("body").off('click');
                }


            }
                        /**************************************************************
             *clickSetメッセージで、プレーヤーのコントロールにある再生/一時停止
             *ボタンにclickリスナーを登録(altKey押し下げ)
             *
             *  
             ***************************************************************/
            //このあと、background.jsへ通知する。
            //再生/停止ボタンの設定登録
            chrome.runtime.sendMessage({type: 'clickSet'}, function (msg) {
                //応答
//                if (msg.sts === "completed") {
//                    //ここで、tabIdとfrm_arr[]をもらう。
//                    //tabId = msg.tabId;
//                    //frm_arr = msg.frm_arr;
//                    //alert("completedが返されました。");
//
//                    //ここで削除すると、以後は、リロードしない限り、clickが効かない
//                    //$("body").off('click');
//                }
            });
            /*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
             ◆$("#save_disp").on('click' 
             ◆ 
             ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
            $("#save_disp").on('click', () => {
                    /*************************************************************
                     *データを表示する。
                     ***************************************************************/
                    let data = $.ajax({
                        url: 'https://favorite.tecoyan.net/slim/get_jimdo.php',
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        //data: params,
                        async: false
                    }).responseText;
                    let response = JSON.parse(data);
                    console.log("get_jimdo  vid = " + response[0][0]);

                    let html = "";
                    $.each(response, (i, val) => {
                        //
                        html += "vid ：" + val[0] + "<br>tabId ：" + val[1] + "<br>frameId ：" + val[2] + "<br>title ：" + val[3] + "<br>ariaLabel ：" + val[4] + "<br><br><br>";

                    });

                    //$(".ariaInfo").html(`<div class='ariaInfo' style='background-color:lightblue;position:relative;top:0%;left:0%;width:600px;height:100px;'>` + html + `</div>`);
                    $("#videoInfo").html(`<div class='ariaInfo' style='zoom:1.5;background-color:lightblue;position:relative;top:0%;left:0%;width:600px;height:100px;'>` + html + `</div>`);
                    document.querySelector("#popup").style.display = "block";

            });
            /*◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆　
             ◆$("#reset").on('click' 
             ◆ 
             ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆イベントリスナー◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆*/
//
            $("#reset").on('click', () => {
                    //
                    $("#popup").html("");
                    document.querySelector("#popup").style.display = "none";
                    $(".ariaInfo").css("display","none");
                    //document.querySelector(".ariaInfo").style.display = "none";

            });

        }

    }
});
//
function handleMessage(message,sender,sendResponse){
            //
            switch(message.type){
                case "set_tabId":
                        //
                        alert(message.content);
                    
                    break;
                
                
                
            }
    
    
}
//
chrome.runtime.onMessage.addListener(handleMessage);
