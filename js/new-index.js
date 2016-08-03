var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "brunofin", "comster44", "RobotCaleb", "thomasballinger", "beohoff", "LIRIK", "mitchflowerpower"]


var Streamer = React.createClass ({
    getInitialState: function() {
        return {
            username: "",
            url: "",
            pic: null, 
            stream: ""
    }
    },
    componentDidMount: function(){
        this.loadStuff();
        this.loadMoreStuff();
    },
    loadStuff: function(){
        var url = "https://api.twitch.tv/kraken/streams/" + this.props.user
        this.serverRequest = $.get(url).then(function(result){
            this.setState({
                stream: result.stream ? result.stream.game : "Not online.",
                url: "http://www.twitch.tv/" + this.props.user 
        })
    }.bind(this))
        },
    loadMoreStuff: function(){
        var usersUrl = "https://api.twitch.tv/kraken/users/" + this.props.user;
        this.otherServerRequest = $.get(usersUrl).done(function(result2){
            this.setState({
                pic: result2.logo ? result2.logo : "http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png",
                bio: result2.bio,
                username: result2.name
            })
        }.bind(this))
        .fail(function(){
                    this.setState({
                        username: this.props.user,
                        pic: "http://www.tpreview.co.uk/wp-content/uploads/2013/11/twitch-logo-300x300.png",
                        stream: "User doesn't exist",
                        bio: ""
                    })
                    }.bind(this))
        
    },
    componentWillUnmount: function() {
        this.otherServerRequest.abort();
        this.serverRequest.abort();
    },
    render: function(){
        return(
            <tr>
            <td><img src = {this.state.pic}/><a href =  {this.state.url}>{this.state.username}</a></td>
            <td>{this.state.bio}</td>
            <td>{this.state.stream}</td>
            </tr>       
            )
    }
}
)

var StreamList = React.createClass ({
    getInitialState: function(){
        return{ 
           data: this.props.data
        }   
    },
    componentDidMount: function() {
        this.setState({
            added: this.props.added
        })
    },
    render: function(){
        var StreamerTags = this.props.data.map(function(user, i){
            return React.createElement(Streamer, 
                {user: user,
                 key: i}
            )
        })
    return (
        <div>
        <table>
        <thead>
        <tr>
        <th>User</th>
        <th>Bio</th>
        <th>Status</th> 
        </tr>
        </thead>
        <tbody>
          {StreamerTags}
        </tbody>
        </table>  
        <AddStreamerForm />
        </div>
        )
    }
})

var AddStreamerForm = React.createClass ({
    render: function(){
        return (
            <form className = "addForm" >
            <input type = "text" onChange = {this.handleChange} placeholder = "Search and add a streamer" />
            <input type = "submit" value = "Go!" />
            </form>
        )
    }
})

var Content = React.createClass({
    getInitialState: function () {
        return {
            text: "",
            streamers: this.props.streamers
            }
    },
    handleChange: function(event){
        this.setState({text: event.target.value});
    },
    handleSubmit: function(event){
        event.preventDefault();
        var streamArray = this.state.streamers;
        streamArray.push(this.state.text);
        this.setState({
            streamers: streamArray
        })
    },
    render: function(){
        return (
            <div onChange = {this.handleChange} onSubmit = {this.handleSubmit}>
            <StreamList data = {streamers} onSubmit = {this.handleSubmit}/>
            </div>
        )
    }
})

ReactDOM.render( 
    <Content streamers = {streamers}/>,
document.getElementById("content")
);

