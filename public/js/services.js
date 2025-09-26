const email = document.getElementById("email");
const password = document.getElementById("password");
const logOutBtn = document.querySelector(".nav__el--logout");

function hideAlert() {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
}

function showAlert(type, msg) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  setTimeout(hideAlert, 3000);
}

async function login(email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:5000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      setTimeout(() => location.assign("/"), 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}

document.querySelector(".form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  login(email.value, password.value);
});

async function logout() {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:5000/api/v1/users/logout",
    });

    if (res.data.status === "success") location.reload(true);
    showAlert("success", "Logged out successfully!");
  } catch (err) {
    console.log(err);
    showAlert("error", "Failed to logout, Try again!");
  }
}

logOutBtn?.addEventListener("click", logout);
