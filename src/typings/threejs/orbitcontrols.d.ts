import * as THREE from 'three'

export class OrbitControls extends THREE.EventDispatcher
{
    constructor(object: object, domElement?: any);
    public update() : void;
}
