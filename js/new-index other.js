var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "brunofin", "comster44", "RobotCaleb", "thomasballinger", "beohoff", "LIRIK", "mitchflowerpower"]

var streamerData = []

var APICaller = React.createClass ({
    callApi: function(username){
        var d1 = $.get("https://api.twitch.tv/kraken/streams/"+username)
        var d2 = $.get("https://api.twitch.tv/kraken/users/"+username)    
        $.when(d1, d2).done(function(streamsResponse, usersResponse){
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
        }.bind(this))
    },   
    handleChange: function(event){
        this.setState({text: event.target.value});
    },
    handleSubmit: function(event){
        event.preventDefault();
        this.callApi(this.state.text)
    },
    getInitialState: function() {
        streamers.forEach(this.callApi)    
        return {   
        streamers: [], 
        text: ""
        }
        },
    render: function() {
                return (
            <div >
            <Content streamers = {this.state.streamers} />
            <AddStreamerForm onChange = {this.handleChange} onSubmit = {this.handleSubmit} text = {this.state.text} />
            </div>
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
    componentWillReceiveProps: function(nextProps){
        this.setState({
            streamers: nextProps.streamers
        })
    }, 
    render: function(){
        return (
            
            <StreamList data = {this.state.streamers}/>
        )
    }
})

var StreamList = React.createClass ({
    getInitialState: function(){
        return{ 
           data: this.props.data
        }   
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            data: nextProps.data
        })
    }, 
    componentDidMount: function() {
        this.setState({
            added: this.props.added
        })
    },
    render: function(){
        var StreamerTags = this.state.data.map(function(user, i){
            return React.createElement(Streamer, 
                {user: user,
                 key: i}
            )
        })

    return (
        <div className = "container">
        <table className = "streamerTable">
        <thead>
        <tr>
        <th className = "user" >User</th>
        <th className = "bio" >Bio</th>
        <th className = "status" >Status</th> 
        </tr>
        </thead>
        <tbody>          
        {StreamerTags}
        </tbody>
        </table>  
        </div>
        )
    }
})

var AddStreamerForm = React.createClass ({
    getInitialState: function() {
        return {
            text: this.props.text
        }
    },
    render: function(){
        return (
            <form className = "addForm" onChange = {this.props.onChange} onSubmit = {this.props.onSubmit} >
            <input type = "text" placeholder = "Search and add a streamer" />
            <input type = "submit" value = "Go!" />
            </form>
        )
    }
})


var Streamer = React.createClass ({
    getInitialState: function() {
        return {
            username: this.props.user.username,
            url: this.props.user.url,
            pic: this.props.user.pic, 
            stream: this.props.user.stream ? this.props.user.stream.game : "Not online",
            bio: this.props.user.bio
    }
    },
    render: function(){
        return(
            <tr>
            <td ><div className = "username"><img src = {this.state.pic}/><a href =  {this.state.url}>{this.state.username}</a></div></td>
            <td>{this.state.bio}</td>
            <td>{this.state.stream}</td>
            </tr>       
            )
    }
}
)

ReactDOM.render( 
    <APICaller />,
document.getElementById("content")
);

