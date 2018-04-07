import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CobaltModel, PointMachine, Point, IF6, Trajectory } from '../cobalt/cobalt.model';
import { Axis } from './model';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { DirectionEvent } from '../component/zoom.direction.component';

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

    axis: Axis[];

    loop: number;

    sphere: THREE.Mesh[];
    workpoints: Array<THREE.Mesh> = new Array<THREE.Mesh>();

    // Trajectories meshes
    trajectoryCtrl: THREE.LineSegments = null;
    trajectoryLearn: THREE.Line = null;
    trajManX: THREE.LineSegments = null;
    trajManY: THREE.LineSegments = null;
    trajManZ: THREE.LineSegments = null;

    currentData: PointMachine[] = [];
    d: PointMachine = null;

    P: Point = {x: 0, y: 0, z: 0};
    A: Point = {x: 0, y: 0, z: 0};
    a: IF6 = {f1: 0, f2: 0, f3: 0, f4: 0, f5: 0, f6: 0};
    Speed = 0;

    isInfoColapsed = false;
    // for test purpose
    // test_angle:number = 0;

    //public reqRemoveTraj = false;

    constructor(protected el: ElementRef, protected model: CobaltModel) {

        this.material = new THREE.MeshLambertMaterial({
            color: 0x00cc99
        });

        this.material.side = THREE.FrontSide;

        this.axis = new Array<Axis>();

        for (var i = 0; i < 7; i++) {
            this.axis[i] = new Axis(i, this.material, model );
        }
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

        // chain meshes
        for (var i = 1; i < this.axis.length; i++) {
            this.axis[i - 1].mesh.add(this.axis[i].mesh);
        }

        this.scene.add(this.axis[0].mesh);
        this.scene.add(new THREE.SkeletonHelper(this.axis[0].mesh));

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

    /*
    *  General render of Trajectory...
    */
    public trajToSegments(traj: Trajectory): THREE.LineSegments {

        const mline = new THREE.LineBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.VertexColors,
            linewidth: 3
        });

        const gtrajectory = new THREE.Geometry();

        let ln = 0;
        let c1: THREE.Color;

        for (const segment of traj.segments){

            if (segment.reachable === true) {
                c1 = new THREE.Color(0x0000ff);
            } else {
                c1 = new THREE.Color(0xff0000);
            }

            if (segment.geomType === 1) {
                const p1: THREE.Vector3 = new THREE.Vector3(segment.line.pt1.x, segment.line.pt1.y, segment.line.pt1.z);
                ln = gtrajectory.vertices.push(p1);
                gtrajectory.colors[ ln - 1] = new THREE.Color(c1);
                const p: THREE.Vector3 = new THREE.Vector3(segment.line.pt2.x, segment.line.pt2.y, segment.line.pt2.z);
                ln = gtrajectory.vertices.push(p);
                gtrajectory.colors[ ln - 1] = new THREE.Color(c1);

            } else if (segment.geomType === 2) {
                const arrG = this.model.getArcP1P2R(segment.arc.pt1, segment.arc.pt2, segment.arc.normal, segment.arc.radius, 3);

                let i = 0;

                for (const item of arrG) {
                    if (i > 0) {
                        const p1: THREE.Vector3 = new THREE.Vector3(arrG[i - 1].x, arrG[i - 1].y, arrG[i - 1].z);
                        ln = gtrajectory.vertices.push(p1);
                        gtrajectory.colors[ln - 1] = new THREE.Color(c1);

                        const p2: THREE.Vector3 = new THREE.Vector3(arrG[i].x, arrG[i].y, arrG[i].z);
                        ln = gtrajectory.vertices.push(p2);
                        gtrajectory.colors[ln - 1] = new THREE.Color(c1);
                    }

                    i ++;
                }
            }
        }

        return new THREE.LineSegments( gtrajectory, mline );
    }

    public renderCtrlMode(): void {

        // Rebuild CncTrajectory trajectory...
        if (this.model.trajectory != null && this.model.trajChanged) {

            this.scene.remove(  this.trajectoryCtrl );

            this.trajectoryCtrl = this.trajToSegments(this.model.trajectory);

            this.scene.add( this.trajectoryCtrl );
            this.model.trajChanged = false;
        }

        // Rebuild trajManX trajectory...
        if (this.model.trajManX != null) {
            if (this.model.trajManX.changeFlag) {
               // window.alert('OK2');
                this.scene.remove(this.trajManX);

                this.trajManX = this.trajToSegments(this.model.trajManX);

                this.scene.add(this.trajManX);
                this.model.trajManX.changeFlag = false;
            }
        }

        // Rebuild trajManY trajectory...
        if (this.model.trajManY != null) {
            if (this.model.trajManY.changeFlag) {

                this.scene.remove(this.trajManY);

                this.trajManY = this.trajToSegments(this.model.trajManY);

                this.scene.add(this.trajManY);
                this.model.trajManY.changeFlag = false;
            }
        }

        // Rebuild trajManZ trajectory...
        if (this.model.trajManZ != null) {
            if (this.model.trajManZ.changeFlag) {

                this.scene.remove(this.trajManZ);

                this.trajManZ = this.trajToSegments(this.model.trajManZ);

                this.scene.add(this.trajManZ);
                this.model.trajManZ.changeFlag = false;
            }
        }

        // Visibility
        if (!this.model.status.manTrajsOn) {
            if (this.trajManX != null) { this.trajManX.visible = false; }
            if (this.trajManY != null) { this.trajManY.visible = false; }
            if (this.trajManZ != null) { this.trajManZ.visible = false; }

        } else {
            if (this.trajManX != null) { this.trajManX.visible = true; }
            if (this.trajManY != null) { this.trajManY.visible = true; }
            if (this.trajManZ != null) { this.trajManZ.visible = true; }
        }

        this.currentData = this.model.nlast(WebGlComponent.LAST_POSITION_SHOW);

        // End point to show...
        this.P.x = this.currentData[this.model.getRecordIndex()].p.x;
        this.P.y = this.currentData[this.model.getRecordIndex()].p.y;
        this.P.z = this.currentData[this.model.getRecordIndex()].p.z;
        this.A.x = this.currentData[this.model.getRecordIndex()].p.angles.alpha;
        this.A.y = this.currentData[this.model.getRecordIndex()].p.angles.beta;
        this.A.z = this.currentData[this.model.getRecordIndex()].p.angles.gamma;
        this.a = this.currentData[this.model.getRecordIndex()].a;

        var n2 = this.currentData.length;

        this.d = this.currentData[this.model.getRecordIndex()];

        var a = [0, this.d.a.f1, this.d.a.f2, this.d.a.f3, this.d.a.f4, this.d.a.f5, this.d.a.f6];

        // robot
        for (let i = 0; i < this.axis.length; i++) {
            this.axis[i].mesh.setRotationFromAxisAngle(this.axis[i].getVector3().normalize(), a[i]);
        }

        for (let i = 0; i < WebGlComponent.LAST_POSITION_SHOW; i++) {
            if (i < n2) {
                // sphere is in array
                this.sphere[i].visible = true;
                this.sphere[i].position.set(
                    this.currentData[i].p.x, this.currentData[i].p.y, this.currentData[i].p.z);
            } else {
                // out of array, draw in origin
                this.sphere[i].visible = false;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    public renderLearnMode(): void {

        if (this.model.learnTrajectory != null && this.model.learnTrajChanged) {

            // Remove workpoints from scene...
            for (const item of this.workpoints) {
                this.scene.remove(item);
            }

            // Redesign array of workpoints
            this.workpoints.length = 0;

            const geometry = new THREE.SphereGeometry(12, 8, 8);
            const material = new THREE.MeshBasicMaterial( {color: 0xcc0099} );
            material.transparent = true;
            material.opacity = 1.0;

            for (let i = 0; i < this.model.learnTrajectory.wpoints.length; i++) {

                material.transparent = true;
                material.opacity = 1.0;

                const workpoint = new THREE.Mesh( geometry, material );

                workpoint.visible = true;
                workpoint.position.set( this.model.learnTrajectory.wpoints[i].x,
                    this.model.learnTrajectory.wpoints[i].y, this.model.learnTrajectory.wpoints[i].z);

                this.workpoints.push(workpoint);
                this.scene.add( workpoint);
            }

            // Redesign of Learning Trajectory

            this.scene.remove(  this.trajectoryLearn );

            const mline = new THREE.LineBasicMaterial({
                color: 0x0000ff,
                linewidth: 3
            });

            const gtrajectory = new THREE.Geometry();

            const initPt = this.model.pointInit;

            const ipt: THREE.Vector3 = new THREE.Vector3(initPt.p.x, initPt.p.y, initPt.p.z);
            gtrajectory.vertices.push(ipt);

            for (const segment of this.model.learnTrajectory.segments){

                const p: THREE.Vector3 = new THREE.Vector3(segment.line.pt2.x, segment.line.pt2.y, segment.line.pt2.z);
                gtrajectory.vertices.push(p);

            }

            this.trajectoryLearn = new THREE.Line( gtrajectory, mline );

            this.scene.add( this.trajectoryLearn );

            // Change flag back
            this.model.learnTrajChanged = false;
        }

        this.P.x = this.model.learnPos.p.x;
        this.P.y = this.model.learnPos.p.y;
        this.P.z = this.model.learnPos.p.z;
        this.A.x = this.model.learnPos.p.angles.alpha;
        this.A.y = this.model.learnPos.p.angles.beta;
        this.A.z = this.model.learnPos.p.angles.gamma;
        this.a = this.model.learnPos.a;

        const a = [
            0,
            this.model.learnPos.a.f1,
            this.model.learnPos.a.f2,
            this.model.learnPos.a.f3,
            this.model.learnPos.a.f4,
            this.model.learnPos.a.f5,
            this.model.learnPos.a.f6
        ];

        // robot
        for (let i = 0; i < this.axis.length; i++) {
            this.axis[i].mesh.setRotationFromAxisAngle(this.axis[i].getVector3().normalize(), a[i]);
        }

        // Render
        this.renderer.render(this.scene, this.camera);

    }

    public render(): void {

        // Control mode
        if (this.model.status.mode === 0) {

            // invisible control traj
            if (this.trajectoryLearn != null) {
                if (this.trajectoryLearn.visible) {
                    this.trajectoryLearn.visible = false;
                }
            }

            for (let i = 0; i < this.sphere.length; i ++) {
                this.sphere[i].visible = true;
            }

            for (const item of this.workpoints) {
                item.visible = false;
            }

            this.renderCtrlMode();

        } else if (this.model.status.mode === 1) {
        // Learning mode

            if (this.trajectoryCtrl != null) {
                // invisible control traj
                if (this.trajectoryCtrl.visible) {
                    this.trajectoryCtrl.visible = false;
                }
            }

            for (let i = 0; i < this.sphere.length; i ++) {
                this.sphere[i].visible = false;
            }

            for (const item of this.workpoints) {
                item.visible = true;
            }

            this.renderLearnMode();
        }

    }

    public getDataString(): boolean {
        return (this.d && !this.isInfoColapsed);
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
