const doctorsData = [
    { id: 1, name: "Dr. Ahmed ben Alam", specialty: "cardiologue", image: "./assets/images/doctor2.png", available: true, description: "Cardiologue expérimenté avec plus de 15 ans d'expérience." },
    { id: 2, name: "Dr. Chaymae Halimi", specialty: "dermatologue", image: "./assets/images/doctor.png", available: true, description: "Spécialiste des maladies de la peau et des soins esthétiques." },
    { id: 3, name: "Dr. Soufian Talbi", specialty: "pediatre", image: "./assets/images/doctor3.png", available: false, description: "Pédiatre dévoué avec une approche douce pour les enfants." },
    { id: 4, name: "Dr. Rajae Slimani", specialty: "generaliste", image: "./assets/images/doctor4.png", available: true, description: "Médecin généraliste avec une approche holistique de la santé." },
    { id: 5, name: "Dr. Walid El Baghdadi", specialty: "ophtalmologue", image: "/assets/images/doctor5.png", available: true, description: "Ophtalmologue spécialisé dans les troubles de la vision." },
    { id: 6, name: "Dr. Romaysae Benkhlif", specialty: "cardiologue", image: "./assets/images/Jean.png", available: true, description: "Cardiologue spécialisée en prévention des maladies cardiaques." }
];

let state = {
    theme: 'light',
    favoriteDoctors: [],
    appointments: [],
    measurements: []
};

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    loadState();
    initializeNavigation();
    initializeCarousel();
    initializeTheme();
    initializeSearch();
    initializeDoctorsPage();
    initializeAppointmentsPage();
    initializeHealthPage();
    // showPage('home');
}

function loadState() {
    const savedState = localStorage.getItem('medicareState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

function saveState() {
    localStorage.setItem('medicareState', JSON.stringify(state));
}

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('d-none');
    });
    document.getElementById(pageId).classList.remove('d-none');
    window.scrollTo(0, 0);
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetPage = this.getAttribute('href').replace(/^#/, '');
            showPage(targetPage);
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            const navbar = document.querySelector('.navbar-collapse');
            if (navbar && navbar.classList.contains('show')) {
                navbar.classList.remove('show');
            }
        });
    });
}

function initializeCarousel() {
    const carousel = new bootstrap.Carousel(document.getElementById('healthTipsCarousel'), {
        interval: 4000
    });
}

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    applyTheme(state.theme);
    themeToggle.addEventListener('click', function () {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        state.theme = newTheme;
        applyTheme(newTheme);
        saveState();
    });
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        if (!document.getElementById('doctors').classList.contains('d-none')) {
            filterDoctors(searchTerm);
        }
        if (!document.getElementById('appointments').classList.contains('d-none')) {
            filterAppointments(searchTerm);
        }
        if (!document.getElementById('health').classList.contains('d-none')) {
            filterMeasurements(searchTerm);
        }
    });
}

function initializeDoctorsPage() {
    const specialtyFilter = document.getElementById('specialtyFilter');
    renderDoctors();
    specialtyFilter.addEventListener('change', function () {
        renderDoctors();
    });
}

function renderDoctors() {
    const doctorsList = document.getElementById('doctorsList');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const selectedSpecialty = specialtyFilter.value;

    let filteredDoctors = doctorsData;
    if (selectedSpecialty !== 'all') {
        filteredDoctors = doctorsData.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    doctorsList.innerHTML = '';

    filteredDoctors.forEach(doctor => {
        const isFavorite = state.favoriteDoctors.includes(doctor.id);
        const availabilityBadge = doctor.available ?
            '<span class="badge" style="background-color: #10b981; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500;">Disponible</span>' :
            '<span class="badge" style="background-color: #ef4444; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500;">Indisponible</span>';

        const doctorCard = document.createElement('div');
        doctorCard.className = 'col-md-6 col-lg-4 mb-4';
        doctorCard.innerHTML = `
                    <div class="card doctor-card h-100">
                        <div class="position-relative">
                            <img src="${doctor.image}" class="card-img-top" alt="${doctor.name}" style=" width:120px; object-fit: cover;">
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${doctor.id}">
                                <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name}</h5>
                            <p class="card-text">
                                <span class="badge bg-primary">${getSpecialtyName(doctor.specialty)}</span>
                                ${availabilityBadge}
                            </p>
                            <p class="card-text">${doctor.description}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary" onclick="selectDoctorForAppointment(${doctor.id})">Prendre Rendez-vous</button>
                        </div>
                    </div>
                `;

        doctorsList.appendChild(doctorCard);
    });

    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function () {
            const doctorId = parseInt(this.getAttribute('data-id'));
            toggleFavoriteDoctor(doctorId);
        });
    });
    updateDoctorsSelect();
}

function getSpecialtyName(specialty) {
    const specialties = {
        'cardiologue': 'Cardiologie',
        'dermatologue': 'Dermatologie',
        'pediatre': 'Pédiatrie',
        'generaliste': 'Médecine générale',
        'ophtalmologue': 'Ophtalmologie'
    };

    return specialties[specialty] || specialty;
}

function toggleFavoriteDoctor(doctorId) {
    const index = state.favoriteDoctors.indexOf(doctorId);

    if (index === -1) {
        state.favoriteDoctors.push(doctorId);
    } else {
        state.favoriteDoctors.splice(index, 1);
    }

    saveState();
    renderDoctors();
}

function filterDoctors(searchTerm) {
    const doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        const doctorName = card.querySelector('.card-title').textContent.toLowerCase();
        const doctorSpecialty = card.querySelector('.badge').textContent.toLowerCase();
        if (doctorName.includes(searchTerm) || doctorSpecialty.includes(searchTerm)) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

function initializeAppointmentsPage() {
    const appointmentForm = document.getElementById('appointmentForm');
    renderAppointments();
    appointmentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateAppointmentForm()) {
            addAppointment();
        }
    });
    document.getElementById('patientName').addEventListener('input', validateField);
    document.getElementById('patientEmail').addEventListener('input', validateField);
    document.getElementById('appointmentDate').addEventListener('change', validateField);
    document.getElementById('appointmentTime').addEventListener('change', validateField);
    document.getElementById('appointmentDoctor').addEventListener('change', validateField);
}


function validateAppointmentForm() {
    let isValid = true;

    const fields = ['patientName', 'patientEmail', 'appointmentDate', 'appointmentTime', 'appointmentDoctor'];

    fields.forEach(fieldId => {
        if (!validateFieldById(fieldId)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(e) {
    validateFieldById(e.target.id);
}

function validateFieldById(fieldId) {
    const field = document.getElementById(fieldId);
    let isValid = true;

    if (fieldId === 'patientName') {
        isValid = field.value.trim().length >= 2;
    } else if (fieldId === 'patientEmail') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
    } else if (fieldId === 'appointmentDate') {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        isValid = selectedDate >= today;
    } else if (fieldId === 'appointmentTime') {
        isValid = field.value !== '';
    } else if (fieldId === 'appointmentDoctor') {
        isValid = field.value !== '';
    }

    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }

    return isValid;
}

function updateDoctorsSelect() {
    const select = document.getElementById('appointmentDoctor');
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    doctorsData.forEach(doctor => {
        if (doctor.available) {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.name} (${getSpecialtyName(doctor.specialty)})`;
            select.appendChild(option);
        }
    });
}

function selectDoctorForAppointment(doctorId) {
    showPage('appointments');

    const select = document.getElementById('appointmentDoctor');
    select.value = doctorId;
    validateFieldById('appointmentDoctor');
}

function addAppointment() {
    const patientName = document.getElementById('patientName').value;
    const patientEmail = document.getElementById('patientEmail').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const appointmentDoctor = parseInt(document.getElementById('appointmentDoctor').value);
    const appointmentReason = document.getElementById('appointmentReason').value;

    const doctor = doctorsData.find(d => d.id === appointmentDoctor);

    const newAppointment = {
        id: Date.now(),
        patientName,
        patientEmail,
        date: appointmentDate,
        time: appointmentTime,
        doctorId: appointmentDoctor,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        reason: appointmentReason
    };

    state.appointments.push(newAppointment);
    saveState();
    renderAppointments();
    document.getElementById('appointmentForm').reset();
    document.querySelectorAll('.is-valid').forEach(field => {
        field.classList.remove('is-valid');
    });

    alert('Votre Rendez-vous est pris avec succès!');
}

function renderAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');

    if (state.appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="text-muted">Aucun rendez-vous prévu.</p>';
        return;
    }

    appointmentsList.innerHTML = '';

    const sortedAppointments = [...state.appointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    sortedAppointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item mb-3 p-3 border rounded';
        appointmentItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${appointment.doctorName}</h6>
                            <p class="mb-1">${getSpecialtyName(appointment.doctorSpecialty)}</p>
                            <p class="mb-1"><small>${formatDate(appointment.date)} à ${appointment.time}</small></p>
                            ${appointment.reason ? `<p class="mb-1"><small>Motif: ${appointment.reason}</small></p>` : ''}
                        </div>
                        <div>
                            <button class="btn btn-outline-primary btn-sm me-1" onclick="editAppointment(${appointment.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteAppointment(${appointment.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

        appointmentsList.appendChild(appointmentItem);
    });
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function deleteAppointment(appointmentId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) {
        state.appointments = state.appointments.filter(a => a.id !== appointmentId);
        saveState();
        renderAppointments();
    }
}

function editAppointment(appointmentId) {
    const appointment = state.appointments.find(a => a.id === appointmentId);

    if (appointment) {
        document.getElementById('patientName').value = appointment.patientName;
        document.getElementById('patientEmail').value = appointment.patientEmail;
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;
        document.getElementById('appointmentDoctor').value = appointment.doctorId;
        document.getElementById('appointmentReason').value = appointment.reason || '';

        validateFieldById('patientName');
        validateFieldById('patientEmail');
        validateFieldById('appointmentDate');
        validateFieldById('appointmentTime');
        validateFieldById('appointmentDoctor');

        deleteAppointment(appointmentId);

        document.getElementById('appointmentForm').scrollIntoView({ behavior: 'smooth' });
    }
}

function filterAppointments(searchTerm) {
    const appointmentItems = document.querySelectorAll('.appointment-item');

    appointmentItems.forEach(item => {
        const doctorName = item.querySelector('h6').textContent.toLowerCase();
        const specialty = item.querySelector('p').textContent.toLowerCase();
        const dateTime = item.querySelectorAll('p')[1].textContent.toLowerCase();
        const reason = item.querySelectorAll('p')[2] ? item.querySelectorAll('p')[2].textContent.toLowerCase() : '';

        if (doctorName.includes(searchTerm) || specialty.includes(searchTerm) ||
            dateTime.includes(searchTerm) || reason.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function initializeHealthPage() {
    const measurementForm = document.getElementById('measurementForm');
    renderMeasurements();
    updateHealthStats();
    measurementForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addMeasurement();
    });
    document.getElementById('measurementDate').valueAsDate = new Date();
}

function addMeasurement() {
    const date = document.getElementById('measurementDate').value;
    const type = document.getElementById('measurementType').value;
    const value = parseFloat(document.getElementById('measurementValue').value);

    const newMeasurement = {
        id: Date.now(),
        date,
        type,
        value
    };

    state.measurements.push(newMeasurement);
    saveState();
    renderMeasurements();
    updateHealthStats();

    document.getElementById('measurementForm').reset();
    document.getElementById('measurementDate').valueAsDate = new Date();
}

function renderMeasurements() {
    const measurementsList = document.querySelector('measurements-list');

    if (!measurementsList) {
        console.error('Element #measurements-list not found');
        return;
    }

    if (state.measurements.length === 0) {
        measurementsList.innerHTML = '<p class="text-muted">Aucune mesure enregistrée.</p>';
        return;
    }

    measurementsList.innerHTML = '';
    const sortedMeasurements = [...state.measurements].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    sortedMeasurements.forEach(measurement => {
        const measurementItem = document.createElement('div');
        measurementItem.className = 'measurement-item mb-3 p-3 border rounded';

        let typeLabel = '';
        let unit = '';

        switch (measurement.type) {
            case 'poids':
                typeLabel = 'Poids';
                unit = 'kg';
                break;
            case 'tension':
                typeLabel = 'Tension artérielle';
                unit = 'mmHg';
                break;
            case 'glycemie':
                typeLabel = 'Glycémie';
                unit = 'mg/dL';
                break;
        }

        measurementItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${typeLabel}</h6>
                            <p class="mb-1">${measurement.value} ${unit}</p>
                            <p class="mb-0"><small>${formatDate(measurement.date)}</small></p>
                        </div>
                        <div>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteMeasurement(${measurement.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="health-indicator ${getHealthIndicatorClass(measurement.type, measurement.value)}"></div>
                `;

        measurementsList.appendChild(measurementItem);
    });
}

function getHealthIndicatorClass(type, value) {
    switch (type) {
        case 'poids':
            // Poids santé approximatif (IMC normal)
            if (value >= 50 && value <= 90) return 'health-good';
            if ((value >= 45 && value < 50) || (value > 90 && value <= 100)) return 'health-warning';
            return 'health-danger';

        case 'tension':
            // Tension artérielle normale
            if (value >= 90 && value <= 120) return 'health-good';
            if ((value >= 80 && value < 90) || (value > 120 && value <= 140)) return 'health-warning';
            return 'health-danger';

        case 'glycemie':
            // Glycémie à jeun normale
            if (value >= 70 && value <= 100) return 'health-good';
            if ((value >= 60 && value < 70) || (value > 100 && value <= 125)) return 'health-warning';
            return 'health-danger';

        default:
            return 'health-good';
    }
}

function deleteMeasurement(measurementId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mesure?')) {
        state.measurements = state.measurements.filter(m => m.id !== measurementId);
        saveState();
        renderMeasurements();
        updateHealthStats();
    }
}

function updateHealthStats() {
    const healthStats = document.getElementById('healthStats');

    if (state.measurements.length === 0) {
        healthStats.innerHTML = '<p class="text-muted">Aucune donnée disponible.</p>';
        return;
    }

    const types = ['poids', 'tension', 'glycemie'];
    let statsHTML = '';

    types.forEach(type => {
        const measurements = state.measurements.filter(m => m.type === type);

        if (measurements.length > 0) {
            const sum = measurements.reduce((total, m) => total + m.value, 0);
            const average = sum / measurements.length;

            let typeLabel = '';
            let unit = '';

            switch (type) {
                case 'poids':
                    typeLabel = 'Poids moyen';
                    unit = 'kg';
                    break;
                case 'tension':
                    typeLabel = 'Tension moyenne';
                    unit = 'mmHg';
                    break;
                case 'glycemie':
                    typeLabel = 'Glycémie moyenne';
                    unit = 'mg/dL';
                    break;
            }

            statsHTML += `
                        <div class="mb-3">
                            <h6>${typeLabel}</h6>
                            <p class="mb-1">${average.toFixed(2)} ${unit}</p>
                            <div class="health-indicator ${getHealthIndicatorClass(type, average)}"></div>
                        </div>
                    `;
        }
    });

    healthStats.innerHTML = statsHTML || '<p class="text-muted">Aucune donnée disponible.</p>';
}

function filterMeasurements(searchTerm) {
    const measurementItems = document.querySelectorAll('.measurement-item');

    measurementItems.forEach(item => {
        const type = item.querySelector('h6').textContent.toLowerCase();
        const value = item.querySelector('p').textContent.toLowerCase();
        const date = item.querySelectorAll('p')[1].textContent.toLowerCase();

        if (type.includes(searchTerm) || value.includes(searchTerm) || date.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}