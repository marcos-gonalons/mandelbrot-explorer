import { init as canvasInit } from './canvas_service/main';
import * as ProgressBar from 'progressbar.js';

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'canvas');
document.body.append(canvas);

const progressBar = document.createElement('div');
progressBar.setAttribute('id', 'progress-bar');
document.body.append(progressBar);

canvasInit(
	canvas,
	new ProgressBar.Line(progressBar, {
		easing: 'easeInOut',
		strokeWidth: 0.25,
		color: '#56ef25'
	})
);
