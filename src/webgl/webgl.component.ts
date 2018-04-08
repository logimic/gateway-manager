import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { GatewayModel } from '../gateway/gateway.model';
// import { Axis } from './model';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
// import { DirectionEvent } from '../component/zoom.direction.component';

@Component({
    selector: 'webglcanvas',
    templateUrl: 'webgl.component.html',
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class WebGlComponent implements OnInit, OnDestroy {
    static LAST_POSITION_SHOW = 50;

    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    material: THREE.MeshLambertMaterial;

    controls: OrbitControls;

    loop: number;

    sphere: THREE.Mesh[];
    workpoints: Array<THREE.Mesh> = new Array<THREE.Mesh>();

    // Trajectories meshes
    trajectoryCtrl: THREE.LineSegments = null;
    trajectoryLearn: THREE.Line = null;
    trajManX: THREE.LineSegments = null;
    trajManY: THREE.LineSegments = null;
    trajManZ: THREE.LineSegments = null;


    isInfoColapsed = false;
    // for test purpose
    // test_angle:number = 0;

    //public reqRemoveTraj = false;

    constructor(protected el: ElementRef, protected model: GatewayModel) {

        this.material = new THREE.MeshLambertMaterial({
            color: 0x00cc99
        });

 
    }

    ngOnInit(): void {

        this.scene = new THREE.Scene();

        var plane = new THREE.GridHelper( 2500, 30 );

        plane.rotateX(-Math.PI*0.5);

        this.scene.add(plane);

        var axishelper =  new THREE.AxisHelper(200);

        axishelper.geometry.translate(1000,0,0);

        this.scene.add(axishelper); 

        //Lights
        var lightP = new THREE.PointLight(0xffffff, 2.0, 1000);
        lightP.position.set(-1000, 1300, 0);
        this.scene.add(lightP);
    
        var light2  = new THREE.DirectionalLight(0xffffff, 1.0);
        light2.position.set(2000, 2000, 2000);
        this.scene.add(light2);
    
        var light4  = new THREE.DirectionalLight(0xffffff, 0.5);
        light4.position.set(-2000, 2000, -1000);
        this.scene.add(light4); 
        
        //Camera
        var SCREEN_WIDTH = this.el.nativeElement.clientWidth, SCREEN_HEIGHT = this.el.nativeElement.clientHeight;
        var VIEW_ANGLE = 50, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.set(2000, 2500, 2000);        
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.camera.up = new THREE.Vector3(0,0,1);    
        this.scene.add(this.camera);       

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.setClearColor( 0xeeeeee );
        this.el.nativeElement.appendChild(this.renderer.domElement);

        //Orbit controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.minDistance = 2000;
        this.controls.maxDistance = 5700;

        function zoom(c : THREE.PerspectiveCamera,  aspect : number){
            let direction : THREE.Vector3 = c.getWorldDirection();
            direction = direction.normalize();

            c.position.x += aspect * direction.x;
            c.position.y += aspect * direction.y;
            c.position.z += aspect * direction.z;
        }


        this.controls.dollyOut = function(){
            zoom(this.object, -100);
        }

        this.controls.dollyIn = function(){
            zoom(this.object, 100);
        }
/*
        // chain meshes
        for (var i = 1; i < this.axis.length; i++) {
            this.axis[i - 1].mesh.add(this.axis[i].mesh);
        }

        this.scene.add(this.axis[0].mesh);
        this.scene.add(new THREE.SkeletonHelper(this.axis[0].mesh));
*/
        var geometry = new THREE.SphereGeometry(3, 8, 8);

        this.sphere = new Array(WebGlComponent.LAST_POSITION_SHOW);

        for(var i = 0; i < WebGlComponent.LAST_POSITION_SHOW; i++) {
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

            material.transparent = true;

            material.opacity = 1.0 - i * ( 0.9 / WebGlComponent.LAST_POSITION_SHOW );

            this.sphere[i] = new THREE.Mesh( geometry, material );

            this.scene.add( this.sphere[i] );
        }

        // 20Hz
        this.loop = window.setInterval(() => {
            this.render();
        }, 50);
    }

    onResize(event): void {

        var SCREEN_WIDTH = this.el.nativeElement.clientWidth, SCREEN_HEIGHT = this.el.nativeElement.clientHeight;
        this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }
/*
    onDirectionChanged(e: DirectionEvent): void {

        if (this.camera != null) {

            let len: number = this.camera.position.length();

            if (e.isCommon()) {
                len = Math.sqrt( len * len / 3.0 );

                this.camera.position.x = len;
                this.camera.position.y = len;
                this.camera.position.z = len;
            } else {
                this.camera.position.x = (e.isX()) ? len : 0.0;
                this.camera.position.y = (e.isY()) ? len : 0.0;
                this.camera.position.z = (e.isZ()) ? len : 0.0;
            }

            this.controls.update();
        }
    }
*/

    public render(): void {


    }

    public getDataString(): boolean {
        return false; // (this.d && !this.isInfoColapsed);
    }

    public togleInfoCollapsed(): void {
        this.isInfoColapsed = !this.isInfoColapsed;
    }

    public isInfoCollapsed(): boolean {
       return this.isInfoColapsed;
    }

    ngOnDestroy() {
        window.clearInterval(this.loop);
    }
}
