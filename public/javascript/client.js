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

var onLogReceived = function (buttonLog, log){

}

function selectAuthorChanged(newAuthor){
    var pluginsFromVendorSelect = document.getElementById("pluginFromVendor");
    pluginsFromVendorSelect.options.length = 0;
    for (var i=0; i < plugins[newAuthor].length; i++){
        pluginsFromVendorSelect.add(new Option(plugins[newAuthor][i], i));
    }
}

function buttonRemovePlugin(){
    var pluginInfos = getPluginSelected();
    var pluginVendorsSelect = document.getElementById("pluginVendors");
    var pluginsFromVendorSelect = document.getElementById("pluginFromVendor");

    plugins[pluginInfos.author].splice(pluginInfos.pluginIndex ,1);
    pluginsFromVendorSelect.remove(pluginInfos.pluginIndex);

    if (pluginsFromVendorSelect.length > 0){
        pluginsFromVendorSelect[0].selected = 1;
    }    

    if (plugins[pluginInfos.author].length == 0){
        delete plugins[pluginInfos.author];

        pluginVendorsSelect.remove(getAuthorIndex(pluginInfos.author));
        if (pluginVendorsSelect.length > 0){
            pluginVendorsSelect[0].selected = 1;
            selectAuthorChanged(pluginVendorsSelect[0].text);
        }
    }
    else{
        selectAuthorChanged(pluginInfos.author);
    }

    socket.emit('removePlugin', {pluginAuthor: pluginInfos.author, pluginName: pluginInfos.plugin});
}

function getPluginSelected(){
    var form = document.getElementById("plugins");
    var author = form.elements["pluginVendors"][form.elements["pluginVendors"].selectedIndex].text;
    var pluginIndex = form.elements["pluginFromVendor"].selectedIndex;
    var plugin = form.elements["pluginFromVendor"][pluginIndex].text;
    return {author: author, plugin: plugin, pluginIndex: pluginIndex};
}

function getAuthorIndex(author){
    var pluginVendorsSelect = document.getElementById("pluginVendors");

    for(var i=0; i < pluginVendorsSelect.length; i++){
        if (author == pluginVendorsSelect[i].text){
            return i;
        }
    }
}

socket.on('pluginList', onPluginsReceived);
socket.on('responseLog', onLogReceived);