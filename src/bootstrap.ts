import { init } from './game';

export const bootstrap = async () => {
    const rootElement = document.querySelector('#root');

    if (rootElement) {
        rootElement.innerHTML = `
            <div class="content">
                <canvas id="main-canvas"></canvas>
            </div>
            <div class="modal-overlay hidden" id="modal">
            </div>
        `;

        await init(document.getElementById('main-canvas') as HTMLCanvasElement);
    } else {
        throw Error('Error during initialization. Could not locate root element.');
    }
}
