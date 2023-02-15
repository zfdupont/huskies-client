import React from 'react';
import Map from './Map.jsx';
import NewYork from './NewYork.jsx';
import Georgia from './Georgia.jsx';
import Illinois from './Illinois.jsx';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page:"Map"};
        this.handlePage = this.handlePage.bind(this);
    }
    handlePage(page) {
        this.setState({page: page});
    }
    render() {
        var currPage = null;
        switch(this.state.page) {
            case "Map":
                currPage = <Map handlePage = {this.handlePage}
                />;
                break;
            case "NY":
                currPage = <NewYork/>;
                break;
            case "GA":
                currPage = <Georgia/>;
                break;
            case "IL":
                currPage = <Illinois/>;
                break;
            default:
                currPage = null;
        }
        return (
            <div id = "main">
                {currPage}
            </div>
        )
    }
}