showdown.setOption('simplifiedAutoLink',true);
showdown.setOption('openLinksInNewWindow',true);
showdown.setOption('simpleLineBreaks',true);
showdown.setOption('headerLevelStart',2);
showdown.setOption('tables',true);
showdown.setOption('parseImgDimensions',true);
showdown.setOption('disableForced4SpacesIndentedSublists',true);



var treloloBoardID = 'KrlOGxIr';

var app = angular.module("page", ['ngSanitize','ngAnimate']).config(function($sceDelegateProvider) {  
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain. **.
    'https://trello.com/**'
  ]);
}).config(function($locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
});

app.controller('MgCtrl',['$scope','$http','$sce',function($scope, $http, $sce){

  doRouter = function($scope){
    console.log($scope);
    if(typeof window.cardID != 'undefined'){
      $scope.cardID = cardID;
      if( !$scope.myData ){
        $scope.jsonUrl ='https://trello.com/c/'+$scope.cardID+'.json';
        doUpdateFromCardJson();
        return;
      }
      // setContent($scope);
    }
    else if(typeof window.boardID != 'undefined'){
        $scope.boardID = boardID;
    }else{
        $scope.boardID = treloloBoardID;
    }
    if( !$scope.myData ){
        $scope.jsonUrl ='https://trello.com/b/'+$scope.boardID+'.json';
        doUpdateFromBoardJson();
        return;
    }
  }

  setHeader = function($scope){
    if($scope.myData.prefs.backgroundImage){
      if(window.outerWidth > 960){
        $scope.bgImage = $scope.myData.prefs.backgroundImage;
      }else{
        var backgroundImageScaled = $scope.myData.prefs.backgroundImageScaled;
        for(var i=0;i< backgroundImageScaled.length;i++){
          $scope.bgImage = backgroundImageScaled[i].url;
          if(backgroundImageScaled[i].width > window.innerWidth)break;
        }
      } 
    }else{
      $scope.bgColor = $scope.myData.prefs.backgroundColor;
    }
    if($scope.myData.prefs.backgroundBrightness == 'dark'){
      $scope.bgTextColor = 'white';
    }else{
      $scope.bgTextColor = 'black';
    }

  }

  setMenu = function($scope){
    var menu = [];
    var lists = $scope.myData.lists;
    lists.forEach(function(item){
      if(!item.closed){
        var object = {
          title : item.name,
          id : item.id,
          children : [],
        }
        menu.push(object);   
      }
    });

    $scope.menu = menu;

    $scope.myData.cards.forEach(function(item){
      if(!item.closed){
        if(!$scope.homeCardId){
          $scope.homeCardId = item.shortLink;
        }
        parent = getMenuParent($scope, item.idList);
        if(parent){
          if(!item.desc){
            var url = "#";
          }else{
            var reg = RegExp(/^http(s)?:\/\/[^\n]+$/);
            if(reg.exec(item.desc)){
              var url = item.desc;
            }else{
              var url = '/c/'+item.shortLink;    
            }
          }
          if(parent.children.length == 0){
            if(parent.title == item.name){
              parent.url = url;
            }else{
              parent.url = '#';
            }
          }
          if(parent.children.length != 0 || parent.title != item.name){
            parent.children.push({
              title : item.name,
              url : url,
              shortLink : item.shortLink,
            });
          }
        }
      }
    });

    if(typeof postSetMenu != 'undefined'){
      postSetMenu();
    }
  }
  
  setStaticContent = function($scope){
    $scope.actions = [];
    $scope.actions[1] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/f6592e5c01b43f1a686949a4295af020/%E7%9C%8B%E8%A6%8B.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/96513ae2148a9fad9f7bddc8e358387c/%E9%BB%83%E5%AD%90%E6%98%8E_%E7%84%A1%E5%AE%B6%E8%80%85_(2)-min.jpg',
      title : '看見',
      subtitle : '是什麼風把你吹來了'
      
    }
    $scope.actions[2] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/f4ab20327f3d4efe0e875e78233c0516/%E8%81%86%E8%81%BD.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/9e5e5f56f4b3af1b97604ee0b1f19f86/%E6%9E%97%E7%92%9F%E7%91%8B_10_20150223_8435-Good-1-Print%E8%BF%91%E5%8F%B0%E5%8C%97101%E6%9F%90%E8%99%95%E5%B8%82%E5%A0%B4-min_crop.jpg',
      title : '聆聽',
      subtitle : '漂流部落・真人圖書館・專題講座'
    }
    $scope.actions[3] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/4d4be07396a6428c268be79db9e45266/%E9%AB%94%E9%A9%97.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/d9ad6efb6fb5fddfdc079212ba82b326/%E9%BB%83%E5%AD%90%E6%98%8E_%E7%84%A1%E5%AE%B6%E8%80%85_(5)-min.jpg',
      title : '體驗',
      subtitle : '城市狹縫旅行團'
    }
    $scope.actions[4] = {
      word_image:"https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/3fe3fdb4e67f4873372df3f82a93d8cd/%E5%9C%98%E7%B5%90.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/59f56c2d651fc35656c79fa29edf029b/%E5%90%B3%E6%89%BF%E7%B4%98_%E7%94%9F%E6%B4%BB_(10)-min.jpg',
      title : '團結',
      subtitle : '遊行・宣言・立碑'
    }
    $scope.news = [];
    $scope.cta = [];
  }

  setContent = function($scope){
    // Set Custom Fields
    $scope.customFields = [];
    $scope.myData.customFields.forEach(function(item){
      $scope.customFields[item.id] = item;
    });

    $scope.lists = [];
    $scope.myData.lists.forEach(function(list){
      if(list.name == '系列活動'){
        $scope.lists[list.id] = '系列活動';
        return ;
      }
      if(list.name == '紀念商品'){
        $scope.lists[list.id] = '紀念商品';
        return;
      }
      if(list.name == '合作團隊'){
        $scope.lists[list.id] = '合作團隊';
        return;
      }
      if(list.name == '4am介紹'){
        $scope.lists[list.id] = '4am介紹';
        return;
      }
    });

    $scope.actions = [];
    $scope.products = [];
    $scope.members = [];
    $scope.slides = [];


    var converter = new showdown.Converter();
    $scope.myData.cards.forEach(function(item){
      item.customFieldItems.forEach(function(customFieldItem){
        if(customFieldItem.value){
          var customField = $scope.customFields[customFieldItem.idCustomField]
          item[customField.name] = customFieldItem.value[customField.type];
        }
      });

      if(item.shortLink == 'HwVoEn1V'){
        $scope.intro = $sce.trustAsHtml(converter.makeHtml(item.desc));
        return ;
      }
      if(item.shortLink == 'UGZ65SFq'){
        $scope.article = $sce.trustAsHtml(converter.makeHtml(item.desc));
        return ;
      }
      if(item.closed){
        return;
      }
      if($scope.lists[item.idList] == '系列活動'){
        var attachment = item.attachments.filter(function(i){return i.isUpload})[0];
        if(attachment && attachment.url){
          item.img = attachment.url;
        }
        item.content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        $scope.actions.push(item);
        return;
      }
      if($scope.lists[item.idList] == '紀念商品'){
        var attachment = item.attachments.filter(function(i){return i.isUpload})[0];
        // if(attachment.url){
        //   item.img = attachment.url;
        // }
        item.description = $sce.trustAsHtml(converter.makeHtml(item.desc));
        $scope.products.push(item);
        return;
      }
      if($scope.lists[item.idList] == '合作團隊'){
        var attachment = item.attachments.filter(function(i){return i.isUpload})[0];

        // if(attachment){
        //   item.img = attachment.url;
        // }
        $scope.members.push(item);
        return;
      }
      if($scope.lists[item.idList] == '4am介紹'){
        item.content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        $scope.slides.push(item);
        return;
      }
/*
      if(item.shortLink == 'hYtEZvle'){
        $scope.group = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'YZwxxY8I'){
        $scope.actions[1].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[1].url = item.attachments[0].url;
          $scope.actions[1].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'YskjbP0Y'){
        $scope.actions[2].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[2].url = item.attachments[0].url;
          $scope.actions[2].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'RjrcnwRC'){
        $scope.actions[3].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[3].url = item.attachments[0].url;
          $scope.actions[3].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'MqxlabVU'){
        $scope.actions[4].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[4].url = item.attachments[0].url;
          $scope.actions[4].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'fYFj3fUa'){
        item.attachments.forEach(function(a){
          $scope.cta.push({
            url: a.url,
            title: a.name
          });
        })
      }
      if(item.idList == '5b6afcba3c1a17066bf4ddbb'){
        // 媒體報導
        var news = {
          author: "",
          title : item.name,
          source: "",
          source_img: "",
        }
        item.attachments.forEach(function(a){
          if(a.bytes){
            news.img = a.url;
          }else{
            news.url = a.url;
            news.source = a.name;
          }
        })
        $scope.news.push(news);
      }
      */
    });

    $scope.actions.sort(function(x,y){
      if(!x.StartDate || !y.StartDate)return;
      var xd = new Date(x.StartDate);
      var yd = new Date(y.StartDate);
      return xd.getTime() - yd.getTime();
    });

    $scope.members.sort(function(x,y){
      return x.pos - y.pos;
    });

    console.log($scope.myData);
    console.log($scope);

    if(typeof postSetContent == 'function'){
      postSetContent();
    }
  };

  doUpdateFromCardJson = function(){
      var jsonUrl = $scope.jsonUrl;
      $http.get(jsonUrl)
      .then(function(response){
          $scope.boardID = response.data.actions[0].data.board.shortLink;
          $scope.jsonUrl = 'https://trello.com/b/'+$scope.boardID+'.json';
          doUpdateFromBoardJson();
      });
  }

  doUpdateFromBoardJson = function(){
      var jsonUrl = $scope.jsonUrl;
      $http.get(jsonUrl)
      .then(function(response){
          $scope.myData = response.data;
//          setHeader($scope);
//          setMenu($scope);
          setContent($scope);
      });
  }

  $scope.toggleAction = function(i, e){
    e.preventDefault();
    var ms = 500;
    if(!$scope.showAction){
      $scope.showAction = [0,0,0,0,0];
    }
    var sum = $scope.showAction.reduce(function(a,b){
      return a+b;
    }, 0);
    if(sum == 0){
      $scope.showAction[i] = 1;
      ga('send','event','click','open','action-section-'+i);
      return ;
    }
    
    if($scope.showAction[i] == 1){
      $scope.showAction[i] = 0;
      var top = $('#action-section-'+i).offset().top;
      $('body,html').animate({scrollTop: top}, ms);
      ga('send','event','click','close','action-section-'+i);
    }else{
      ga('send','event','click','open','action-section-'+i);
      $scope.showAction = [0,0,0,0,0];
      var j = (i==1)?1:i-1;
      var top = $('#action-section-'+j).offset().top;
      $('body,html').animate({scrollTop: top}, ms);
      setTimeout(function(){
        $scope.showAction[i] = 1;
        var top = $('#action-section-'+i).offset().top;
        $('body,html').animate({scrollTop: top}, ms);
      },ms);
      
    }
  }
  
  $scope.clickGA = function(label){
    ga('send','event','click','link',label);
  }

  init = function(){
      console.log(1);
      setStaticContent($scope);
      doRouter($scope);
  }

  init();
}]);

// https://codepen.io/MicoTheArtist/pen/gbDlj
// https://stackoverflow.com/questions/30689040/angular-scroll-directive
// https://stackoverflow.com/questions/26588300/scroll-event-in-angularjs
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
      scope.header_bg_top = -20/3;
      
        angular.element($window).bind("scroll", function() {
            scope.header_bg_top = (this.pageYOffset-20)/3;
            scope.$apply();
        });
    };
});

// from https://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        ga('send','event','click','scroll',attrs.href);
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, "slow");
      });
    }
  }
});

postSetContent = function(){
  window.interval = setInterval(function(){
    if($('.section-slide .slide').length > 0){
      $('main').fullpage({
          // 參數設定[註1]
          navigation: true, // 顯示導行列
          navigationPosition: "right", // 導行列位置
          onLeave: function(origin, destination, direction){
            if($('[data-page='+destination+']').length > 0){
              $('[data-page='+destination+']').animate({opacity: 1});
            }
            if($('[data-page='+origin+']').length > 0 && direction=='up'){
              $('[data-page='+origin+']').animate({opacity: 0});
            }
            console.log(origin);
            console.log(destination);
            console.log(direction);
          }
        });
      clearInterval(window.interval);
      
    }
  },500);
}