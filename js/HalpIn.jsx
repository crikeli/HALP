//contains the HalpIn component which has 2 child components(TwitterHandle & Status input)
// Components are the units that organize REACT code.

var HalpIn = React.createClass({

        //Gets Invoked before the component is ready and the initial app environment is setup
        getInitialState: function() {
        var self = this
        let status
        let twitterHandle

        // config.json is read and appbase properties are accessed
        $.getJSON("./config.json", function(json) {
            // Create Appbase reference object
            self.appbaseRef = new Appbase({
                url: 'https://scalr.api.appbase.io',
                appname: json.appbase.appname,
                username: json.appbase.username,
                password: json.appbase.password
            });
            self.type = json.appbase.type
        });

        //local storage values are queried and appropriate responses are issued.
        if (localStorage.state) {
            status = JSON.parse(localStorage.state).status
            twitterHandle = JSON.parse(localStorage.state).twitterHandle
        }
        // Setting the status with default Value
        else {
            status = "💩 💩 💩 💩"
            twitterHandle = ""
        }
        return {
            status: status,
            twitterHandle: twitterHandle
        };
    },

    // Invoked when ever the components updates are rendered to the DOM
    componentDidUpdate: function(prevProps, prevState) {
        localStorage.state = JSON.stringify(this.state);
    },

    // Invoked by StatusInput component when ever the status is updated
    // setState is called first to set status
    addInputToAppbase: function(status) {
        // Set the status state with the argument passed with the function
        this.setState({
            status: status
        });
        var data = {
            "status": status,
            "twitterHandle": this.state.twitterHandle,
            "timestamp": Date.now()
        }
        // Appbase is then used to index the status, twitter handle and a timestamp as a json object.
        this.appbaseRef.index({
            type: this.type,
            body: data,
        }).on('data', function(response) {
            console.log(response);
        }).on('error', function(error) {
            console.log(error);
        });
    },

    // Update the Twitter Handle state when the TwitterInput component is submitted
    setTwitterHandle: function(twitterHandle) {
        this.setState({
            twitterHandle: twitterHandle
        });
    },

    render: function() {
        var twitterHandle = ""

        // If twitterHandle is already set in localStorage, then show update status page directly
        if (this.state.twitterHandle) {
            return (
                <StatusInput onSubmit={this.addInputToAppbase} placeholder={this.state.status}/>
            );
        } else {
            return (
                <TwitterInput onSubmit={this.setTwitterHandle} />
            );
        }
    }

});

// Component for input of Twitter handle
var TwitterInput = React.createClass({
    componentDidMount: function() {
        // Focus on the input button when the page loads
        this.refs.nameInput.focus()
    },
    _handleKeyPress: function(e) {
        // Call the onSubmit event when enter is pressed
        if (e.key === 'Enter') {
            var re = new RegExp(/@([\w]+)/)
            if(re.test(this.refs.nameInput.value)){
                this.props.onSubmit(this.refs.nameInput.value)
            }
            else{
                alert("Please enter valid twitter handle starting with @")
            }
        }
    },
    render: function() {
        return (
            <div className="statusInput">
                <h2>What's your twitter, YO! </h2>
                <input type = "text" onKeyPress = {this._handleKeyPress} placeholder="@yourhandle" ref="nameInput" />
            </div>
        )
    }
});

// Component for input of StatusInput
var StatusInput = React.createClass({
    // Focus on the input button when the page loads
    componentDidMount: function() {
        this.refs.statusInput.focus();
    },
    _handleKeyPress: function(e) {
        // Call the onSubmit event when enter is pressed
        if (e.key === 'Enter') {
            if (this.refs.statusInput.value) {
                this.props.onSubmit(this.refs.statusInput.value);
                this.refs.statusInput.value = "";
            }
        }
    },
    render: function() {
        return (
            <div className="statusInput">
                <h2>I need HALP with</h2>
                <input type = "text" onKeyPress = {this._handleKeyPress} placeholder={this.props.placeholder} ref="statusInput" />
            </div>
        )
    }
});

ReactDOM.render(
    <HalpIn />,
    document.getElementById('halpIn')
);
