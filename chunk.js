import {Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry} from 'three';

const material = new MeshStandardMaterial({ wireframe: true, color:'green' }
)
export default class Chunk extends Mesh {
    constructor(size, noise, position, params, LOD = 5) 
    {
        var segments_LOD = Math.floor(size * 0.5 ** LOD);
        segments_LOD = segments_LOD < 1 ? 1 : segments_LOD;
        const geometry = new PlaneGeometry(size, size, segments_LOD, segments_LOD);
        geometry.rotateX(-Math.PI * 0.5);

        super(geometry, material);

        this.size = size;
        this.noise = noise;
        this.position.copy(position);

        this.params = params;

        this.LOD = LOD;
        
        this.updateGeometry();
    }

    updateGeometry()
    {
        const amplitude = this.params[0]; 
        const freq_x = this.params[1];
        const freq_z = this.params[2];
        const octaves = this.params[3];
        const persistance = this.params[4];
        const lacunarity = this.params[5];

        const vertex_positions = this.geometry.getAttribute("position");
        for(let i = 0; i < vertex_positions.count; ++i)
        {
            var x = vertex_positions.getX(i) + this.position.x;
            var z = vertex_positions.getZ(i) + this.position.z;
            var y = this.noise(x * freq_x * 0.01, z * freq_z * 0.01) * amplitude;

            for(let j = 1; j < octaves; ++j)
            {
                var amplitude_ = amplitude * (persistance ** j)
                y += this.noise(x * freq_x * 0.01 * (lacunarity ** j), z * freq_z * 0.01 * (lacunarity ** j)) * amplitude_;
            }


            vertex_positions.setY(i, y);
        }

        this.geometry.computeVertexNormals();
        vertex_positions.needsUpdate = true;
    }
}
