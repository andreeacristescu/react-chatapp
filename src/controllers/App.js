import React, {Component} from 'react';
import '../styles/App.scss';

/** Create DUMMY_DATA to test the functionality of the app without the chat-kit
 * Pass the DUMMY_DATA variable to the state of the app as a prop
 const DUMMY_DATA = [
 {
        senderId: "user_1",
        text: "who'll win?"
    },
 {
        senderId: "user_2",
        text: "me!"
    }
 ]; */

const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/229296c7-105f-4454-8dc9-589b4d99d93e/token";
const instanceLocator = "v1:us1:229296c7-105f-4454-8dc9-589b4d99d93e";
const roomId = 17066297;
const username = 'andreea';

class App extends Component {

    constructor() {
        super();
        this.state = {
            messages: []
        };
        this.sendMessage = this.sendMessage.bind(this)
    }

    /**
     * Connecting the React.js components to the API.
     * onNewMessage hook is triggered every time a new message is broadcast to the chat room.
     */
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: username,
            tokenProvider: new Chatkit.TokenProvider({
                url: testToken
            })
        });

        chatManager.connect()
            .then(currentUser => {
                this.currentUser = currentUser;
                this.currentUser.subscribeToRoom({
                    roomId: roomId,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message]
                            })
                        }
                    }
                })
            })
    }

    /**
     * It takes one parameter and it calls this.currentUser.sendMessage() in order to send messages to chat-kit.
     * @param text
     */
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: roomId
        })
    }

    render() {
        return (
            <div className="app">
                <Title/>
                <MessageList
                    roomId={this.state.roomId}
                    messages={this.state.messages}/>
                <SendMessageForm
                    sendMessage={this.sendMessage}/>
            </div>
        );
    }
}

class MessageList extends Component {
    /**
     * message contains an array of objects.
     * Rendering out the text and senderId properties from the objects.
     */
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map(message => {
                    return (
                        <li key={message.id} className="message">
                            <div>{message.senderId}</div>
                            <div>{message.text}</div>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends Component {
    /**
     * Constructor to initialize the state and bind .this in the handleChange method
     */
    constructor() {
        super();
        this.state = {
            message: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Hook the event handler with the onChange event listener
     * @param e
     */
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    /**
     * Hook the event handler with the onSubmit event listener
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        })
    }

    /**
     * The component controls what’s being rendered in the input field via its state.
     */
    render() {
        return (
            /**
             * Listening for user inputs with the onChange event listener, to trigger the handleChange method
             * Setting the value of the input field explicitly using this.state.message
             */
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    className="cursor"
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text"/>
            </form>
        )
    }
}

function Title() {
    return <p className="title">React chat application using Chat-kit</p>
}

export default App;