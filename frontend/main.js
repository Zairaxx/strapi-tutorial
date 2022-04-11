let loginIdentifier = document.querySelector("#identifier");
let loginPassword = document.querySelector("#password");

const login = async () => {
    let response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: loginIdentifier.value,
        password: loginPassword.value
    });
    console.log(response);
    sessionStorage.setItem("token", response.data.jwt);
    checkLoginStatus();
}

let registerUsername = document.querySelector("#registerUsername");
let registerEmail = document.querySelector("#registerEmail");
let registerPassword = document.querySelector("#registerPassword");

const register = async () => {
    let response = await axios.post(
        "http://localhost:1337/api/auth/local/register",
    {
        username:registerUsername.value,
        password:registerPassword.value,
        email:registerEmail.value
    });
    console.log(response);
    sessionStorage.setItem("token", response.data.jwt);

    checkLoginStatus();
}

let productName = document.querySelector("#productName");
let productPrice = document.querySelector("#productPrice");
let productImage = document.querySelector("#productImage");

const addProduct = async () => {
        //Hämtar ut filen och placerar den i en FormData
        let image = document.querySelector("#productImage").files;
        let imgData = new FormData();
        imgData.append('files', image[0]);
        
        // Laddar upp bild till Strapi.
        axios.post("http://localhost:1337/api/upload", imgData, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        }).then(res => {
            //Placerar den uppladdade filens id i vår nya produkt vi vill lägga till.
            let imageId = res.data[0].id;
            axios.post("http://localhost:1337/api/products", {
                //request body
                    data: {
                        name: productName.value,
                        price: productPrice.value,
                        category: [1],
                        image:imageId
                    }
                },
                {
                    //config
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    }
                })
            })
        
}

const checkLoginStatus = () => {
    if (sessionStorage.getItem("token")){
        document.querySelector("#login-container").classList.add("hidden");
        document.querySelector("#form-container").classList.remove("hidden");
        document.querySelector("#product-list").classList.remove("hidden");
        getProducts();
    }
}

const getProducts = async () => {
    let response = await axios.get("http://localhost:1337/api/products?populate=*"
    ,{
        //config
        headers:{
            Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
    }
    );
    console.log(response.data);

    response.data.data.forEach(product => {
        document.querySelector("#products").innerHTML+= `
        <li>
            <p>${product.attributes.name}</p>
            <p>${product.attributes.price}</p>
        <img src="http://localhost:1337${product.attributes.image.data.attributes.url}" height="100" width="100">
        </li>`
    })
}

const checkMe = async () => {
    let response = await axios.get("http://localhost:1337/api/users/me",
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    console.log(response);
}
checkLoginStatus();