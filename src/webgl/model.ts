
import { CobaltModel, Point } from '../cobalt/cobalt.model'
import { ISTLFacets, StlService } from '../webgl/stl.service';
import * as THREE from 'three'

export class Axis{

    protected geometry : THREE.Geometry;
    public mesh: THREE.SkinnedMesh;
    public bone: THREE.Bone;
    public skeleton: THREE.Skeleton;

    constructor(index:number, material:THREE.MeshLambertMaterial, protected model?:CobaltModel){

        let b:Point[] = this.model.bone(index);
        let o:Point = this.model.origin(index);

        if(index < 6)
        {

            let fs:ISTLFacets = this.model.mesh(index);

            this.geometry = new THREE.Geometry();

            var i=0;

            var skinIndex = new THREE.Vector4(0,0,0,0);
            var weightIndex = new THREE.Vector4(100,0,0,0);

            for(let f of fs.facets){
                this.geometry.vertices.push(new THREE.Vector3( f.verts[0][0] - o.x, f.verts[0][1] - o.y, f.verts[0][2] - o.z)); 
                this.geometry.vertices.push(new THREE.Vector3( f.verts[1][0] - o.x, f.verts[1][1] - o.y, f.verts[1][2] - o.z));
                this.geometry.vertices.push(new THREE.Vector3( f.verts[2][0] - o.x, f.verts[2][1] - o.y, f.verts[2][2] - o.z));
                this.geometry.faces.push( new THREE.Face3(i++, i++, i++) );   
            }
            
        }
        else{
            //last element now is sphere
            this.geometry = new THREE.SphereGeometry(5, 10, 10);
        }

        this.geometry.computeFaceNormals();            

        this.mesh = new THREE.SkinnedMesh(this.geometry, material); 

        if(index == 6){
            var le = 100;
            for(var i = 0; i<3; i++){
                let g = new THREE.Geometry();
                let m: THREE.LineBasicMaterial;    
                g.vertices.push(new THREE.Vector3(0,0,0));
                if(i==0){                
                    m = new THREE.LineBasicMaterial({color:0xff0000});
                    g.vertices.push(new THREE.Vector3(le,0,0)) ;
                }
                else if(i==1){
                    g.vertices.push(new THREE.Vector3(0,le,0));
                    m = new THREE.LineBasicMaterial({color:0x00ff00});
                }
                else if(i==2){
                    g.vertices.push(new THREE.Vector3(0,0,le));
                    m = new THREE.LineBasicMaterial({color:0x0000ff});
                }

                this.mesh.add(new THREE.Line(g, m))
            }

            
        }

        //position is aggregated by nesting of meshes
        o =  this.model.origins[index];

        this.mesh.position.set(o.x, o.y, o.z);
    
        this.bone = new THREE.Bone(this.mesh);
        
        this.bone.position.set(0, 0, 0);
    
        let bone:THREE.Bone = new THREE.Bone(this.mesh);

        bone.position.set( b[1].x , b[1].y, b[1].z );

        this.bone.add(bone);
        
        this.mesh.add(this.bone);

        this.skeleton = new THREE.Skeleton([this.bone, bone]);

        this.mesh.bind(this.skeleton);        
    }

    getVector3():THREE.Vector3{
        return new THREE.Vector3(
            this.mesh.skeleton.bones[1].position.x,
            this.mesh.skeleton.bones[1].position.y,
            this.mesh.skeleton.bones[1].position.z,
        );         
    }
    
    render(material:THREE.MeshLambertMaterial):void{

    }
}
