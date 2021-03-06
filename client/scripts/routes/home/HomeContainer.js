/**
 * Created by amitava on 04/02/16.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import Helmet from 'react-helmet';

import Album from '../../components/Album';
import Loading from '../../components/Loading';

import {getFeaturedPlaylist, getMyPlaylists} from '../../redux/modules/playlist';
import {watchPlaylist, unwatchPlaylist} from '../../redux/modules/watchlist';
import {createToast} from '../../redux/modules/toast';


@connect(state => state)
export default class HomeContainer extends React.Component {

    componentDidMount(){
        const {dispatch, session: {user}} = this.props;

        dispatch(getFeaturedPlaylist());
        dispatch(getMyPlaylists());

        if(user.email && !user.email_verified){
            dispatch(createToast({
                text: 'Please verify your email address to receive email digest. Please check your inbox/spam folder.',
                timeout: 20000
            }));
        }
    }

    @autobind
    watchPlaylist(id, data){
        this.props.dispatch(watchPlaylist(id, data));
    }


    render(){
        const {playlist: {featured, mine}, watchlist} = this.props;

        let albums = null;

        if(featured.loading){
            albums = <Loading />;
        }else{
            albums = featured.ids.map(i => {
                return (
                    <li key={i}>
                        <Album data={featured.entities[i]} onClick={this.watchPlaylist} watching={!!watchlist.entities[i]} />
                    </li>
                )
            });
        }

        let mylist = null;
        if(mine.loading){
            mylist = <Loading />;
        }else if(mine.ids.length === 0){
            mylist = (
                <div>
                    <h4>You do not have any playlist. Go ahead and create some playlist in Spotify.</h4>
                </div>
            )
        }else {
            mylist = mine.ids.map(i => {
                return (
                    <li key={i}>
                        <Album data={mine.entities[i]} onClick={this.watchPlaylist} watching={!!watchlist.entities[i]} />
                    </li>
                )
            });
        }

        return (
            <div className="home-container">
                <Helmet title="radiole :: Dashboard" />
                <section className="featured">
                    <div className="section-header">
                        <h3>
                            Featured Playlists
                            <small>Click to watch</small>
                        </h3>
                    </div>
                    <div className="section-body">
                        <ul className="list-unstyled album-list">
                            {albums}
                        </ul>
                    </div>
                </section>
                <section>
                    <div className="section-header">
                        <h3>My Playlists</h3>
                        {/*<div className="toggle-watch">
                            <Switch/>
                            <span>Watch All</span>
                        </div>*/}
                    </div>
                    <div className="section-body">
                        <ul className="list-unstyled album-list">
                            {mylist}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
}