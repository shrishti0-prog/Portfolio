
/* ======================= script.js ======================= */
alert("JS LOADED");
console.log("JS loaded");
AOS.init();

const roles = ["Data Scientist","ML Engineer","NLP Enthusiast"];
let i=0,j=0,current="",deleting=false;

function type(){
  current=roles[i];
  document.querySelector(".typing").textContent=current.substring(0,j);

  if(!deleting && j<current.length) j++;
  else if(deleting && j>0) j--;
  else{
    deleting=!deleting;
    i=(i+1)%roles.length;
  }

  setTimeout(type,deleting?50:100);
}

type();
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

const data = {
  name: formData.get("name"),
  email: formData.get("email"),
  message: formData.get("message"),
};

console.log("FORM DATA:", data); // 👈 keep this for testing

  try {
    const res = await fetch("https://portfolio-production-ae93.up.railway.app/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      status.innerText = "✅ Message sent!";
      form.reset();
    } else {
      status.innerText = "❌ Failed!";
    }
  } catch {
    status.innerText = "⚠ Server error";
  }
});
