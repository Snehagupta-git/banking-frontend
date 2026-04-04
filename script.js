const BASE = "http://localhost:8080/api";
console.log("API BASE URL:");

// 🔐 LOGIN
function login() {
  console.log("Logging in..."); // 🔥 DEBUG LOG
  fetch(BASE + "/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => {
    if (!res.ok) {
      return res.text().then(err => { throw err });
    }
    return res.text();
  })
  .then(token => {

    if (!token) {
      showToast("Login failed ❌", "error");
      return;
    }

    console.log("TOKEN:", token);

    localStorage.setItem("token", token);

    showToast("Login successful ✅", "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000); // 🔥 toast dikhne ka time
  })
  .catch(err => {
    showToast(err || "Login failed ❌", "error");
  });
}
  
function showToast(msg) {
  const toast1 = document.getElementById("toast1");
  toast1.innerText = msg;
  toast1.style.display = "block";

  setTimeout(() => {
    toast1.style.display = "none";
  }, 3000);
}
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// 📝 REGISTER
function register() {
  console.log("Registering user..."); // 🔥 DEBUG LOG
  const username = document.getElementById("username").value;

if (!validateUsername(username)) {
  alert("Invalid username format");
  return;
}
  fetch(BASE + "/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: document.getElementById("name").value,       // 🔥 NEW
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => {
  if (!res.ok) {
    return res.text().then(err => { throw err });
  }
  return res.text();
})
.then(msg => {
  showToast(msg || "Registered successfully ✅", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  })
  .catch(err => {
    showToast(err || "Registration failed ❌", "error");
  });
}

// 🔄 NAVIGATION
function goRegister() {
  window.location = "register.html";
}

function goLogin() {
  window.location = "login.html";
}

// 📊 LOAD DATA
function loadData() {

  // 🔥 GET ACCOUNT
  fetch(BASE + "/accounts/me", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("ACCOUNT:", data);

    document.getElementById("balance").innerText = "₹" + formatINR(data.balance);
    document.getElementById("name").innerText = "Account Holder: (" + data.accountHolderName + ")";
    document.getElementById("myAccountNumber").innerText = "Account Number: " + data.accountNumber;
  });

  // 🔥 GET TRANSACTIONS
  fetch(BASE + "/accounts/me/transactions", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("TRANSACTIONS:", data);

    const list = document.getElementById("transactions");

    // ❗ IMPORTANT CHECK
    if (!list) {
      console.error("transactions element not found");
      return;
    }

    list.innerHTML = "";

    data.forEach(tx => {
      const li = document.createElement("li");

li.innerText = `${tx.type} | ₹${formatINR(tx.amount)} | ${new Date(tx.timestamp).toLocaleString()}`;
      list.appendChild(li);
    });
  });
}
function transactions() {
  fetch(BASE + "/accounts/me/transactions", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {
    const txList = document.getElementById("transactions");
    if (!txList) {
  console.error("Transactions element not found");
  return;
}

txList.innerHTML = "";
    data.forEach(t => {
      let li = document.createElement("li");
li.innerText = `${tx.type} | ₹${formatINR(tx.amount)} | ${new Date(tx.timestamp).toLocaleString()}`;      
txList.appendChild(li);
    });
  });
}

// ➕ DEPOSIT
function deposit() {
      let amount = document.getElementById("amount").value; // 🔥 ADD THIS

  fetch(BASE + "/accounts/me/deposit", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount: parseFloat(amount) })
  })
  
.then(res => {
    if (!res.ok) {
      return res.text().then(err => { throw err });
    }
    return res.json();
  })
  .then(() => {
    showToast("Deposit successful ✅", "success");
    loadData();
  })
  .catch(err => {
    showToast("Error: " + err, "error");
  });
}

// ➖ WITHDRAW
function withdraw() {
      let amount = document.getElementById("amount").value; // 🔥 ADD

  fetch(BASE + "/accounts/me/withdraw", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    
    body: JSON.stringify({ amount: parseFloat(amount) })
  }).then(res => {
    if (!res.ok) {
      return res.text().then(err => { throw err });
    }
    return res.json();
  })
  .then(()=> {
    showToast("Withdrawal successful ✅", "success");
    loadData();
  })
  .catch(err => {
    showToast("Error: " + err, "error");
  });
}


// 🔁 TRANSFER
function transfer() {
        let toAccountNumber = document.getElementById("toAccountNumber"); // 🔥 ADD
        let transferAmount = document.getElementById("transferAmount"); // 🔥 ADD
  fetch(BASE + "/accounts/me/transfer", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      toAccountNumber: document.getElementById("accountNumber").value.trim(),
      amount: parseFloat(document.getElementById("transferAmount").value)
    })
  })
  .then(res => {
    if (!res.ok) {
      return res.text().then(err => { throw err });
    }
    return res.json();
  })
  .then(() => {
    showToast("Transfer successful ✅", "success");
    loadData();
  })
  .catch(err => showToast("Error: " + err, "error"));
}

// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location = "login.html";
}
function validateUsername(username) {
  const regex = /^(?=.*\d).{5,}$/;

  return regex.test(username);
}
 //🔥 LIVE USERNAME VALIDATION
const usernameInput = document.getElementById("username");

if (usernameInput) {
  usernameInput.addEventListener("input", function () {

     const username = this.value;
     const error = document.getElementById("usernameError");

     const regex = /^(?=.*\d).{5,}$/;

     if (error) {   // 🔥 MAIN FIX
       if (!regex.test(username)) {
         error.innerText = "Username must be 5+ chars & include a number";
       } else {
       error.innerText = "";
     }
   }

 });
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN').format(amount);
}
// 🔥 FIXED: usernameInput null error

// 🔥 AUTO LOAD DASHBOARD

if (window.location.pathname.includes("dashboard.html")) {
  window.onload = function () {
    loadData();
  };
}