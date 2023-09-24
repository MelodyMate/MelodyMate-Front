import React, { createContext, useReducer, useRef } from 'react';
import { IMusicState, MusicActions, musicReducer } from '../reducers/musicReducer';
import mock from '../data/mock.json';
import { IPlayer } from '../types/types';
import { YouTubeProps } from 'react-youtube';

interface IMusicContextProps {
	children: React.ReactNode;
}

export interface IMusicContext {
	state: IMusicState;
	dispatch: React.Dispatch<MusicActions>;
	playerRef: React.MutableRefObject<IPlayer | null>;
	handleReady: YouTubeProps['onReady'];
	handleStateChange: YouTubeProps['onStateChange'];
	handleSongClick: (index: number) => void;
	handlePlayClick: () => void;
	handlePauseClick: () => void;
	handleNextSong: () => void;
	handlePrevSong: () => void;
	handleTimeUpdate: (newTime: number) => void;
}

const defaultMusicState: IMusicState = {
	songs: mock.data,
	isPlaying: false,
	isMuted: true,
	volume: 100,
	playerLoading: true,
	isSongLoaded: false,
	currentSongIndex: 0,
	currentTime: 0,
	duration: 0,
	songTransitionLoading: false,
	isPrevDisabled: false,
	isNextDisabled: false,
	isPlayButton: true,
	isFirstPlay: true,
};

/* eslint-disable @typescript-eslint/no-empty-function */
const defaultContext: IMusicContext = {
	state: defaultMusicState,
	dispatch: () => {},
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	playerRef: undefined! as React.MutableRefObject<IPlayer | null>,
	handleReady: () => {},
	handleStateChange: () => {},
	handleSongClick: () => {},
	handlePlayClick: () => {},
	handlePauseClick: () => {},
	handleNextSong: () => {},
	handlePrevSong: () => {},
	handleTimeUpdate: () => {},
};

const MusicContext = createContext<IMusicContext>(defaultContext);

export const MusicProvider = ({ children }: IMusicContextProps) => {
	const playerRef = useRef<IPlayer | null>(null);

	const [state, dispatch] = useReducer(musicReducer, defaultMusicState);
	const {
		songs,
		isMuted,
		volume,
		isSongLoaded,
		currentSongIndex,
		isPrevDisabled,
		isNextDisabled,
		isPlaying,
		isFirstPlay,
	} = state;

	const handleReady: YouTubeProps['onReady'] = (event) => {
		playerRef.current = event.target;
		if (playerRef.current) {
			playerRef.current.setVolume(volume);
		}
		dispatch({ type: 'SET_PLAYER_LOADING', payload: false });
		dispatch({ type: 'SET_SONG_TRANSITION_LOADING', payload: false });
		dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });

		if (isMuted) {
			event.target.mute();
		} else {
			event.target.unMute();
		}

		dispatch({ type: 'SET_SONG_LOADED', payload: true });
		dispatch({ type: 'SET_SONG_TRANSITION_LOADING', payload: false });
	};

	const handleStateChange: YouTubeProps['onStateChange'] = (event) => {
		switch (event.data) {
			case 0:
				dispatch({ type: 'SET_PLAYER_LOADING', payload: true });
				dispatch({ type: 'SET_SONG_LOADED', payload: false });
				handleNextSong();
				break;

			case 1:
				dispatch({ type: 'SET_PLAYER_LOADING', payload: false });
				dispatch({ type: 'SET_DURATION', payload: event.target.getDuration() });
				dispatch({ type: 'SET_SONG_LOADED', payload: true });
				dispatch({ type: 'SET_SONG_TRANSITION_LOADING', payload: false });
				break;

			default:
				break;
		}
	};
	const handleSongClick = (index: number) => {
		dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: index });
	};

	const handlePlayClick = () => {
		if (playerRef.current) {
			dispatch({ type: 'SET_PLAY', payload: true });
			playerRef.current.playVideo();
			if (isFirstPlay && isMuted) {
				playerRef.current.unMute();
				dispatch({ type: 'SET_MUTE', payload: false });
			}
			dispatch({ type: 'SET_PLAY_BUTTON', payload: false });
			dispatch({ type: 'SET_FIRST_PLAY', payload: false });
		}
	};

	const handlePauseClick = () => {
		if (playerRef.current) {
			dispatch({ type: 'SET_PLAY', payload: false });
			playerRef.current.pauseVideo();
			dispatch({ type: 'SET_PLAY_BUTTON', payload: true });
		}
	};

	const handleNextSong = () => {
		if (!isSongLoaded || isNextDisabled) return;

		dispatch({ type: 'SET_SONG_LOADED', payload: false });
		dispatch({ type: 'SET_SONG_TRANSITION_LOADING', payload: true });

		let newIndex = currentSongIndex + 1;

		if (newIndex >= songs.length) {
			newIndex = 0;
		}

		dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: newIndex });
		dispatch({ type: 'SET_PLAY', payload: true });

		if (playerRef.current) {
			const videoId = new URL(songs[newIndex].url).searchParams.get('v') || '';
			playerRef.current.loadVideoById(videoId);
		}

		if (!isFirstPlay && !isPlaying && isMuted) {
			dispatch({ type: 'SET_PLAY_BUTTON', payload: false });
		}

		if (!isFirstPlay && !isMuted) {
			dispatch({ type: 'SET_PLAY_BUTTON', payload: false });
		}
	};

	const handlePrevSong = async () => {
		if (!isSongLoaded || isPrevDisabled) return;

		dispatch({ type: 'SET_SONG_LOADED', payload: false });
		dispatch({ type: 'SET_SONG_TRANSITION_LOADING', payload: true });

		let newIndex = currentSongIndex - 1;

		if (newIndex < 0) {
			newIndex = songs.length - 1;
		}

		dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: newIndex });
		dispatch({ type: 'SET_PLAY', payload: true });

		if (playerRef.current) {
			const videoId = new URL(songs[newIndex].url).searchParams.get('v') || '';
			playerRef.current.loadVideoById(videoId);
		}

		if (!isFirstPlay && !isPlaying && isMuted) {
			dispatch({ type: 'SET_PLAY_BUTTON', payload: false });
		}

		if (!isFirstPlay && !isMuted) {
			dispatch({ type: 'SET_PLAY_BUTTON', payload: false });
		}
	};

	const handleTimeUpdate = (newTime: number) => {
		if (playerRef.current) {
			dispatch({ type: 'SET_PLAY', payload: false });
			playerRef.current.seekTo(newTime);
			dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
			dispatch({ type: 'SET_PLAY', payload: true });
		}
	};

	const handlers = {
		handleReady,
		handleStateChange,
		handleSongClick,
		handlePlayClick,
		handlePauseClick,
		handleNextSong,
		handlePrevSong,
		handleTimeUpdate,
	};

	return (
		<MusicContext.Provider
			value={{
				state,
				dispatch,
				playerRef,
				...handlers,
			}}
		>
			{children}
		</MusicContext.Provider>
	);
};

export default MusicContext;