import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import * as stl from 'stl';

export interface ISTLFacet {
    normal: number[];
    verts: [ number[], number[], number[] ];
}

export interface ISTLFacets {
    description?: string;
    facets: ISTLFacet[];
    name: string;
}


@Injectable()
export class StlService {
    constructor(protected http: Http) {
    }

    // get stl parsed to ISTLFacets
    get(name: string): Observable<ISTLFacets> {
        var path = `./assets/stl/c${name}.stl`;
        return new Observable<ISTLFacets>( o => {
                this.http.get(path).subscribe(
                    r => {
                        let data: ISTLFacets = stl.toObject(r.text());
                        data.name = name;
                        o.next(data);
                    },
                err => o.error(err));
        });
    }
}
