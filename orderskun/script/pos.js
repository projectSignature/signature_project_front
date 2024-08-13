
let clients ={
  id:1,
  language:'pt',
  paytype:'',
  selectedOrder:""
}
let selectedCard = null;

document.addEventListener('DOMContentLoaded', async  () => {
    // Simulated data fetch
    const MainData = await makerequest(`${server}/orders/getBasedata?user_id=${clients.id}`)
    let pendingOrders = await fetchPendingOrders(clients.id);
    console.log(pendingOrders)


    let ordersList = document.getElementById('orders-list');
    let orderItems = document.getElementById('order-items');
    let totalAmountElement = document.getElementById('total-amount');
    let depositAmountElement = document.getElementById('deposit-amount');
    let changeAmountElement = document.getElementById('change-amount');



    pendingOrders.forEach(order => {
      console.log(order.id)
      let orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.setAttribute('data-id', order.id); // data-id 属性を設定
      orderCard.innerHTML = `<h3>Table ${order.table_no}</h3><p>${order.order_name}</p>`;

      orderCard.addEventListener('click', () => {
          if (selectedCard) {
              selectedCard.classList.remove('selected-card');
          }

          orderCard.classList.add('selected-card');
          selectedCard = orderCard;

          displayOrderDetails(order);
      });

      ordersList.appendChild(orderCard);
  });

    function displayOrderDetails(order) {
      console.log(order)
        orderItems.innerHTML = ''; // Clear previous items
        clients.selectedOrder = order.id


        order.OrderItems.forEach(item => {
          const menuGt = MainData.menus
              .filter(items => items.id === item.menu_id)
              console.log(item)
              console.log(menuGt)
            let li = document.createElement('li');
            li.textContent = `${menuGt[0].menu_name_pt} x${item.quantity} - ¥${item.item_price * item.quantity}`;
            orderItems.appendChild(li);
        });

        totalAmountElement.textContent = `￥${Math.floor(order.total_amount).toLocaleString()}`;
        updateChange(); // Initial calculation
    }

    depositAmountElement.addEventListener('input', updateChange);

    function updateChange() {
        let deposit = parseInt(depositAmountElement.value) || 0;
        let total = parseInt(totalAmountElement.textContent.replace(/[^\d]/g, '')) || 0;;
        let change = deposit - total;
        changeAmountElement.textContent = change >= 0 ? change : 0;
    }

    // Confirm Payment Button Logic
    document.getElementById('confirm-payment').addEventListener('click', async () => {
    // Assuming you have a selectedOrder variable that stores the current order
    if (!clients.selectedOrder) {
        alert('Seleciona uma comanda');
        return;
    }

    // Update the order in the database
    try {
        const response = await fetch(`${server}/orders/updatePayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: clients.selectedOrder,
                payment_method: clients.paytype,  // The selected payment method from clients object
                order_status: 'confirmed'  // Update the status to 'confirmed'
            })
        });
        console.log(response.status)

        if (response.status===200) {
            showCustomAlert("Registrado")
             console.log(clients.selectedOrder)
            // Remove the order card from the UI
            const orderCard = document.querySelector(`.selected-card[data-id="${clients.selectedOrder}"]`);
           console.log('Found Order Card:', orderCard);
            if (orderCard) {
                orderCard.remove();
            }

            // Optionally, you can clear the order details or reset the UI
            clearOrderDetails();
        } else {
            alert('Erro no registro.');
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Erro no registro.');
    }
});

function showCustomAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 1000); // 1秒間表示
}

// Function to clear the order details from the UI
function clearOrderDetails() {
    document.getElementById('order-items').innerHTML = '';
    document.getElementById('total-amount').textContent = '0';
    document.getElementById('deposit-amount').value = '0';
    document.getElementById('change-amount').textContent = '0';
    clients.paytype = '';  // Reset the payment method
    selectedOrder = null;  // Reset the selected order
    clients.selectedOrder =""
}


    const cashPaymentButton = document.getElementById('cash-payment');
        const creditPaymentButton = document.getElementById('credit-payment');
        const otherPaymentButton = document.getElementById('other-payment');

        const paymentButtons = [cashPaymentButton, creditPaymentButton, otherPaymentButton];

        // Update the paytype in the clients object
        function updatePayType(type) {
            clients.paytype = type;
            console.log(`Payment type selected: ${clients.paytype}`);
        }

        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'selected' class from all buttons
                paymentButtons.forEach(btn => btn.classList.remove('selected'));

                // Add 'selected' class to the clicked button
                button.classList.add('selected');

                // Update the paytype based on the selected button
                if (button === cashPaymentButton) {
                    updatePayType('cash');
                } else if (button === creditPaymentButton) {
                    updatePayType('credit');
                } else if (button === otherPaymentButton) {
                    updatePayType('other');
                }
            });
        });


});


async function fetchPendingOrders() {
    try {
        const response = await fetch(`${server}/orders/pending`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client_id: clients.id })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch pending orders');
        }
        const pendingOrders = await response.json();
        console.log('Pending Orders:', pendingOrders);
        return pendingOrders;
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return null;
    }
}


document.getElementById('menu-btn').addEventListener('click', () => {
    // Handle menu button click
    console.log('Menu button clicked');
});

document.getElementById('history-btn').addEventListener('click', () => {
    // Handle history button click
    console.log('History button clicked');
});

document.getElementById('logout-btn').addEventListener('click', () => {
    // Handle logout button click
    console.log('Logout button clicked');
    // Perform logout actions
});
