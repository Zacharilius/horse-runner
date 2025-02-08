import './index.css';
import { init } from './game';

document.querySelector('#root')!.innerHTML = `
<div class="content">
  <h1>Horse Runner</h1>
  <canvas id="main-canvas"></canvas>
</div>
`;

init(document!.getElementById('main-canvas') as HTMLCanvasElement);
