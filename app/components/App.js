import React from 'react';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {numberOfClicks: 0};
    
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState((state, props) => ({
            numberOfClicks: state.numberOfClicks + 1
        }));
    }

    render() {
        const numClicks = this.state.numberOfClicks
        let buttonText;
        if (numClicks == 0) {
            buttonText = "Click me!";
        } else {
            buttonText = "This button has been clicked " + numClicks + " times"
        }

        return (
            <button onClick = {this.handleClick}>
                {buttonText}
            </button>
        );


    }
}
  
function App() {
    return <Button />;
}

export default App;