var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "brunofin", "comster44", "RobotCaleb", "thomasballinger", "beohoff", "LIRIK", "mitchflowerpower"]

var streamerData = []

var APICaller = React.createClass ({
    callApi: function(username){
        var d1 = $.get("https://api.twitch.tv/kraken/streams/"+username)
        var d2 = $.get("https://api.twitch.tv/kraken/users/"+username)    
        $.when(d1, d2).done
        (function(streamsResponse, usersResponse){
            var streams = streamsResponse[0];
            var users = usersResponse[0]
            streamerData = {
                stream: streams.stream,
                url: "http://www.twitch.tv/"+username, //Change this
                pic: users.logo ? users.logo : "http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png",
                bio: users.bio,
                username: users.name
            }
            var streamerArray = this.state.streamers;
            streamerArray.push(streamerData);
            this.setState({
                streamers: streamerArray       
            })
        }.bind(this)).fail(function(){
            streamerData = {
                pic: "http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png",
                bio: "User does not exist.",
                username: username
            }
             var streamerArray = this.state.streamers;
            streamerArray.push(streamerData);
            this.setState({
                streamers: streamerArray
            })
        }.bind(this))
        
    },  
    handleChange: function(event){
        this.setState({text: event.target.value});
    },
    handleSubmit: function(event){
        event.preventDefault();
        this.callApi(this.state.text)
    },
    filterStreamers: function(){
        this.setState({
            onlineFilter : !this.state.onlineFilter
        })
    },
    getInitialState: function() {
        streamers.forEach(this.callApi)    
        return {   
        streamers: [], 
        text: "",
        onlineFilter: false
        }
        },
    render: function() {
                return (
            <div>
                <div className = "footer">
                    <OnlineFilterButton filter = {this.state.onlineFilter} onFilter = {this.filterStreamers} />
                    <AddStreamerForm onChange = {this.handleChange} onSubmit = {this.handleSubmit} text = {this.state.text} />
                </div>
                <Content streamers = {this.state.streamers} filter = {this.state.onlineFilter}/>
            </div>
        )
    }

})
var Content = React.createClass({
    getInitialState: function () {
        return {
            text: "",
            streamers: this.props.streamers,
            filter: this.props.filter
            }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            streamers: nextProps.streamers,
            filter: nextProps.filter
        })
    },  
    render: function(){
        return (
            
            <StreamList data = {this.state.streamers} filter = {this.state.filter}/>
        )
    }
})

var StreamList = React.createClass ({
    getInitialState: function(){
        return{ 
           data: this.props.data,
           filter: this.props.filter
        }   
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            data: nextProps.data,
            filter: nextProps.filter
        })
    }, 
    componentDidMount: function() {
        this.setState({
            added: this.props.added
        })
    },
    render: function(){
        var filter = this.state.filter;
        var StreamerTags = this.state.data.map(function(user, i){
            if ((filter && user.stream) || !filter){
            return React.createElement(Streamer, 
                {user: user,
                 key: i}
            )
            }
        })

    return (
        <div className = "container">
        <StreamerCards data = {StreamerTags} filter = {this.state.filter} />
        </div>
        )
    }
})

var StreamerCards = React.createClass ({
    getInitialState: function() {
        return { 
            filter: this.props.filter
        }       
    }, 
    componentWillReceiveProps: function(nextProps){
        this.setState({ 
            filter: nextProps.filter
        })
    },
    render: function (){
        return (
            <div>
            {this.props.data}
            </div>
        )
    }})


var AddStreamerForm = React.createClass ({
    getInitialState: function() {
        return {
            text: this.props.text
        }
    },
    render: function(){
        return (
            
            <form className = "addForm" onChange = {this.props.onChange} onSubmit = {this.props.onSubmit} >
            <input type = "text" placeholder = "Search" />
            <input type = "submit" value = "Go!" />
            </form>
        )
    }
})

var OnlineFilterButton = React.createClass ({
    getInitialState: function() {
        return {
            onlineFilter: this.props.filter
        }
    },
    filterStreamers: function (){
        this.props.onFilter;
    },
    render: function() {
        return (
            <div>
            <button className = "filter-button" onClick = {this.props.onFilter}> {this.props.filter ? "View All" : "Filter Online Streamers"} </button>
            </div>
        )
    }   
})


var Streamer = React.createClass ({
    getInitialState: function() {
        return {
            filter: this.props.filter,
            username: this.props.user.username,
            url: this.props.user.url,
            pic: this.props.user.pic, 
            stream: this.props.user.stream ? this.props.user.stream.game  : (this.props.user.url ? "Not online" : ""),
            bio: this.props.user.bio
    }
    },
    render: function(){
        return(
            <div className = "media-object">
                <div className = "image-container"><img src = {this.state.pic}/></div>
                <div className = "text"><a href =  {this.state.url}>{this.state.username}</a>
                    <div>
            <p>{this.state.bio}</p>
            <p>{this.state.stream}</p>
                        <div className = "clear"></div>
                    </div> 
                </div>
            </div>
            )
    }
}
)

ReactDOM.render( 
    <APICaller />,
document.getElementById("content")
);

