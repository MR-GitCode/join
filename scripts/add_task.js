function selectPiority(piority) {
    document.getElementById('bt-urgent').classList.remove('bt-urgent');
    document.getElementById('bt-medium').classList.remove('bt-medium');
    document.getElementById('bt-low').classList.remove('bt-low');
    document.getElementById(`bt-${piority}`).classList.add(`bt-${piority}`);
} 