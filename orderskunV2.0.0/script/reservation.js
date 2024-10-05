const token = window.localStorage.getItem('token');
const decodedToken = jwt_decode(token); // jwtDecodeではなくjwt_decodeを使用

const currentTime = document.getElementById('current_time');


let clients ={
  userId: 17,
  email: 'rootsgrillhekinan@gmeil.com',
  username: 'RootsGrill',
  table_count: 5, // Quantidade de mesas
  iat: 1727826129
}

if (!decodedToken) {
  // window.location.href = '../index.html';
}

sessionStorage.setItem('userInfo', JSON.stringify(simulatedUserInfo));

function getUserInfo() {
    const userInfo = clients
    return userInfo ? JSON.parse(userInfo) : null;
}

const userInfo = getUserInfo();
const tableCount = userInfo ? userInfo.table_count : 0;

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const japaneseDate = `${year}-${month}-${day}`;

currentTime.textContent = 'Date: ' + japaneseDate;

const createReservationBtn = document.getElementById('create-reservation-btn');
const createReservationModal = document.getElementById('create-reservation-modal');
const closeModalButton = document.querySelector('.close');

createReservationBtn.addEventListener('click', () => {
    createReservationModal.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
    createReservationModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === createReservationModal) {
        createReservationModal.style.display = 'none';
    }
});

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.style.color = type === 'success' ? 'green' : 'red';
    notification.style.padding = '10px';
    notification.style.textAlign = 'center';
    notification.style.fontSize = '16px';
    notification.style.marginTop = '10px';

    notification.textContent = message;

    notificationContainer.style.display = 'block';
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notificationContainer.removeChild(notification);

        if (notificationContainer.children.length === 0) {
            notificationContainer.style.display = 'none';
        }
    }, 3000);
}

function fillTableWithReservations(reservations) {
    const tableContainer = document.getElementById('mesas-container');
    tableContainer.innerHTML = ''; // Limpa qualquer conteúdo existente

    // Ordena as reservas pelo número da mesa (table_number) em ordem crescente
    reservations.sort((a, b) => a.table_number - b.table_number);

    reservations.forEach(reservation => {
        const tableElement = document.createElement('div');
        tableElement.classList.add('mesa');

        tableElement.setAttribute('data-id', `mesa${reservation.table_number}`);
        tableElement.setAttribute('data-reservation-id', reservation.id);

        tableElement.innerHTML = `
            <h2>Mesa ${reservation.table_number}</h2>
            <div>
                <i class="fa-solid fa-user-group"></i>
                <span class="mesa__pessoas">${reservation.num_people}</span>
            </div>
            <span class="mesa__disponivel">Reservada por ${reservation.reservation_name}</span>
        `;

        tableElement.classList.add('reservada');

        tableElement.addEventListener('click', () => openModal(reservation));

        // Adiciona a linha de reserva na tabela
        tableContainer.appendChild(tableElement);
    });
}

function fillReservationsTable(reservations) {
    const tableBody = document.getElementById('reservas-dia-body');
    tableBody.innerHTML = '';

    reservations.forEach(reservation => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${reservation.reservation_name}</td>
            <td>${reservation.table_number}</td>
            <td>${reservation.num_people}</td>
            <td>${reservation.reservation_start_time}</td>
        `;

        tableBody.appendChild(row);
    });
}

function openModal(table) {
    const modal = document.getElementById('mesa-modal');
    const deleteReservationButton = document.getElementById('modal-delete');
    const saveReservationButton = document.getElementById('submit-edit-reservation');
    const closeModalButton = document.querySelector('#close-modal');

    document.getElementById('modal-table-number').value = table.table_number;
    document.getElementById('modal-reservation-name').value = table.reservation_name;
    document.getElementById('modal-num-people').value = table.num_people;
    document.getElementById('modal-phone-number').value = table.phone_number;
    document.getElementById('modal-reservation-date').value = table.reservation_date;
    document.getElementById('modal-start-time').value = table.reservation_start_time;
    document.getElementById('modal-end-time').value = table.reservation_end_time;
    document.getElementById('modal-remarks').value = table.remarks || '';

    modal.style.display = 'block';

    deleteReservationButton.onclick = () => {
        deleteTable(table.id);
    };

    saveReservationButton.onclick = () => {
        editTable(table.id);
    }

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
}

function hasTimeConflict(newReservation, existingReservations) {
    return existingReservations.some(reservation =>
        reservation.table_number == newReservation.table_number &&
        reservation.reservation_date == newReservation.reservation_date &&
        (
            (newReservation.reservation_start_time >= reservation.reservation_start_time &&
             newReservation.reservation_start_time < reservation.reservation_end_time) ||
            (newReservation.reservation_end_time > reservation.reservation_start_time &&
             newReservation.reservation_end_time <= reservation.reservation_end_time) ||
            (newReservation.reservation_start_time <= reservation.reservation_start_time &&
             newReservation.reservation_end_time >= reservation.reservation_end_time)
        )
    );
}

function createReservation() {
    showLoading();

    const tableNumber = document.getElementById('create-table-number').value;

    if (tableNumber > tableCount) {
        hideLoading();
        alert(`Número de mesa não pode exceder ${tableCount}`, 'error');
        return;
    }

    const url = 'https://squid-app-ug7x6.ondigitalocean.app/reservations/create';

    const reservationData = {
        user_id: userInfo.userId,
        reservation_date: document.getElementById('create-reservation-date').value,
        reservation_start_time: document.getElementById('create-start-time').value,
        reservation_end_time: document.getElementById('create-end-time').value,
        table_number: document.getElementById('create-table-number').value,
        reservation_name: document.getElementById('create-reservation-name').value,
        phone_number: document.getElementById('create-phone-number').value,
        num_people: document.getElementById('create-num-people').value,
        remarks: document.getElementById('create-remarks').value || null
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar a reserva');
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showNotification(data.message, 'success');
            document.getElementById('create-reservation-modal').style.display = 'none';
            getTableData();
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        showNotification(error.message, 'error');
        console.error('Erro ao criar a reserva:', error);
    });
}

const submitCreateReservationBtn = document.getElementById('submit-create-reservation');
submitCreateReservationBtn.addEventListener('click', createReservation);

function deleteTable(reservationId) {
    showLoading();
    const url = `${server}reservations/delete/${reservationId}`;

    fetch(url, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar a reserva');
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showNotification(data.message, 'success')

            const tableElement = document.querySelector(`.mesa[data-reservation-id="${reservationId}"]`);
            if (tableElement) {
                tableElement.remove();
            }

            document.getElementById('mesa-modal').style.display = 'none';

            getTableData();
        }
    })
    .catch(error => {
        showNotification(error.message, 'error');
        hideLoading();
        console.error("Erro ao deletar a reserva:", error);
    });
}

function editTable(reservationId) {
    showLoading();
    const url = `${server}reservations/update/${reservationId}`;

    const tableNumber = document.getElementById('modal-table-number').value;

    if (tableNumber > tableCount) {
        hideLoading();
        alert(`Número de mesa não pode exceder ${tableCount}`, 'error');
        return;
    }

    const updatedData = {
        user_id: userInfo.userId,
        reservation_date: document.getElementById('modal-reservation-date').value,
        reservation_start_time: document.getElementById('modal-start-time').value,
        reservation_end_time: document.getElementById('modal-end-time').value,
        table_number: document.getElementById('modal-table-number').value,
        reservation_name: document.getElementById('modal-reservation-name').value,
        phone_number: document.getElementById('modal-phone-number').value,
        num_people: document.getElementById('modal-num-people').value,
        remarks: document.getElementById('modal-remarks').value || null
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao editar a reserva');
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.success) {
            showNotification(data.message, 'success');
            document.getElementById('mesa-modal').style.display = 'none';
            getTableData();
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        showNotification(error.message, 'error');
        hideLoading();
        console.error('Erro ao editar a reserva:', error);
    });
}

function getTableData() {
    showLoading();
    const url = `${server}reservations?user_id=${userInfo.userId}&reservation_date=${japaneseDate}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados das mesas');
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            if (data.success && data.data.length > 0) {
                fillTableWithReservations(data.data);
                fillReservationsTable(data.data);
            } else {
                console.log("Nenhuma reserva encontrada para a data especificada.");
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Erro ao buscar os dados:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    getTableData();
});
