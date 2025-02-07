import Sound from './index';

const MOCK_AUDIO_FILE_NAME = 'mock.mp3';

const createAudioElement = () => {
    const audioElement = document.createElement('audio');
    const playSpy = jest.spyOn(audioElement, 'play');
    playSpy.mockImplementation();
    const pauseSpy = jest.spyOn(audioElement, 'pause');
    pauseSpy.mockImplementation();
    return audioElement;
}

test('calling play() plays a sound', () => {
    const audioElement = createAudioElement();
    jest.spyOn(document, 'createElement').mockReturnValueOnce(audioElement);
    const sound = new Sound(MOCK_AUDIO_FILE_NAME);
    expect(audioElement.play).toHaveBeenCalledTimes(0);
    sound.play();
    expect(audioElement.play).toHaveBeenCalledTimes(1);
});

test('calling pause() pauses a sound', () => {
    const audioElement = createAudioElement();
    jest.spyOn(document, 'createElement').mockReturnValueOnce(audioElement);
    const sound = new Sound(MOCK_AUDIO_FILE_NAME);
    expect(audioElement.pause).toHaveBeenCalledTimes(0);
    sound.pause();
    expect(audioElement.pause).toHaveBeenCalledTimes(1);
});

test('calling setPlaybackRate() sets the playback rate', () => {
    const MOCK_PLAYBACK_RATE = 2;

    const audioElement = createAudioElement();
    jest.spyOn(document, 'createElement').mockReturnValueOnce(audioElement);
    const sound = new Sound(MOCK_AUDIO_FILE_NAME);
    sound.setPlaybackRate(MOCK_PLAYBACK_RATE);
    expect(audioElement.playbackRate).toBe(MOCK_PLAYBACK_RATE);
});
