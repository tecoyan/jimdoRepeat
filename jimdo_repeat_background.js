
/******************************************************************************
 *Jimdoリピートプラグイン
 *jimdo_repeat_background.js
 *
 *
 *
 ******************************************************************************/
let active_tabId;
let tabId;
let extId;
let ownId;
let frm_arr;
let frm_arr_ = [];
let frm_data;
let ariaLabel;
let title;
let data;
//保存
let save =[];
let html = "テスト";
/*
 * 
 * @type type
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log("タブアクティベイトリスナー　タブid取得　"+activeInfo.tabId);
        //ここで、カレントの全タブを取得して、DBへ保存
        chrome.tabs.query({}, tabs => {
            //**********************************************
            //DBへタブタイトルとタブidを保存
            //タブの切り替え毎に
            //**********************************************
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf("https://tecoyan-net.jimdofree.com/") !== -1) {
                    active_tabId = tabs[i].id;
                    tabId = tabs[i].id;
                   
                }

            }
        });

}); 
/***************************************************************
 *アクティブタブで
 *再生、一時停止メッセージを受信 
 * 
 * 
 ****************************************************************/
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    //
    switch (msg.type) {
        //これは、WebNaviで、frm_arr[]を返却する。tabIdはアクティブのId
        
        case "get_frm_arr":
            //ここで、タブの全フレームデータを取得して保存
            chrome.webNavigation.getAllFrames({tabId: tabId, }).then(logFrameInfo_get_frm_arr).then((resp)=>{
                        console.log("■get_frm_arr 応答　"+resp);
                        sendResponse(resp);
                
            });
                    //
                    function logFrameInfo_get_frm_arr(framesInfo) {
                        console.log("■logFrameInfo_get_frm_arr() エントリー　");
                        //
                        const frm_arr = Object.values(framesInfo);
                        (async () => {
                           /****************************************************************
                           *すべての動画フレームが対象 
                           *パラメーター　：　
                           **************************************************************************/
                            for await (const frm of frm_arr) {
                                try {
                                    /*********************************************************
                                    *frameType sub_frameのみ
                                    *    
                                    *********************************************************/
                                    if (frm.frameType === "sub_frame") {
                                        /******************************************************
                                        *すべてのfr_arr[]を取得して、メッセージに応答する。 
                                        *sendResponse(); 
                                        ********************************************************/
                                        frm_arr_.push(frm.frameId);
                                       
                                       
                                        await sleep(0.5);

                                    }
                                    else {

                                    }
                                }
                                catch (e) {

                                }
                            }
                            console.log("■logFrameInfo_get_frm_arr() 　"+frm_arr_);
                            
                        })();
                        console.log("■logFrameInfo_get_frm_arr() return "+frm_arr_);
                        return frm_arr_;
                    }
                    
            sendResponse("応答");        
            break;
        /**********************************************************
        *hoverメッセージを受信 
        * 
        * 
        ************************************************************/
        case "hover":
            console.log("hover受信");
            //親フレーム　frameId = 0へ、executeScript()を出す。
            //tabIdが消えている現象が発生
            chrome.scripting.executeScript({
                target: {tabId: msg.tabId, frameIds: [0]},
                files: ["jquery.js"]
            }).then(() => {
                //ここでもexecuteScript()を出す
                chrome.scripting.executeScript({
                    //ターゲットのフレームIdのDOMへアクセス  
                    target: {tabId: msg.tabId, frameIds: [0]},

                    args: [msg.ariaLabel,msg.frameId,msg.title],
                    //実行コード
                    func: (ariaLabel,frameId,title) => {
                        //alert("ホバーして表示します。");
                        console.log("hoverテスト");
                        //ここで、#hoverへステータスを表示
                        //動画のframeIdも表示
                        $("#hover").html(ariaLabel+"  <span style='background-color:lightblue;'>"+frameId+"   "+title+"</span>");
                        $("#hover").css("zoom","1.5");



                    }
                });

            });
            break;
        case "hover_leave":
            console.log("hover_leave受信");
            //親フレーム　frameId = 0へ、executeScript()を出す。
            chrome.scripting.executeScript({
                target: {tabId: tabId, frameIds: [0]},
                files: ["jquery.js"]
            }).then(() => {
                //ここでもexecuteScript()を出す
                chrome.scripting.executeScript({
                    //ターゲットのフレームIdのDOMへアクセス  
                    target: {tabId: tabId, frameIds: [0]},

                    args: [],
                    //実行コード
                    func: () => {
                        alert("ホバーリーブします。");
                        console.log("hover_leaveします。");
                        //ここで、#hoverへステータスを表示
                        $("#hover").html("");

                    }
                });

            });
            break;
            
        /***************************************************************
        *すべての動画フレームに対して、再生/一時停止ボタン要素のclickリスナーを登録 
        * パラメータはなし。
        *****************************************************************/
        case "clickSet":
           
           extId = chrome.runtime.id;
           //
            async function async_Loop() {
                //Jimdoタブのframeプレーヤーで
                //tabs.query() Webnavigation
                chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT},function (tabs) {
                    //アクティブタブで、youtubeのiframeプレーヤーに対して
                    //再生、一時停止する
                    console.log("Msg■clickSet  tabs.length = "+tabs.length);
                    const tab_arr = Object.values(tabs);
                    //アクティブタブをセットしておく。
                    (async () => {
                        for await (const tab of tab_arr) {
                            if (tab.active === true) {
                                console.log("Msg■clickSet  active_tabId "+active_tabId);
                                active_tabId = tab.id;
                                break;
                            }else{
                                console.log("Msg■clickSet  active_tabId false");
                                
                            }
                        }
                    })();
                    //
                    (async () => {
                        /*************************************************************************
                        *タブはアクティブタブのみが対象 
                        *
                        ****************************************************************************/
                        for await (const tab of tab_arr) {
                            /*********************************************************
                             *iframeプレーヤーチェック
                             *ここで、今開いているタブのみにする　アクティブのタブ  
                             *********************************************************/
                            if (active_tabId === tab.id) {
                                console.log("Msg■clickSet  for await ループ　" + tab.id);
                                tabId = tab.id;
                                try {
                                    //urlをチェック                    
                                    if (tab.url.indexOf("https://tecoyan-net.jimdofree.com/") !== -1) {
                                        //ここで、タブの全フレームデータを取得して保存
                                        chrome.webNavigation.getAllFrames({tabId: tabId, }).then(logFrameInfo1, onError);
                                        console.log("Msg■clickSet  getAllFrames()コール後　" + tabId);
                                        await sleep(0.5);
                                    }else {

                                    }
                                    break;

                                }
                                catch (e) {
                                    //なし
                                }
                                
                            }
                        }

                    })();
                    /***************************************************************************
                     *すべてのフレームの中から、プレーヤーフレームを検索して出力
                     * sub_frameのみ
                     * 
                     *****************************************************************************/

                    //
                    function logFrameInfo1(framesInfo) {
                        //
                        console.log("Msg■clickSet  logFrameInfo　" + framesInfo.length);
                        const frm_arr_ = Object.values(framesInfo);
                        (async () => {
                           /****************************************************************
                           *すべての動画フレームが対象 
                           *bodyのclickリスナーを登録
                           *パラメーター　：　
                           **************************************************************************/
                            //すべてのyoutube iframeプレーヤーに対してexecuteScript()を実行
                            //forループで、個々に処理しているが、一括では? 再生/一時停止ボタンの変更を
                            //いったんすべて、再生表示にして、一つのみを一時停止表示にする。
                            frm_arr = [];
                            for await (const frm of frm_arr_) {
                                console.log("Msg■clickSet  frm.frameId　= " + frm.frameId);
                                frm_arr.push(frm.frameId);
                                
                                try {
                                    /*********************************************************
                                    *youtube iframeプレーヤーチェック
                                    *今開いているタブのみにする　アクティブのタブ
                                    *frameType sub_frameのみ
                                    *    
                                    *********************************************************/
                                    if (frm.frameType === "sub_frame") {
                                        console.log("Msg■clickSet  フレームInfo url = " + frm.url + "  " + frm.frameId);
                                        //executeScript()を実行
                                        //filesとfuncを同時に指定できないので分けて出す。
                                        chrome.scripting.executeScript({
                                            target: {tabId: tabId, frameIds: [frm.frameId]},
                                            
                                            files: ["jquery.js"]
                                        }).then(() => {
                                            //ここでもexecuteScript()を出す
                                            chrome.scripting.executeScript({
                                                //ターゲットのフレームIdのDOMへアクセス  
                                                target: {tabId: tabId, frameIds: [frm.frameId]},
                                                /*************************************************************
                                                *otherTriggerメッセージで渡すパラメーター
                                                * frm.frameId,
                                                * extId,
                                                * frm_arr,
                                                * tabId,
                                                * frm.frameId
                                                * 
                                                ****************************************************************/
                                                args: [frm.frameId,extId,frm_arr,tabId,frm.frameId],
                                                //実行コード
                                                func: (frameId,extId,frm_arr,tabId,ownId) => {
                                                    /***************************************************************************
                                                    *clickSetメッセージ
                                                    *ここからが、executeScript()の処理関数
                                                    *特定のtabIdの特定のframeIdで動作
                                                    ****************************************************************/
                                                    console.log("Msg■clickSet  このフレーム("+frameId+")のbody要素にclickリスナーを登録します。　"+frameId);
                                                    $("body").on('click', (e) => {
                                                                let aa = document.querySelector(".ytp-play-button");
                                                                let tt;
                                                                /**********************************************************
                                                                *altKey押し下げは、一回目は不安定なため、続けて2回目は正しい結果に 
                                                                * なる。原因は不明。
                                                                *************************************************************/
                                                                if(e.altKey===true){
                                                                           
                                                                           alert("altKeyが押されました。 "+frameId+"  "+document.title+"  "+aa.ariaLabel); 
                                                                           //このdocumentは、altKeyを押している動画のドキュメント
                                                                           //
                                                                          
                                                                           if(aa.title!==""){
                                                                               tt = aa.title;
                                                                               
                                                                           }else{
                                                                               tt = aa.ariaLabel;
                                                                               
                                                                           }
                                                                           console.log("Msg■clickSet  altKey クリック時のタイトル　"+document.title+"　フレーム("+frameId+")　"+tt);
                                                                           /***************************************************************************
                                                                           *ここで、'otherTrigger'メッセージを送信
                                                                           *popパネルにボタン情報を表示
                                                                           *ariaLabelの表示内容が安定しない??? 
                                                                           *再生/一時停止ボタンのariaLabelの内容とボタンのホバー時の内容が一致しない???                                                                           * 
                                                                           ****************************************************************************/
                                                                           //alert("Altキー　押し下げ　"+ownId);
                                                                           let dd = {type: 'otherTrigger',frm_arr:frm_arr,tabId:tabId,ownId:ownId,title:document.title,ariaLabel:tt};
                                                                           chrome.runtime.sendMessage(extId,dd, function (msg) {
                                                                                           //応答は? 特になし。     
                                                                           });

                                                                }
                                                    });
                                                    /********************************************************************
                                                     *ホバーした時のtitle属性をとれるか
                                                     * 
                                                     * 
                                                     *********************************************************************/
                                                    /*イベントリスナー登録*/
                                                    $(document).on({
                                                        "mouseenter": function (e) {
                                                            //alert("マウスエンター");
                                                            //ここで、title属性を取得
                                                            let aa = document.querySelector(".ytp-play-button");
                                                            if(aa.title===""){
                                                                /*************************************************
                                                                *以下が表示されないのは、フレームIdが0ではないため。 
                                                                *この要素は動画の外側にあるため。 
                                                                *alert()文は表示される。
                                                                *************************************************/
                                                               //
                                                                chrome.runtime.sendMessage(extId,{type:"hover",ariaLabel:aa.ariaLabel,frameId:frameId,title:document.title,tabId:tabId}, function (msg) {
                                                                                 //応答は? 特になし。     
                                                                 });
                                                               
                                                                
                                                                //alert(aa.ariaLabel);
                                                                
                                                            }else{
                                                                //alert(aa.title);
                                                                chrome.runtime.sendMessage(extId,{type:"hover",ariaLabel:aa.title,frameId:frameId,title:document.title,tabId:tabId}, function (msg) {
                                                                                 //応答は? 特になし。     
                                                                 });

                                                                
                                                            }

                                                        },
                                                        "mouseleave": function (e) {

                                                        }
                                                    }, ".ytp-play-button");                                                        
    
                                                    
                                                    

                                                }       //end func() executeScript()
                                            });         //end executeScript()

                                        }); //end .then(()=>{ 
                                        await sleep(0.5);

                                    }
                                    else {

                                    }
                                }   //try()
                                catch (e) {

                                }
                            }       // end for()
                        })();       //end async()
                    }               //end function logFrameInfo1
                    //
                    function onError(error) {
                        console.error(`Error: ${error}`);
                    }
                    //

                });                 //end chrome.tabs.query
            }                       //end async_Loop()
            (async () => {
                //ここで、tabId,frm_arrがないケースがある。????
                //
                async_Loop().then(sendResponse({sts:"completed",tabId:tabId,frm_arr:frm_arr}));

            }).call();
            break;
      /*****************************************************
       *otherTriggerメッセージ
       *任意の動画で、altKey+clickすると、ownId以外のframeIdで
       *続けてexecuteScript()を出せば、ボタン情報を表示可能。 
       * 
       *****************************************************/
      case "otherTrigger":
            //
            console.log("otherTrigger ariaLabe = "+msg.ariaLabel);
            
            ariaLabel = msg.ariaLabel;
            title = msg.title;        
            ownId = msg.ownId;
            tabId = msg.tabId;
            frm_arr = msg.frm_arr;
            
            console.log("otherTrigger受信 ownId  "+ownId);
            //整形
            frm_data = [];

            /*************************************************
            * 各動画のデータを取得して、配列に保存
            * frm_arr frameIdの配列
            **************************************************/
            data = [];

            /*****************************************************
            * 先にownId以外のframeIdとtabIdに対してexecuteScript()を実行
            * して情報をpopへ表示
            * 
            *******************************************************/

            for(const frm of frm_arr){
                        console.log("●otherTrigger dd = "+frm);
                        //
                        chrome.scripting.executeScript({
                         target: {tabId: tabId, frameIds: [frm]},
                         files: ["jquery.js"]
                     }).then(() => {
                         //ここでもexecuteScript()を出す
                         chrome.scripting.executeScript({
                                 //ターゲットのフレームIdのDOMへアクセス  
                                 target: {tabId: tabId, frameIds: [frm]},
                                 //
                                 args: [data,tabId,frm,html],
                                 //実行コード
                                 func: (data,tabId,frmId,html) => {
                                          /***********************************************************************
                                          *他のフレームで、このexecuteScriptスクリプトを実行 
                                          *
                                          * 
                                          ************************************************************************/
                                          let vid_;let frameId;let title;let ariaLabel; 
                                          let aa = document.querySelector(".ytp-play-button");
                                          vid_ = document.URL.split("/")[4].split("?")[0];
                                                        //
                                                        vid = vid_;
                                                        tabid = tabId;
                                                        frameid = frmId;
                                                        title = document.title;
                                                        ariaLabel = aa.ariaLabel;
                                                        
                                                        console.log("frm of frm_arr = "+title+"  "+ariaLabel);
                                                        /*********************************************************************
                                                        *このhtmデータを保存して、
                                                        *
                                                        * 次のexecuteScript()の実行時、取得したい。
                                                        *   
                                                        ************************************************************************/
                                                        //このhtmlデータは、フレームId 0に引き継ぐ
                                                        //保存は場所は、DB 動画毎に保存
                                                        let params = {
                                                            vid:vid,
                                                            tabId:tabid,
                                                            frameId:frameid,
                                                            title:title,
                                                            ariaLabel:ariaLabel
                                                        };
                                                        var data = $.ajax({
                                                              url: 'https://favorite.tecoyan.net/slim/save_jimdo.php',
                                                              type: 'POST',
                                                              dataType: 'html',
                                                              cache: false,
                                                              data: params,
                                                              async: false
                                                        }).responseText;
                                                        console.log("DB保存しました。"+title);
                                                        alert("save_jimdo.php 512行  aa.title= " + a[0].title + " aa.ariaLabel= " + a[0].ariaLabel);
   
                                 }

                         });                   


                     });
            
            }
            /***************************************************************
             * frm 0に対して、
             * executeScript()を出す。
             * 親フレームで、実行
             * pop要素にhtmlデータを出力
             * 
             ***************************************************************/
            chrome.scripting.executeScript({
                         target: {tabId: tabId, frameIds: [0]},
                         files: ["jquery.js"]
                     }).then(() => {
                         //ここでもexecuteScript()を出す
                         chrome.scripting.executeScript({
                                 //ターゲットのフレームIdのDOMへアクセス  
                                 target: {tabId: tabId, frameIds: [0]},
                                 //htmlデータを渡すには、?????
                                 args: [html],
                                 //実行コード
                                 func: () => {
                                     
                                            document.removeEventListener('click',save_hover());                                                        //
                                            document.addEventListener('click',save_hover());
                                            //
                                            function save_hover(){
                                                alert("ホバーのデータをDBに保存します。");
                                            }

                             }

                         });                   


                     });

            break;
      /****************************************************************
       *動画情報を一括保存して、その情報を表示する。 
       *executeScript()を実行して、動画情報を取得して保存、 
       *それを動画の数だけ行う。
       *
       *******************************************************************/    
      case "saveDisp":
            //msg.tabIdを受信要
          
            console.log("saveDisp受信時のtabId  "+msg.tabId);
            /***************************************************************
            *ここで、executeScript()を出して、動画の個々に、ホバー時のデータを取得して、
            *dbへ保存 
            *親フレームで実行
            *
            ******************************************************************/
            chrome.scripting.executeScript({
                         target: {tabId: tabId, frameIds: [0]},
                         files: ["jquery.js"]
                     }).then(() => {
                         //ここでもexecuteScript()を出す
                         chrome.scripting.executeScript({
                                 //ターゲットのフレームIdのDOMへアクセス  
                                 target: {tabId: tabId, frameIds: [0]},
                                 //htmlデータを渡すには、?????
                                 args: [],
                                 //実行コード
                                 func: () => {
                                            //親フレームのdocumentでclickする。
                                            //ホバーデータをDBへ保存するリスナーを登録
                                            document.removeEventListener('click',save_hover());                                                        //
                                            document.addEventListener('click',save_hover());
                                            //
                                            function save_hover(){
                                                alert("save_dispボタン　ホバーのデータをDBに保存します。");
                                            }

                                 }

                         });                   


                     });      

            break;
        /******************************************************************
        *保存と表示ボタンをclickすると、hoverTriggerメッセージを送信して、ここへ来る
        *ここで、ホバーデータを自動で取得して、保存 
        *3つの動画で、 
        *ホバーイベントをtriggerして、取得できるか??
        *frm_arr[]データは、WebNaviで取得する。
        *先に動画のフレームでDB保存し、最後にフレーム0でDBのデータを表示する。
        *frm_arr[]で、フレーム0を最後に置く。
        *******************************************************************/   
        case "hoverTrigger":        
            
            console.log("■Msg hoverTrigger受信 tabId= "+tabId);
            //整形
            frm_data = [];
            chrome.webNavigation.getAllFrames({tabId: tabId}).then(logFrameInfo_hover);
            function logFrameInfo_hover(framesInfo) {
                        console.log("■Msg hoverTrigger logFrameInfo_get_frm_arr() エントリー　");
                        //
                        const frm_arr = Object.values(framesInfo);
                        //フレーム0を最後に置く
                        
                        
                        
                        (async () => {
                           /****************************************************************
                           *すべての動画フレームが対象 
                           *パラメーター　：　
                           **************************************************************************/
                          frm_arr_ = [];
                            for await (const frm of frm_arr) {
                                try {
                                    /*********************************************************
                                    *frameType sub_frameのみ
                                    *    
                                    *********************************************************/
                                    if (frm.frameType === "sub_frame") {
                                        /******************************************************
                                        *すべてのfr_arr[]を取得して、メッセージに応答する。 
                                        *sendResponse(); 
                                        ********************************************************/
                                        frm_arr_.push(frm.frameId);
                                        await sleep(0.5);

                                    }
                                    else {

                                    }
                                }
                                catch (e) {

                                }
                            }
                            //
                            frm_arr_.push(0);
                            //このタイミングでは取得できている。
                            console.log("■Msg hoverTrigger logFrameInfo_get_frm_arr() 　"+frm_arr_);

                        })();
                        //(async()=>{})();
                        //しかし、非同期のため、こちらが先に来る。まだ、frm_arr_[]はない。
                        console.log("■Msg hoverTrigger logFrameInfo_get_frm_arr() return "+frm_arr_);
                        //
                        return frm_arr_;
            }

            /*************************************************
            *各動画のデータを取得して、DBへ保存
            *各動画で、executeScript()を実行して、 
            *frameIdの使いまわしはできない?? 常にWebNaviで最新のフレームIdを
            *取得してから実行する。????
            **************************************************/
            data = [];
            for (const frm of frm_arr_) {
                    console.log("■Msg hoverTrigger 次のfrm "+frm);
                     //frm 0は除く
                     if(frm !== 0){
                                //frm_dataには、すべての動画のボタン情報がある。
                                //ボタンのホバーをtriggerできるか?
                                //画面にデータが表示される。
                                //以下はexecuteScript()で実行する。
                                /*
                                 *frameIds: [frm]のfrmが???????????????? 
                                 */
                                chrome.scripting.executeScript({
                                    target: {tabId: tabId, frameIds: [frm]},
                                    files: ["jquery.js"]
                                }).then(() => {
                         //ここでもexecuteScript()を出す
                         chrome.scripting.executeScript({
                                 //ターゲットのフレームIdのDOMへアクセス  
                                 target: {tabId: tabId, frameIds: [frm]},
                                 //引数
                                 args: [data,tabId,frm,html],
                                 //実行コード
                                 func: (data,tabId,frm,html) => {
                                     console.log("■Msg hoverTrigger executeScript()呼び出し　"+frm);

                                     /******************************************************
                                     *ここから、動画のdocumentでexecuteScript()を実行 
                                     *
                                     ******************************************************/
                                     var a = $(".ytp-play-button");
                                     console.log("■Msg hoverTrigger "+tabId+" "+frm+" "+a[0].title+"  "+a[0].ariaLabel+"  "+document.title);
                                     /**************************************************************
                                     *DBへ保存
                                     *  
                                     *******************************************************************/
                                     //保存は場所は、DB 動画毎に保存
                                     let params = {
                                           vid:document.URL.split("/")[4].split("?")[0],
                                           tabId:tabId,
                                           frameId:frm,
                                           title:document.title,
                                           ariaLabel:a[0].title
                                     };
                                     var data = $.ajax({
                                             url: 'https://favorite.tecoyan.net/slim/save_jimdo.php',
                                             type: 'POST',
                                             dataType: 'html',
                                             cache: false,
                                             data: params,
                                             async: false
                                     }).responseText;
                                     console.log("■■■Msg hoverTrigger DB保存しました。"+data+"  "+document.title);
                                     alert("save_jimdo.php 705行  aa.title= " + a[0].title + " aa.ariaLabel= " + a[0].ariaLabel);
                                     
                                     /*****************************************************
                                     *保存したデータを表示 
                                     *これはできない。
                                     *今のdocumentではないため。 
                                     *****************************************************/
//                                     data = $.ajax({
//                                                url: 'https://favorite.tecoyan.net/slim/get_jimdo.php',
//                                                type: 'GET',
//                                                dataType: 'json',
//                                                cache: false,
//                                                //data: params,
//                                                async: false
//                                     }).responseText;
//                                     let response = JSON.parse(data);
//                                     console.log("get_jimdo  vid = "+response[0][0]);
//                                          
//                                     html="";
//                                     $.each(response,(i,val)=>{
//                                                   //
//                                                   html += "vid ："+val[0]+"<br>tabId ："+val[1]+"<br>frameId ："+val[2]+"<br>title ："+val[3]+"<br>ariaLabel ："+val[4]+"<br><br><br>";
//                            
//                                     });
//                                     //このセレクター(#popup)には、参照できない。
//                                     //これは、子フレームのため、親フレームでは、アクセスできない。
//                                     //そのため、frameId(親フレーム0)を指定して、executeScript()でアクセスする。
//                                     display_video_Info();
//                                     //
//                                     //
//                                     function display_video_Info(){
//                                                //
//
//
//                                     }                                     
                                     
 
                                 }

                         });                   


                     });                                

                     }else{
                                //親フレームの場合、
                                //DBのデータを表示
 
                     }

            }

            break;
        
    }

});
