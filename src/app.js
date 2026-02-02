import React, { Component } from 'react';
import AppProvider from './AppProvider';
import BoardView from "./components/Board";

import './App.css';

class App extends Component {
    render() {
        return (
            <AppProvider>
                <div className="app">
                    <BoardView />
                </div>
            </AppProvider>
        );
    }
}

export default App;
