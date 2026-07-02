const SUPABASE_URL = "https://fpkwfshlhxuicxjrhqyu.supabase.co";
const SUPABASE_KEY = "sb_publishable_CbxJjQY_JYsV1Dblo_08sg_Xp7G4zM6";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showError(message) {
  const errorBox = document.getElementById("errorMessage");
  const successBox = document.getElementById("successMessage");

  if (successBox) successBox.style.display = "none";

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
  } else {
    alert(message);
  }
}

function showSuccess(message) {
  const errorBox = document.getElementById("errorMessage");
  const successBox = document.getElementById("successMessage");

  if (errorBox) errorBox.style.display = "none";

  if (successBox) {
    successBox.textContent = message;
    successBox.style.display = "block";
  } else {
    alert(message);
  }
}

async function signUp() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const signupBtn = document.getElementById("signupBtn");

  if (!fullName || !email || !password) {
    showError("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }

  if (signupBtn) {
    signupBtn.disabled = true;
    signupBtn.textContent = "Creating account...";
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    if (signupBtn) {
      signupBtn.disabled = false;
      signupBtn.textContent = "Sign Up";
    }

    showError(error.message);
    return;
  }

  const user = data.user;

  if (user) {
    const { error: profileError } = await supabaseClient
      .from("user_profiles")
      .insert([
        {
          id: user.id,
          full_name: fullName,
          email: email,
          role: "user"
        }
      ]);

    if (profileError) {
      if (signupBtn) {
        signupBtn.disabled = false;
        signupBtn.textContent = "Sign Up";
      }

      showError(profileError.message);
      return;
    }
  }

  showSuccess("Account created successfully. Please login.");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const loginBtn = document.getElementById("loginBtn");

  if (!email || !password) {
    showError("Please enter email and password.");
    return;
  }

  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }

    showError(error.message);
    return;
  }

  const user = data.user;

  const { data: profile, error: profileError } = await supabaseClient
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }

    showError("Login successful, but this account has no role assigned.");
    return;
  }

  showSuccess("Login successful. Redirecting...");

  setTimeout(() => {
    if (profile.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
  }, 800);
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
