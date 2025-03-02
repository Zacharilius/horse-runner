import { init } from './game';

export const bootstrap = async () => {
    const rootElement = document.querySelector('#root');

    if (rootElement) {
        rootElement.innerHTML = `
            <div class="content">
                <canvas id="main-canvas"></canvas>
            </div>
            <div class="modal-overlay hidden" id="modal">
                <div class="modal-content">
                    <h2>Keys</h2>
                    <div class="modal-body">
                        <div class="column">
                            <table>
                                <tr>
                                    <td></td>
                                    <td>&uarr;</td>
                                    <td></td>
                                <tr>
                            <tr>
                                    <td>&larr;</td>
                                    <td></td>
                                    <td>&rarr;</td>
                                <tr>
                            <tr>
                                    <td></td>
                                    <td>&darr;</td>
                                    <td></td>
                                <tr>
                            </table>
                        </div>
                        <div class="column">
                            <table>
                                <tr>
                                    <td class="center">r</td>
                                    <td>run</td>
                                <tr>
                            <tr>
                                    <td class="center">n</td>
                                    <td>neigh</td>
                                <tr>
                            <tr>
                                    <td class="center">" "</td>
                                    <td>jump</td>
                                <tr>
                                <tr>
                                    <td class="center">s</td>
                                    <td>change horses</td>
                                <tr>
                            </table>
                        </div>
                    </div>
                    <button class="close-modal-button">X</button>
                </div>
            </div>
        `;

        await init(document.getElementById('main-canvas') as HTMLCanvasElement);
    } else {
        throw Error('Error during initialization. Could not locate root element.');
    }
}
