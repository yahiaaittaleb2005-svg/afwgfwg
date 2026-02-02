// Contatti
const form = document.querySelector('#contactForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    alert("📨 Messaggio inviato! Ti risponderemo entro 24h In shaa Allah.");
    form.reset();
  });
}

// Stripe pagamento
document.querySelectorAll(".buy-btn").forEach(btn=>{
  btn.addEventListener("click", async ()=>{
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const resp = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name, price})
    });
    const data = await resp.json();
    if(data.url) window.location.href = data.url;
  });
});
