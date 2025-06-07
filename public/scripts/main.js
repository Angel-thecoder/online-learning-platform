document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
  
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop page reload
  
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();
  
        // Email regex for basic validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        // Basic validation
        if (!name || !email || !message) {
          status.innerText = 'All fields are required.';
          status.style.color = 'red';
          return;
        }
  
        if (!emailPattern.test(email)) {
          status.innerText = 'Please enter a valid email address.';
          status.style.color = 'red';
          return;
        }
  
        if (message.length < 10) {
          status.innerText = 'Message must be at least 10 characters.';
          status.style.color = 'red';
          return;
        }
  
        try {
          const res = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
          });
  
          const data = await res.json();
  
          if (res.ok) {
            status.innerText = 'Message sent successfully!';
            status.style.color = 'green';
            form.reset();
          } else {
            status.innerText = `${data.error || 'Failed to send message.'}`;
            status.style.color = 'red';
          }
        } catch (error) {
          status.innerText = 'Something went wrong. Please try again.';
          status.style.color = 'red';
        }
      });
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    const eventList = document.getElementById('event-list');
  
    if (filterForm && eventList) {
      const selects = filterForm.querySelectorAll('select');
  
      selects.forEach(select => {
        select.addEventListener('change', () => {
          const year = document.getElementById('filter-year').value;
          const type = document.getElementById('filter-type').value;
          const course = document.getElementById('filter-course').value;
          const instructor = document.getElementById('filter-instructor').value;
  
          const params = new URLSearchParams({
            year, type, course, instructor
          });
  
          fetch(`/events/filter?${params.toString()}`)
            .then(res => res.text())
            .then(html => {
              eventList.innerHTML = html;
            })
            .catch(error => {
              eventList.innerHTML = '<p>Error loading events. Please try again.</p>';
              console.error('Event AJAX error:', error);
            });
        });
      });
    }
  });
  