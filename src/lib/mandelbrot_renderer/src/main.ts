/*
import * as ProgressBar from 'progressbar.js';
import { init as canvasInit } from './canvas_service/main';

const progressBar = document.createElement('div');
progressBar.setAttribute('id', 'progress-bar');
document.body.prepend(progressBar);

const canvasContainer = document.createElement('div');
canvasContainer.setAttribute('id', 'canvas-container');
document.body.prepend(canvasContainer);

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'canvas');
canvasContainer.append(canvas);

canvasInit(
	canvasContainer,
	canvas,
	new ProgressBar.Line(progressBar, {
		easing: 'easeInOut',
		strokeWidth: 0.25,
		color: '#e41f1f'
	})
);
*/