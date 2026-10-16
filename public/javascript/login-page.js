const username = document.querySelector("#js-username-input")
const password = document.querySelector("#js-password-input")
const login_button = document.querySelector("#js-login-button")

login_button.addEventListener("click", async () => {

    if(!username.value.trim() || !password.value.trim()) {
        alert("Nombre de usuario y contrasena son obligatorios")
        return
    }

    try {

        const response = await fetch('http://localhost:5000/users/login', {

            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({

                username: username.value,
                password: password.value
            })
        } )

        if(!response.ok){

            throw new Error(`Error, ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("login exitoso", data)
    } catch (err) {console.log (`Error al iniciar sesion: ${err.message}`)}
})