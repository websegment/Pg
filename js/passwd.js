//<!CDATA[
/**
 * Password generator
 * 
 * @author Daisuke Sakata <sakatad@websegment.net>
 * @copyright 2012 Daisuke Sakata
 * 
 */
var digit;
var lang;
var mark;
var jpDisit;
var jpLang;
var jpMark;
var excludeArray;
$(function(){
	init();
	 var ua = navigator.userAgent;
	 if(ua.search(/(iPhone|iPad|Android)/) != -1){
	 	$("#passwd").removeAttr("readonly");
	 }
	$("#count, #before, #passwd").click(function(){
		$(this).focus();
		$(this).select();
	});
	$(".tab-content :checkbox").click(function(){
		var n = countChecked();
		if(n == 0){
			$(this).attr("checked", "checked");
		}
	});
	$("#count").change(checkCount);
	$("#before").change(createPassword);
	$("#execute").click(createPassword);
	$(".digit").button("toggle");
	$(".str").button("toggle");
	$(".mark").button("toggle");
	$("#sslider").slider({
		from:4
		,to:32
		,step:1
		,dimension:"&nbsp;"
		,skin:"round"
		,smooth: true
		,onstatechange:createPassword
	});
	$(".digit").click(function(){
		$(this).button("toggle");
		checkToggleActive($(this));
		digitClickHandler();
	});
	$(".str").click(function(){
		$(this).button("toggle");
		checkToggleActive($(this));
		langClickHandler();
	});
	$(".mark").click(function(){
		$(this).button("toggle");
		checkToggleActive($(this));
		markClickHandler();
	});
});
/**
 * 初期化処理
 * ・パスワードの宣言
 * ・初期除外パスワードの設定
 * ・各パスワードの初期処理を実行
 * 
 * @return void
 */
function init(){
	digit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	lang = [
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
		"k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y", "z"];
	mark = [
		"!", "#", "$", "%", "&", "(", ")", "=", "^", "~",
		"|", "[", "{", "}", "]", "@", "*", "+", "_", "?", "<",
		">", "/", ":", ";", "`", ",", ".", "-", "'", '"'];
	jpDisit = [
		"ゼロ", "イチ", "ニ", "サン", "ヨン", "ゴ", "ロク", "ナナ", "ハチ", "キュウ"];
	jpLang = [
		"エー", "ビー", "シー", "ディー", "イー", "エフ", "ジー", "エイチ", "アイ", "ジェイ",
		"ケイ", "エル", "エム", "アヌ", "オー", "ピー", "キュー", "アール", "エス", "ティー",
		"ユー", "ブイ", "ダブリュ", "エックス", "ワイ", "ゼット"];
	jpMark = [
		"!", "#", "$", "%", "&", "(", ")", "=", "^", "~",
		"|", "[", "{", "}", "]", "@", "*", "+", "_", "?", "<",
		">", "/", ":", ";", "`", ",", ".", "-", "'", '"'];
	
	excludeArray = ["0", "1", "i", "l", "o", "_", "\\|"];
	initDigit();
	initLang();
	initMark();
}
function countChecked(){
	return $(".tab-content input::checkbox:enabled:checked").length;
}
function checkToggleActive(inToggle){
	if($(".digit, .str, .mark").hasClass("active") == false){
		inToggle.button("toggle");
	}
}
function checkCount(value){
	var count = $(this).val();
	if(!count.match(/^[1-9][0-9]*$/g)){
		$(this).val(1);
		createPassword();
	}else{
		createPassword();
	}
}
/**
 * 数字系初期処理
 * 
 * @return void
 */
function initDigit(){
	var digitBox = $("#digit-box");
	digitBox.empty();
	for(var i = 0; i < digit.length; i++){
		var checkbox = getCheckBox(digit[i], i);
		digitBox.append(checkbox);
	}
}
/**
 * アルファベット初期処理
 * 
 * @return void
 */
function initLang(){
	var langBox = $("#lang-box");
	langBox.empty();
	for(var i = 0; i < lang.length; i++){
		var checkbox = getCheckBox(lang[i], i);
		langBox.append(checkbox);
	}
}
/**
 * 記号初期処理
 * 
 * @return void
 */
function initMark(){
	var etcBox = $("#mark-box");
	etcBox.empty();
	markLength = mark.length;
	for(var i = 0; i < markLength; i++){
		var checkbox = getCheckBox(mark[i], i);
		etcBox.append(checkbox);
	}
}
/**
 * パスワードの生成
 * 
 * @return void
 */
function createPassword(){
	var password = "";
	var jpPassword = "";
	var checkedValues = new Array();
	var checkedJpValues = new Array();
	var jpChars = new Array();
	var count = $("#count").val();

	passLength = $("#sslider").val();
	$("#passlen").text(passLength);
	$("#digit-box :enabled:checked").each(function(i, element){
		if(element.disabled == false){
			checkedValues.push(digit[element.value]);
			checkedJpValues.push(jpDisit[element.value]);
		}
	});
	$("#lang-box :enabled:checked").each(function(i, element){
		if(element.disabled == false){
			checkedValues.push(lang[element.value]);
			checkedJpValues.push(jpLang[element.value]);
		}
	});
	$("#mark-box :enabled:checked").each(function(i, element){
		if(element.disabled == false){
			checkedValues.push(mark[element.value]);
			checkedJpValues.push(jpMark[element.value]);
		}
	});
	for(var j = 1; j <= count; j++){
		if($("#before").val() != ""){
			password += $("#before").val();
		}
		for(var i = 1; i <= passLength; i++){
			var select = Math.floor(Math.random() * checkedValues.length);
			var sw = Math.floor(Math.random() * 128) % 2;
			switch(sw){
				case 0:
					var p = checkedValues[select].toUpperCase();
					break;
				default:
					var p = checkedValues[select];
			}
			jpChars.push(checkedJpValues[select]);
			password += p;
		}
		jpChars.push("\n");
		password += "\n";
	}
	//パスワード確認用エリアに挿入
	$("#passwd").val(password);
	//メッセージ案内用エリアに挿入
	//$("#message").text(jpChars.join("、"));
}
/**
 * 数字系チェックボックスのクリックハンドラ
 * ・チェックボックスにチェックが入っていれば数字系初期処理を実行
 * 
 * @return void
 */ 
function digitClickHandler(){
	if($(".digit").hasClass("active")){
		//initDigit();
		$("#digit-box input").each(function(i, element){
			element.disabled = false;
		});
	}else{
		$("#digit-box input").each(function(i, element){
			element.disabled = true;
		});
	}
	if(countChecked() == 0){
		$(".digit").button("toggle");
		digitClickHandler();
	}else{
		createPassword();
	}
}
/**
 * アルファベット系チェックボックスのクリックハンドラ
 * ・チェックボックスにチェックが入っていれば、アルファベット系初期処理を実行
 * 
 * @return void
 */
function langClickHandler(){
	if($(".str").hasClass("active")){
		$("#lang-box input").each(function(i, element){
			element.disabled = false;
		});
	}else{
		$("#lang-box input").each(function(i, element){
			element.disabled = true;
		});
	}
	if(countChecked() == 0){
		$(".str").button("toggle");
		langClickHandler();
	}else{
		createPassword();
	}
}
/*
 * 記号系チェックボックスのクリックハンドラ
 * 
 * @return void
 */
function markClickHandler(){
	if($(".mark").hasClass("active")){
		$("#mark-box input").each(function(i, element){
			element.disabled = false;
		});
	}else{
		$("#mark-box input").each(function(i, element){
			element.disabled = true;
		});
	}
	if(countChecked() == 0){
		$(".mark").button("toggle");
		markClickHandler();
	}else{
		createPassword();
	}
}
/**
 * チェックボックスを生成するメソッド
 * 
 * @param string label
 * @param integer counter
 * @return string
 */
function getCheckBox(label, counter){
	var checkBox = $(document.createElement("input"));
	var labeltag = $(document.createElement("label"));
		checkBox.attr({
			type:"checkbox",
			name:"pass",
			value:counter,
			"id":"pass-" + label});
		if(!label.match(excludeArray.join("|"))){
			checkBox.attr("checked", "checked");
		}
		labeltag.attr({
			"class":"checkbox inline"
		});
		labeltag.html(label);
		labeltag.append(checkBox);
	return labeltag;
}
//]]>