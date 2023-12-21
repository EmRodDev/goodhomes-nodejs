(function(){
        //Logical OR
        const lat = 25.8727564;
        const lng = -80.2939832;
        
        const map = L.map('home-map').setView([lat, lng ], 20);
        let markers = new L.FeatureGroup().addTo(map);
        let properties = [];
                
        //Filters 
        const filters = {
            category: '',
            price: '',
            published: true
        }

        const categoriesSelect = document.querySelector('#categories');
        const pricesSelect = document.querySelector('#prices');
        
        //Filtering of Categories and Prices

        categoriesSelect.addEventListener('change', e => {
            filters.category = +e.target.value;

            filterProperties();
        });
        
        pricesSelect.addEventListener('change', e => {
            filters.price = +e.target.value;

            filterProperties();

        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const getProperties = async () =>{
            try{
                const url = '/api/properties';
                const response = await fetch(url);
                properties = await response.json();


                showProperties(properties);

            } catch(err){
                console.log(err);
            }
        }

        const showProperties = properties => {
            //Clean previous markers
            markers.clearLayers();

            properties.forEach(property =>{
                
                if(property.published){

                    //Add the pins
                    const marker = new L.marker([property?.lat, property?.lng], {
                        autoPan: true
                    }).addTo(map)
                    .bindPopup(`
                    <h1 class="text-xl font-extrabold my-2">${property.title}</h1>
                    <img src="/uploads/${property?.images}" alt="Property's image"></img>
                    <p class="text-gray-600 font-bold">${property.price.value}</p>
                    <p class="text-green-600 font-bold">${property.category.name}</p>
                    <a href="/property/${property.id}" class="bg-green-600 block p-2 text-center font-bold uppercase text-white-0">View property</a>
                    `);

                    markers.addLayer(marker);
                }

            });
        }

        const filterProperties = () => {
            const result = properties
            .filter(filterCategory)
            .filter(filterPrice);


           showProperties(result);
        }

        const filterCategory = property => filters.category ? property.categoryId === filters.category : property;
        const filterPrice = property => filters.price ? property.priceId === filters.price : property;

        getProperties();
})()