fetch('https://join-441-f6d95-default-rtdb.europe-west1.firebasedatabase.app/users/0.json', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "Gast",
    email: "",
    phone: "",
    password: "",
    login: 0,
    badge: "./assets/icons/profilebadge/guest.svg",
  }),
})
  .then(res => res.json())
  .then(data => {
    alert('Gastnutzer wurde erfolgreich wiederhergestellt!');
    console.log('Gast:', data);
  })
  .catch(err => console.error('Fehler beim Erstellen des Gastnutzers:', err));
