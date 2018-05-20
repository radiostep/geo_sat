window.onload = function() {
    Player.init();
}

Player = {
    init: function(){
        let container = document.getElementsByClassName("webgl")[0];
        this.scene = new THREE.Scene();

        // // Axis helper
        // let axesHelper = new THREE.AxesHelper(500);
        // this.scene.add(axesHelper);

        // Camera
        let aspect = container.offsetWidth / container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(30.0, aspect, 1, 1000);
        this.camera.position.set(10,5,5);
        this.scene.add(this.camera);

        // Lights
        let light = new THREE.AmbientLight();
        this.scene.add(light);

        // let pointLight = new THREE.PointLight(0xffffff, 1, 100);
        // pointLight.position.set(15, 15, 15);
        // this.scene.add(pointLight);

        // // Light helper
        // let pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
        // this.scene.add(pointLightHelper);


        this.renderer = new THREE.WebGLRenderer();
        container.appendChild(this.renderer.domElement);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);

        // Controls
        this.controls = new THREE.TrackballControls(this.camera, container);
        this.controls.zoomSpeed = 0.4;

        // Resize
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });


        let imagesE = [];
        let imagesW = [];
        let texture = new THREE.Texture();
        let texture2 = new THREE.Texture();

        // Load mash JSON
        let loader = new THREE.JSONLoader();
        let imgLoader = new THREE.ImageLoader();
        loader.load('static/mesh/geo.json', (geometry) => {
            mesh = new THREE.Mesh(geometry);
            this.scene.add(mesh);


            for (let i=0; i<10; i++){
                imgLoader.load("static/img/e/"+(i+1)+".png", (image) => {
                    imagesE[i] = image;
                });
            }
            for (let i=0; i<10; i++){
                imgLoader.load("static/img/w/"+(i+1)+".png", (image) => {
                    imagesW[i] = image;
                });
            }

            setTimeout(function(){
                texture.image = imagesE[0];
                texture2.image = imagesW[0];
                texture.needsUpdate = true;
                texture2.needsUpdate = true;
            }, 2000);
            mesh.material = [
                new THREE.MeshPhongMaterial({map: texture, specular: 0xffffff, shininess: 25}),
                new THREE.MeshPhongMaterial({map: texture2, specular: 0xffffff, shininess: 25})
            ];
            // console.log(mesh.material[1].map);
        });

        this.count = 0;
        this.textureAnimator = function(){
            if (this.scene.children[2] && imagesE[(this.count).toFixed()]) {
                this.scene.children[2].material[0].map.image = imagesE[(this.count).toFixed()];
                this.scene.children[2].material[1].map.image = imagesW[(this.count).toFixed()];
                texture.needsUpdate = true;
                texture2.needsUpdate = true;
                this.count+=0.1;
                if (this.count>9){
                    this.count = 0;
                }
            }
        }

        this.animate();

    },
    animate: function(){
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.textureAnimator();
    }

}