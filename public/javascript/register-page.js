const username = document.querySelector("#js-username-input")
const password = document.querySelector("#js-password-input")
const repeat_password = document.querySelector("#js-password-repeat-input")
const registration_button = document.querySelector("#js-registration-button")
const redirect_button = document.querySelector("#js-redirect-to-login-button")

registration_button.addEventListener('click', async () => {

    if(!username.value.trim() || !password.value.trim() || !repeat_password.value.trim()){

        alert("Todos los campos son obligatorios")
        return

    } else if(password.value.trim() != repeat_password.value.trim()){

        alert("Las contrasenas no coinciden")
        return
    }

    try {

        const response = await fetch('http://localhost:5000/users/register', {
            method: "POST",
            headers: {

                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                username: username.value,
                password: password.value
                
            })
        })

        if(!response.ok){

            throw new Error(`Error, ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Registro exitoso")

        window.location.href = "../html/login-page.html"

    } catch (err) {console.log (`Error al registrar ususario: ${err.message}`)}
})