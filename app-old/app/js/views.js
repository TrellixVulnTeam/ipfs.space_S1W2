var BaseView = Backbone.View.extend({
    el: "body",

    initialize: function () {
        console.log('Login View Initialized');
    },

    render: function () {
        var that = this;

        // render the header
        $.get('templates/login.html', function (data) {
            template = _.template(data, {});//Option to pass any dynamic values to template
            that.$el.html(template);//adding the template content to the main template.
        }, 'html');
        
        //Fetching the template contents

    }
});
