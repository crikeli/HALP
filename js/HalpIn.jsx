//contains the HalpIn component which has 2 child components(TwitterHandle & Status input)
// Components are the units that organize REACT code.

var HalpIn = Rect.createClass({

    //Gets Invoked before the component is ready and the initial app environment is setup
    getInitialState: function() {
        var self = this
        var status
        var twitterHandle

        // config.json is read and appbase properties are accessed
        $.getJSON("./config.json", function(json){
            self.appbaseRef = new Appbase({
                url: 'https://scalr.api.appbase.io',
                appname: json.appbase.appname,
                username: json.appbase.username,
                password: json.appbase.password
            })
            self.type = json.appbase.type
        })

        //local storage values are queried and appropriate responses are issued.
        if (localStorage.state) {
            status = JSON.parse(localStorage.state).status
            twitterHandle = JSON.parse(localStorage.state).twitterHandle
        }

        else {
            status = " 💩 💩 💩 "
            twiterHandle = ""
        }

        return {
            status: status,
            twitterHandle: twitterHandle
        }

    }
})
