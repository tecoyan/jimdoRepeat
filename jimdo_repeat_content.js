/**********************************************************************
*JimdoRepeatプラグイン
*jimdo_repeat_content.js
*機能   (1)ジンドゥー編集で、youtube動画のリピート機能を追加します。
*Jimdoの画面構成・構造は他のブラウザーとは少し異なっているようです。そのため、
*DOMアクセスが難しくなっています。
*編集画面で、リピート機能を保存しようとしましたが、うまくできませんでした。
*そのため、動的にリピート機能を設定する方法をとっています。
*あらかじめ、jquery.jsをロードしています。
***********************************************************************/
let tabId;
let frm_arr = [];

//このファイルで使用している変数のみにする
/**********************************************************************
*Jimdoリピートプラグイン
*jimdo_repeat_obj.js
*
***********************************************************************/
//
function check_iframe(){
    //iframe要素自体の属性は取得できる。
    let aaa = document.querySelectorAll(".cc-m-video-container");
    //let ccc = aaa.querySelectorAll(".cc-m-video");
    //let bbb = aaa.querySelector(".cc-m-video").querySelectorAll(".cc-m-video-container")[0].src;
    let sw = 0;let vid;
    for(let i=0;i<aaa.length;i++){
       
                //
                bbb = aaa[i].src;
                //ここで、vidを取得
                vid = bbb.split("?")[0].split("/")[4];
                
                //ここで、リピートを追加
                if(bbb.indexOf("&vq=hd1080")!==-1){
                        //?があれば
                        if(bbb.indexOf("&autoplay")!==-1){
                                 continue;
                        }else{
                                //let src = val.src;    
                                //リピート追加
                                //?autoplay=1&amp;loop=1&amp;playlist=
                                aaa[i].src = aaa[i].src.replace(/&vq=hd1080/,"&vq=hd1080&autoplay=1&amp;loop=1&amp;playlist="+vid);
                                sw = 1;
                                continue;
                        }
                }
        
    }
    alert("リピート");
    //
    if(sw === 1){
                alert("リピート機能を追加しました。");
    }else{
        
                alert("リピート設定されています。");    
    }
  

}
/******************************************************************************************
*content.jsで、body要素に対して、clickリスナーを定義 
*ページをリロードするたびにリスナーを登録するため、すでに登録されていれば、登録しない。 
*
*******************************************************************************************/
    $("body").on('click',(e)=>{
        
        if(e.ctrlKey === true){
        
        /*************************************************************************************
        *ここが、何回も自動で呼ばれることがあるのは????? 
        *このリスナーが蓄積されているからか? 
        *リロードされるたびに、蓄積されるか??? 
        * 
        **************************************************************************************/
        if(location.href.indexOf("https://tecoyan-net.jimdofree.com/")!==-1&&$(".cc-m-video-container").length !== 0){
                alert("clickSetメッセージを送信します。");
                //ここで、リピートを追加
                check_iframe();
                /**********************************************************************************
                *popパネルの枠を表示 
                *動画情報表示用
                *すでにあれば、スキップ 
                ***********************************************************************************/
                if($("#pop").length===0){
                         $(".cc-page").append("<div id='pop' style='overflow:scroll;background-color:lightpink;position:fixed;top:0%;left:50%;width:800px;height:550px;'><h2 style='float:left;background-color:lightyellow;'>動画データ</h2><span id='hover' style='width:400px;height:25px;float:left;'></span><button id='reset' style='float:right;'>リセット</button><button id='save_disp' style='float:right;'>表示</button><button id='hovertrigger' style='zoom:1.3;float:right;'>hoverTrigger</button><div id='popup' style='width:800px;height200px;clear:both;'></div></div>");
                         $("#pop").draggable();
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
                            if(msg.sts==="completed"){
                                        //ここで、tabIdとfrm_arr[]をもらう。
                                        //tabId = msg.tabId;
                                        //frm_arr = msg.frm_arr;
                                        alert("completedが返されました。");
                                        
                                        //ここで削除すると、以後は、リロードしない限り、clickが効かない
                                        //$("body").off('click');
                            }
                });
                /******************************************************************
                *hoverTriggerボタンで、動画のホバー情報を取得して、DBへ保存 
                *表示ボタンのclickリスナーを登録
                *親フレームで実行
                *hoverTriggerメッセージを送信
                *frm_arr[]は、???? 　background.jsで、WebNaviを用いて取得
                * ここで、frameIdは、使いまわしはせずに、
                * 
                *******************************************************************/
                $("#hovertrigger").on('click',()=>{
                                //frm_arr = msg;                      //応答はfrm_arr[]     
                                /*************************************************************
                                *ここで、一括で、現行動画の情報をDBへ保存して、 
                                *次に、そのデータを表示できるか?? 
                                *先に、保存してから、そのデータを表示する。
                                ***************************************************************/
                                //$("#popup").html("一括表示");
                                alert("hoverTriggerボタンクリック　tabId = "+tabId);
                                
                                chrome.runtime.sendMessage({type: 'hoverTrigger',tabId:tabId}, function (msg) {
                                       //応答は? 特になし。     

                                });
                                document.querySelector("#popup").style.display = "block";



                });
                /**********************************************************************
                *DBから動画情報を取得して表示 
                * 
                *****************************************************************************/
                $("#save_disp").on('click',()=>{

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
                                    console.log("get_jimdo  vid = "+response[0][0]);

                                    let html="";
                                    $.each(response,(i,val)=>{
                                               //
                                               html += "vid ："+val[0]+"<br>tabId ："+val[1]+"<br>frameId ："+val[2]+"<br>title ："+val[3]+"<br>ariaLabel ："+val[4]+"<br><br><br>";

                                    });

                                    $("#popup").html(`<div class='ariaInfo' style='zoom:1.5;background-color:lightblue;position:relative;top:0%;left:0%;width:600px;height:100px;'>`+html+`</div>`);
                                    document.querySelector("#popup").style.display= "block";

                });
                //
                $("#reset").on('click',()=>{
                            $("#popup").html("");
                            document.querySelector("#popup").style.display = "none";

                });
     
        }    

        }
    });
    



