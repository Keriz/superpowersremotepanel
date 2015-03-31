var socket = io();
var plugins = {};

var onPluginsReceived = function (pluginList){
    var pluginsPaths = pluginList.all;

	for (var i = 0; i < pluginsPaths.length; i++){
        var plugin = (pluginsPaths[i].split("/"));
        var author = plugin[0];
        var pluginName = plugin[1];
        if (plugins.hasOwnProperty(author) != true){
            plugins[author] = [];
        }
        plugins[author].push(pluginName);
    }

    var pluginVendorsSelect = document.getElementById("pluginVendors");
    var keys = Object.keys(plugins);
    for (var i=0; i < keys.length; i++){
        pluginVendorsSelect.add(new Option(keys[i], i)); 
    }
    selectAuthorChanged(keys[0]);
}

function selectAuthorChanged(newAuthor){
    var pluginsFromVendorSelect = document.getElementById("pluginFromVendor");
    pluginsFromVendorSelect.options.length = 0;
    for (var i=0; i < plugins[newAuthor].length; i++){
        pluginsFromVendorSelect.add(new Option(plugins[newAuthor][i], i));
    }
}


socket.on('pluginList', onPluginsReceived);
