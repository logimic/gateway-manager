import { Component, OnInit, ElementRef } from '@angular/core';
import { CobaltModel, PointMachine } from './cobalt.model';
import * as THREE from 'three';

@Component({
    selector: 'app-canvas-panel',
    template: `<canvas></canvas>`
})
export class CobaltCanvasComponent implements OnInit {

    canvas: HTMLCanvasElement = null;

    constructor( protected robot: CobaltModel, protected el: ElementRef ) {
        this.canvas = el.nativeElement;
    }

    ngOnInit(): void {
    }

    public paint(): void {

        const r: PointMachine = this.robot.last();

        if (this.canvas == null || r == null) {
            return;
        }

        const ctx = this.canvas.getContext( '2d' );

        ctx.clearRect(3, 3, 600, 250);

        ctx.beginPath();
        ctx.rect(3, 3, 600, 250);
        ctx.fillStyle = 'rgba(0,204,153,0.5)';
        // context.fillRect( 0, 0, background.width, background.height );
        // context.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0066cc';
        ctx.stroke();
        ctx.font = 'bold 24px Lucida Sans Unicode, Lucida Grande, sans-serif';
        ctx.fillStyle = '#0066cc';
        ctx.fillText('Cobalt Demo', 10, 25);

        // Position of endpoint
        ctx.font = 'bold 20px Lucida Sans Unicode, Lucida Grande, sans-serif';
        ctx.fillText('Grab pos:', 10, 60);

        // Axes of robot
        const ept: String = 'Ax1: ' + r.a.f1.toPrecision(4) + '  Ax2: ' + r.a.f2.toPrecision(4) + '  Ax3: ' + r.a.f3.toPrecision(4);
        ctx.fillText(ept.toString(), 10, 100);

        const ept2: String = 'Ax4: ' + r.a.f4.toPrecision(4) + '  Ax5: ' + r.a.f5.toPrecision(4) + '  Ax6: ' + r.a.f6.toPrecision(4);
        ctx.fillText(ept2.toString(), 10, 140);

        ctx.restore();
    }
}

@Component({
    selector: 'app-three-cobalt3d',
    template: '<canvas></canvas>'
})
export class Cobalt3dComponent implements OnInit {

    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: THREE.OrbitControls;
    scene: THREE.Scene;

    constructor() {

    }

    ngOnInit(): void {

    }
}
