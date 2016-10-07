// Query appbase to get feed data.

// var HalpFeed = React.createClass({
//   // an appbase.io reference is initialized feedQuery Object is created.
//   getInitialState: function() {
//     var self = this
//
//     $.getJSON("./congif.json", function(json) {
//       self.appbaseRef = new Appbase({url: 'https://scalr.api.appbase.io', appname: json.appbase.appname, username: json.appbase.username, password: json.appbase.password})
//             self.type = json.appbase.type
//             self.pageNumber = 0
//             //feedQuery Object is created.
//             // Matching occurs here and if found, the docs will be returned in descending order
//             self.feedQuery = {
//               type: self.type,
//               size: 10,
//               from: self.pageNumber*10,
//               body: {
//                 query: {
//                     match_all: {}
//                 },
//                 sort: {
//                     timestamp: "desc"
//                 }
//               }
//             }
//             self.getHistoricalFeed()
//             self.subscribeToUpdates()
//     })
//     return {items: []}
//   },
//
//
//   getHistoricalFeed: function() {
//     self = this
//     self.appbaseRef.search(self.feedQuery).on('data', function(res){
//       self.pageNumber = self.pageNumber + 1
//       self.addItemsToFeed(res.hits.hits)
//     }).on('error', function(err){
//       console.log("search error:", err)
//     })
//   },
//
//   addItemsToFeed: function(newItems) {
//     var updated = this.state.items
//     $.map(newItems, function(object){
//       updated.push(object._source)
//     })
//     this.setState({items: updated})
//   },
//
//   subscribeToUpdates: function() {
//     self = this
//     self.appbaseRef.searchStream(self.feedQuery).on('data', function(res) {
//       self.addItemtToTop(res._source)
//     }).on('error', function(err) {
//       console.log("Error Getting Feed", err)
//     })
//   },
//
//   addItemToTop: function(newItem){
//     var updated = this.state.items
//     updated.unshift(newItem)
//     this.setState({items:updated})
//   },
//   handleScroll: function(event) {
//     var body = event.srcElement.body
//     // When the client reaches at the bottom of the page, get next page
//     if (body.clientHeight + body.scrollTop >= body.offsetHeight) {
//         this.getHistoricalFeed()
//     }
//     },
//     componentWillMount: function() {
//         window.addEventListener('scroll', this.handleScroll)
//     },
//     componentWillUnmount: function() {
//         window.removeEventListener('scroll', this.handleScroll)
//     },
//     render: function() {
//       return (
//         <FeedContainer items={this.state.items}/>
//       )
//     }
// });
//
// var FeedContainer = React.createClass({
//     render: function() {
//         var content
//         // Loop through all the items
//         if (this.props.items.length > 0) {
//           content = this.props.items.map(function(item, i) {
//             return <FeedItem item={item} key={i}/>
//           })
//         } else {
//           content = <FeedItem item="I don't need your help... For now ^.^ " />
//         }
//
//         return (
//             <div className="row">
//                 <h3 className="col s12 center white-text">HALP Feed</h3>
//                 {content}
//             </div>
//         )
//     }
// });
//
// var FeedItem = React.createClass({
//     render: function() {
//         // Get the profile picture from Twitter using the given handle
//         var twitterProfilePictureURL = "https://twitter.com/" + this.props.item.twitterHandle + "/profile_image?size=original"
//         return (
//             <div className="row">
//                 <div className="col s4 m2 l1">
//                     <img className="profile-picture" src={twitterProfilePictureURL}/>
//                 </div>
//                 <div className="col s8 m10 l11">
//                     <span className="twitter-handle">{this.props.item.twitterHandle} is stuck on</span>
//                     <p className="stuck-on-feed">{this.props.item.status}</p>
//                 </div>
//             </div>
//         )
//     }
// });
//
// ReactDOM.render(
//   <HalpFeed /> document.getElementById('halpFeed')
// )





var HalpFeed = React.createClass({
    getInitialState: function() {
        var self = this

        // Get the Appbase credentials from the config file
        // Note that this will be executed as async process
        $.getJSON("./config.json", function(json) {
            // Create Appbase reference object
            self.appbaseRef = new Appbase({url: 'https://scalr.api.appbase.io', appname: json.appbase.appname, username: json.appbase.username, password: json.appbase.password})
            self.type = json.appbase.type
            self.pageNumber = 0
            self.feedQuery = {
                query: {
                    match_all: {}
                },
                sort: {
                    timestamp: "desc"
                }
            }
            self.getHistoricalFeed()
            self.subscribeToUpdates()
        })
        return {items: []}
    },

    // Fetch the old status from Appbase based on pageNumber
    getHistoricalFeed: function() {
        self = this
        self.appbaseRef.search({
            type: self.type,
            size: 10,
            from: self.pageNumber*10,
            body: self.feedQuery
        }).on('data', function(res) {
            self.pageNumber = self.pageNumber + 1
            self.addItemsToFeed(res.hits.hits)
        }).on('error', function(err) {
            console.log("search error: ", err)
        })
    },

    // Add the items to the feed fetched in getHistorialFeed
    addItemsToFeed: function(newItems) {
        var updated = this.state.items
        $.map(newItems, function(object) {
            updated.push(object._source)
        })
        this.setState({items: updated})
    },
    componentWillMount: function() {
        window.addEventListener('scroll', this.handleScroll)
    },
    componentWillUnmount: function() {
        window.removeEventListener('scroll', this.handleScroll)
    },

    handleScroll: function(event) {
        var body = event.srcElement.body
        // When the client reaches at the bottom of the page, get next page
        if (body.clientHeight + body.scrollTop >= body.offsetHeight) {
            this.getHistoricalFeed()
        }
    },
    subscribeToUpdates: function() {
        self = this
        self.appbaseRef.searchStream({
            type: self.type,
            body: self.feedQuery
        }).on('data', function(res) {
            self.addItemToTop(res._source)
        }).on('error', function(err) {
            console.log("streaming error: ", err)
        })
    },

    addItemToTop: function(newItem) {
        var updated = this.state.items
        updated.unshift(newItem)
        this.setState({items: updated})
    },
    render: function() {
        return (<FeedContainer items={this.state.items}/>)
    }
})

var FeedContainer = React.createClass({
    render: function() {
        var content
        // Loop through all the items
        if (this.props.items.length > 0) {
          content = this.props.items.map(function(item, i) {
            return <FeedItem item={item} key={i}/>
          })
        } else {
          content = <FeedItem item="Nothing to see here, run along now ;)" />
        }

        return (
            <div className="row">
                <h3 className="col s12 center white-text">HALP Feed</h3>
                {content}
            </div>
        )
    }
})

var FeedItem = React.createClass({
    render: function() {
        // Get the profile picture from Twitter using the given handle
        var twitterProfilePictureURL = "https://twitter.com/" + this.props.item.twitterHandle + "/profile_image?size=original"
        return (
            <div className="row">
                <div className="col s4 m2 l1">
                    <img className="profile-picture" src={twitterProfilePictureURL}/>
                </div>
                <div className="col s8 m10 l11">
                    <span className="twitter-handle">{this.props.item.twitterHandle} needs HALP with </span>
                    <p className="stuck-on-feed">{this.props.item.status}</p>
                </div>
            </div>
        )
    }
})

ReactDOM.render(
     <HalpFeed />,
     document.getElementById('halpFeed')
)
