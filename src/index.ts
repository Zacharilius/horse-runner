import './index.css';
import { init } from './game';

const rootElement = document.querySelector('#root');

if (rootElement) {
    rootElement.innerHTML = `
        <div class="content">
        <h1>Horse Runner</h1>
        <canvas id="main-canvas"></canvas>
        </div>
    `;
  
    init(document.getElementById('main-canvas') as HTMLCanvasElement);
} else {
    throw Error('Error during initialization. Could not locate root element.');
}
