app.connectors = {
    open: function (html) {
        console.log('Open connector called;');
        $('.overlay-content').html(html);
        $('body').addClass('overlay-open');
    },
    close: function () {
        $('body').removeClass('overlay-open');
        $('.overlay-content').empty();
    },

    fallbackImage: function (el) {
        var src = "#{cdn( site.base_url + '/images/design/projects/default_200x150.png')}";
        el.src = src;
    },

    connectorFilter : function(filters, keyword, container, thumbnailSize) {
        //Currently the only way to specify no limit
        var maxResults = 500;

        var url = app.dcp.url.search;

        // Prep each filter
        var query = ["(sys_content_type: 'jbossdeveloper_connector' AND (target_product_1:'fuse' OR target_product_2:'fuse' OR target_product_3:'fuse'))"];

        var request_data = {
            "field"  : ["_source"],
            "query" : query,
            "size" : maxResults
        };

        // append loading class to wrapper
        $("ul.results").addClass('loading');

        $.ajax({
            url : url,
            dataType: 'json',
            data : request_data,
            container : container,
            error : function() {
                $('ul.results').html(app.dcp.error_message);
            }
        }).done(function(data){
            var container = this.container || $('ul.results');
            app.project.format(data, container);
        });
    },

    format: function (data, container, thumbnailSize) {
        if (data.responses) {
            var hits = data.responses[0].hits.hits;
        } else {
            var hits = data.hits.hits;
        }
        hits.sortJsonArrayByProperty("_source.sys_title");
        var html = "";
        // loop over every hit

        for (var i = 0; i < hits.length; i++) {
            var props = hits[i]._source;

            var imgsrc = "http://static.jboss.org/connectors" + props.id + "_" + thumbnailSize + ".png";

            var template = "<li class=\"connector\">"
                + "<a class=\"fn-open-connector\" href=\"#\"><img class=\"connector-logo\" src=\"//static.jboss.org/www/pr/583/build/1066/other/lorempixel_com_300_150?v=1\"></a>"
                + "<h3><a class=\"fn-open-connector\" href=\"#\">Connector Name</a></h3>"
                + "<p>Short Description</p>"
                + "  <div class=\"connector-overlay-content\">"
                + "      <div class=\"row\">"
                + "      <div class=\"row\">"
                + "         <div class=\"large-7 columns\"><img class=\"connector-logo\" src=\"//static.jboss.org/www/pr/583/build/1066/other/lorempixel_com_300_300?v=1\"></div>"
                + "         <div class=\"large-17 columns\">"
                + "            <p>Long description</p>"
                + "            <h4>"
                + "               Connector A"
                + "               <div class=\"copy-to-clipboard\">"
                + "                  <object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"110\" height=\"14\" id=\"clippy\">"
                + "                     <param name=\"movie\" value=\"//static.jboss.org/ffe/0/www/vendor/clippy/clippy.swf\">"
                + "                     <param name=\"allowScriptAccess\" value=\"always\">"
                + "                     <param name=\"quality\" value=\"high\">"
                + "                     <param name=\"scale\" value=\"noscale\">"
                + "                     <param name=\"FlashVars\" value=\"text=aws-ddb://tableName[?&lt;options&gt;]\">"
                + "                     <param name=\"bgcolor\" value=\"#FFFFFF\">"
                + "                     <embed src=\"//static.jboss.org/ffe/0/www/vendor/clippy/clippy.swf\" width=\"110\" height=\"14\" name=\"clippy\" quality=\"high\" allowscriptaccess=\"always\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" flashvars=\"text=aws-ddb://tableName[?&lt;options&gt;]\" bgcolor=\"#FFFFFF\"></embed>"
                + "                  </object>"
                + "               </div>"
                + "            </h4>"
                + "            <input type=\"text\" value=\"flatpack:[fixed|delim]:configFile[?&lt;options&gt;]\">"
                + "            <h4>"
                + "               Connector B"
                + "               <div class=\"copy-to-clipboard\">"
                + "                  <object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"110\" height=\"14\" id=\"clippy\">"
                + "                     <param name=\"movie\" value=\"//static.jboss.org/ffe/0/www/vendor/clippy/clippy.swf\">"
                + "                     <param name=\"allowScriptAccess\" value=\"always\">"
                + "                     <param name=\"quality\" value=\"high\">"
                + "                     <param name=\"scale\" value=\"noscale\">"
                + "                     <param name=\"FlashVars\" value=\"text=aws-ddb://tableName[?&lt;options&gt;]\">"
                + "                     <param name=\"bgcolor\" value=\"#FFFFFF\">"
                + "                     <embed src=\"//static.jboss.org/ffe/0/www/vendor/clippy/clippy.swf\" width=\"110\" height=\"14\" name=\"clippy\" quality=\"high\" allowscriptaccess=\"always\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" flashvars=\"text=aws-ddb://tableName[?&lt;options&gt;]\" bgcolor=\"#FFFFFF\"></embed>"
                + "                  </object>"
                + "               </div>"
                + "            </h4>"
                + "            <input type=\"text\" value=\"aws-ddb://tableName[?&lt;options&gt;]\">"
                + "         </div>"
                + "      </div>"
                + "   </div>"
                + "</li>";

            // Append template to HTML
            html += template;
        }
        // Inject HTML into the DOC
        if(!html) {
            html = "Sorry, no results to display. Please modify your search.";
        }
        container.html(html).removeClass('loading');
        container.prev().find("#results-label").html(hits.length);
    }
};


$(function () {
    $('a.fn-open-connector').on('click', function (e) {
        e.preventDefault();
        console.log("Open connector clicked;")
        var html = $(this).parent().parent().find('.connector-overlay-content').html();
        console.log("html: ", html)
        app.connectors.open(html);
    });

    $('.overlay-close').on('click', app.connectors.close);

    app.connectors.connectorFilter()
});

