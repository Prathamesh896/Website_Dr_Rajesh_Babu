document.documentElement.classList.add('js-enabled');

const form = document.getElementById('appointmentForm');
const formMessage = document.getElementById('formMessage');

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -20px 0px',
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const getAppointments = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('clinicAppointments') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveAppointment = (booking) => {
  const appointments = getAppointments();
  appointments.push(booking);
  localStorage.setItem('clinicAppointments', JSON.stringify(appointments));
};

const setMessage = (text, type) => {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
};

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

  const name = document.getElementById('patientName').value.trim();
  const phone = document.getElementById('patientPhone').value.trim();
  const doctor = document.getElementById('doctorSelect').value.trim();
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('visitReason').value.trim();

  if (!name || !phone || !doctor || !date || !time) {
    setMessage('Please complete all required fields before booking.', 'error');
    return;
  }

  const booking = {
    name,
    phone,
    doctor,
    date,
    time,
    reason,
    createdAt: new Date().toISOString(),
  };

    saveAppointment(booking);
    setMessage(`Thank you, ${name}! Your appointment with ${doctor} on ${date} at ${time} has been booked successfully.`, 'success');
    form.reset();
  });
}
