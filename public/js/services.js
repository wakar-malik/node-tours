const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const loginForm = document.querySelector(".form-login");
const userPasswordForm = document.querySelector(".form-user-password");
const btnSavePassword = document.querySelector(".btn--save-password");

// alerts
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

// login
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

loginForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

// logout
async function logout() {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:5000/api/v1/users/logout",
    });

    if (res.data.status === "success") location.reload(true);
    showAlert("success", "Logged out successfully!");
  } catch (err) {
    showAlert("error", "Failed to logout, Try again!");
  }
}

logOutBtn?.addEventListener("click", logout);

// update data
async function updateSettings(data, type) {
  try {
    const url =
      type === "password"
        ? "http://localhost:5000/api/v1/users/updateMyPassword"
        : "http://localhost:5000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
}

userDataForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const form = new FormData();
  form.append("name", document.getElementById("name").value);
  form.append("email", document.getElementById("email").value);
  form.append("photo", document.getElementById("photo").files[0]);

  updateSettings(form, "data");
});

userPasswordForm?.addEventListener("submit", async function (e) {
  e.preventDefault();

  btnSavePassword.textContent = "Updating...";
  const currentPassword = document.getElementById("password-current").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("password-confirm").value;

  await updateSettings(
    { currentPassword, password, passwordConfirm },
    "password"
  );

  btnSavePassword.textContent = "Save password";
  document.getElementById("password-current").value =
    document.getElementById("password").value =
    document.getElementById("password-confirm").value =
      "";
});
