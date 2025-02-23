export namespace main {
	
	export class StreamResponse {
	    statusCode: number;
	    url: string;
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new StreamResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.statusCode = source["statusCode"];
	        this.url = source["url"];
	        this.message = source["message"];
	    }
	}
	export class Video {
	    name: string;
	    size: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new Video(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.size = source["size"];
	        this.path = source["path"];
	    }
	}

}

