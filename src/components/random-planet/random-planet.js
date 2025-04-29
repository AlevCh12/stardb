import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Spinner from '../spinner'
import {ErrorIndicator} from "../errors"
import './random-planet.css'

export default class RandomPlanet extends Component {

    static defaultProps = {
        updateInterval: 3000
    }

    static propTypes = {
        updateInterval: PropTypes.number,
        swapiService: PropTypes.object.isRequired
    }

    state = {
        planet: {},
        loading: true,
        error: false,
        errorMessage: ''
    };

    componentDidMount() {
        const {updateInterval} = this.props
        this.updatePlanet()
        this.interval = setInterval(this.updatePlanet, updateInterval)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    onPlanetLoaded = (planet) => {
        this.setState({
            planet,
            loading: false,
            error: false,
            errorMessage: ''
        });
    };

    onError = (err) => {
        this.setState({
            loading: false,
            error: true,
            errorMessage: err.message
        })
    }

    updatePlanet = () => {
        const id = Math.floor(Math.random() * 19) + 2
        this.props.swapiService
            .getPlanet(id)
            .then(this.onPlanetLoaded)
            .catch(this.onError)
    }

    handleRetry = () => {
        this.setState({ loading: true, error: false })
        this.updatePlanet()
    }

    render() {
        const { planet, loading, error, errorMessage } = this.state

        const hasData = !(loading || error)

        const errorContent = error ? (
            <div className="error-message">
                <ErrorIndicator />
                <p>{errorMessage}</p>
                <button 
                    className="btn btn-primary"
                    onClick={this.handleRetry}
                >
                    Try Again
                </button>
            </div>
        ) : null

        const spinner = loading ? <Spinner/> : null
        const content = hasData ? <PlanetView planet={planet}/> : null

        return (
            <div className="random-planet jumbotron rounded">
                {errorContent}
                {spinner}
                {content}
            </div>
        );
    }
}

const PlanetView = ({ planet }) => {
    const{id, name, population, rotationPeriod, diameter} = planet;

    return(
        <React.Fragment>
            <img className="planet-image"
                 src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`}  alt={'Planet'}/>
            <div>
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="term">Population</span>
                        <span>{population}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Rotation Period</span>
                        <span>{rotationPeriod}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Diameter</span>
                        <span>{diameter}</span>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );
};