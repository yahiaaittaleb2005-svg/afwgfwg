import express from "express";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3000);


// utenti temporanei
const users = [];

// registrazione
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ message: "Utente esiste già" });
  users.push({ email, password });
  res.json({ message: "Registrazione completata" });
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Credenziali non valide" });
  res.json({ message: "Login ok", user });
});

// checkout stripe
app.post("/create-checkout-session", async (req, res) => {
  const { name, price } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency: "eur", product_data: { name }, unit_amount: price }, quantity: 1 }],
    mode: "payment",
    success_url: "https://halalhub.onrender.com/success",
    cancel_url: "https://halalhub.onrender.com/cancel",
  });
  res.json({ url: session.url });
});

app.listen(process.env.PORT || 3000, () => console.log("HalalHub avviato 🚀"));
