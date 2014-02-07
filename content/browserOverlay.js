/**
 * ImdbFilterHelper namespace.
 */
if ("undefined" == typeof(ImdbFilterHelper)) {
  var ImdbFilterHelper = {};
};

if ("undefined" == typeof(ImdbFilterHelper_vars)) {
  var ImdbFilterHelper_vars = {
    m_type : "",
    m_year : "",
    m_genres : ["action", "drama", "adventure", "animation", "comedy", "sci_fi",
                "crime", "thriller", "fantasy", "mystery", "family", "romance",
                "sport", "horror", "war", "western", "reality_tv", "history",
                "documentary", "game_show", "music", "biography", "musical",
                "news", "talk_show", "film_noir"]
  };
};


if (!String.format) {
  String.format = function (format) {
    let args = Array.prototype.slice.call(arguments, 1);
    let sprintfRegex = /\{(\d+)\}/g;
    let sprintf = function (match, number) {
      return number in args ? args[number] : match;
    };
    return format.replace(sprintfRegex, sprintf);
  };
}


ImdbFilterHelper.Lib = {
  hasAttributeById : function(id, attribute) {
    return document.getElementById(id).hasAttribute(attribute);
  }
};


ImdbFilterHelper.Filter = {
  debugPlease : function(a_event) {
    let sandbox = Components.utils.Sandbox(gBrowser.contentWindow,{sandboxPrototype:gBrowser.contentWindow, wantXrays:false});
    let currenttime = Components.utils.evalInSandbox("document.getElementById('movie_player').getCurrentTime()", sandbox);
    window.alert(currenttime);
  },
  
  getGenresString : function() {
    let result_array = new Array();
    for (let i = 0; i < ImdbFilterHelper_vars.m_genres.length; i++) {
      let id = ImdbFilterHelper_vars.m_genres[i];
      if (ImdbFilterHelper.Lib.hasAttributeById(String.format("imdb-{0}", id), "checked")) {
        result_array.push(id);
      }
    }
    let result = result_array.join();
    if (result == "") {
      return "";
    } else {
      return String.format("&genres={0}", result);
    }
  },
  
  setYear : function(year) {
    if (-1 == year) {
      ImdbFilterHelper_vars.m_year = "";
    } else {
      ImdbFilterHelper_vars.m_year = String.format("&year={0}", year);
    }
  },
  
  setType : function(type_id) {
    ImdbFilterHelper_vars.m_type = ImdbFilterHelper.Filter.getType(type_id);
  },
  
  getType : function(type_id) {
    if (0 == type_id) {
      //All
      return ""
    } else if (1 == type_id) {
      //Feature Films
      return "&title_type=feature";
    } else if (2 == type_id) {
      //Short Films
      return "&title_type=short";
    } else if (3 == type_id) {
      //TV Series
      return "&title_type=tv_series";
    } else if (4 == type_id) {
      //TV Episodes
      return "&title_type=tv_episode";
    } else if (5 == type_id) {
      //Videos
      return "&title_type=video";
    } else if (6 == type_id) {
      //Video Games
      return "&title_type=game";
    } else {
      return "";
    }
  }
};

ImdbFilterHelper.Url = {
  openUrl : function(url) {
    content.wrappedJSObject.location = url;
    newTabBrowser = gBrowser.selectedBrowser;
    newTabBrowser.addEventListener("load", highlight, true);
  },
  
  formatUrl : function() {
    let base_url = "http://www.imdb.com/search/title?at=0";
    let genres = ImdbFilterHelper.Filter.getGenresString();
    let imdbfv = ImdbFilterHelper_vars;
    return String.format("{0}{1}{2}{3}", base_url, imdbfv.m_type, imdbfv.m_year, genres);
  },
  
  goto : function() {
    ImdbFilterHelper.Url.openUrl(ImdbFilterHelper.Url.formatUrl());
  }
};
